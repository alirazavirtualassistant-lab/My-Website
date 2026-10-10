import { test, expect } from "@playwright/test";
import { DEMO, signIn, signUp, uniqueEmail, latestMailboxLink } from "./helpers";

test.describe("authentication", () => {
  test("sign up, verify email from the demo mailbox, and reach My Learning", async ({ page }) => {
    const email = uniqueEmail("signup");
    await signUp(page, { name: "E2E Learner", email, password: "Passw0rd!e2e" });
    // In demo mode the user is signed in right away and asked to verify.
    await expect(page).toHaveURL(/\/(verify-email|learn)/);
    const link = await latestMailboxLink(page, email, /\/verify-email\?token=/);
    await page.goto(link);
    await expect(page.getByText(/verified|thank you|all set/i).first()).toBeVisible();
    await page.goto("/learn");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("sign in with the demo learner and sign out", async ({ page }) => {
    await signIn(page, DEMO.learner.email, DEMO.learner.password);
    await expect(page).toHaveURL(/\/learn/);
    await page.goto("/account");
    await expect(page.locator(`input[value="${DEMO.learner.email}"]`).first()).toBeVisible();
    // the sign-out route clears the session cookie (the header menu posts to it)
    const res = await page.request.post("/api/auth/sign-out", { maxRedirects: 0 });
    expect([302, 303]).toContain(res.status());
    await page.goto("/account");
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("wrong password shows an error and protected pages redirect", async ({ page }) => {
    await page.goto("/sign-in");
    await page.fill('input[name="email"]', DEMO.learner.email);
    await page.fill('input[name="password"]', "wrong-password-1");
    await page.locator('form:has(input[name="password"]) button[type="submit"]').first().click();
    await expect(page.getByRole("alert").first()).toBeVisible();
    await page.goto("/learn/baby-steps");
    await expect(page).toHaveURL(/\/sign-in\?next=/);
  });

  test("forgot password sends a reset link that works", async ({ page }) => {
    const email = uniqueEmail("reset");
    await signUp(page, { name: "Reset Me", email, password: "Passw0rd!one" });
    await page.request.post("/api/auth/sign-out", { maxRedirects: 0 });
    await page.goto("/forgot-password");
    await page.fill('input[name="email"]', email);
    await page.locator('form button[type="submit"]').first().click();
    await expect(page.getByText(/check your inbox|if an account exists|sent/i).first()).toBeVisible();
    const link = await latestMailboxLink(page, email, /\/reset-password\?token=/);
    await page.goto(link);
    const pw = page.locator('input[name="password"]').first();
    await pw.fill("Passw0rd!two");
    const confirm = page.locator('input[name="confirm"], input[name="password_confirm"], input[name="confirmPassword"]').first();
    if (await confirm.count()) await confirm.fill("Passw0rd!two");
    await page.locator('form:has(input[name="password"]) button[type="submit"]').first().click();
    await page.waitForURL((u) => !u.pathname.startsWith("/reset-password"), { timeout: 30_000 }).catch(() => {});
    await page.request.post("/api/auth/sign-out", { maxRedirects: 0 });
    await signIn(page, email, "Passw0rd!two");
    await expect(page).toHaveURL(/\/learn/);
  });
});
