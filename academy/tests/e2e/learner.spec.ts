import { test, expect } from "@playwright/test";
import { DEMO, signIn, acceptDisclaimerIfShown, signOut } from "./helpers";

test.describe("dashboard, community and certificates", () => {
  test("My Learning shows continue hero, XP, level, streak, unlocks and badges", async ({ page }) => {
    await signIn(page, DEMO.learner.email, DEMO.learner.password);
    await page.goto("/learn");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/continue|pick up where you left off/i).first()).toBeVisible();
    await expect(page.getByText(/Seedling/).first()).toBeVisible();
    await expect(page.getByText(/day streak|streak/i).first()).toBeVisible();
    await expect(page.getByText(/opens in \d+ days/).first()).toBeVisible();
    await expect(page.getByText(/Minimum goal|Target goal|Stretch goal/).first()).toBeVisible();
  });

  test("community: browse categories, create a post from a lesson link, reply and like", async ({ page }) => {
    await signIn(page, DEMO.learner.email, DEMO.learner.password);
    await page.goto("/community/baby-steps");
    await expect(page.getByText(/Grace over guilt/).first()).toBeVisible();
    await expect(page.getByText("Introductions").first()).toBeVisible();

    await page.goto("/community/baby-steps/new?category=foundations-of-family-wellness&lesson=M1T1");
    await page.fill('input[name="title"]', "My strongest pillar is connection");
    await page.fill('textarea[name="body"]', "Most neglected: sleep. What surprised me was the energy question.");
    await page.locator('form button[type="submit"]').last().click();
    await expect(page).toHaveURL(/\/community\/baby-steps\/post\//, { timeout: 30_000 });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("My strongest pillar is connection");
    await expect(page.getByText(/M1T1|Introduction to Pre-Conception Health/).first()).toBeVisible();

    await page.fill('textarea[name="body"]', "Replying to myself to test the thread.");
    await page.locator('form:has(textarea[name="body"]) button[type="submit"]').last().click();
    await expect(page.getByText("Replying to myself to test the thread.")).toBeVisible({ timeout: 15_000 });

    const like = page.getByRole("button", { name: /like/i }).first();
    await like.click();
    await expect(like).toContainText(/1/, { timeout: 10_000 });
  });

  test("instructor badge shows on Cynthia's pinned welcome post", async ({ page }) => {
    await signIn(page, DEMO.learner.email, DEMO.learner.password);
    await page.goto("/community/baby-steps");
    await page.getByRole("link", { name: /Welcome — introduce yourself here/ }).first().click();
    await expect(page.getByText(/Instructor/).first()).toBeVisible();
  });

  test("certificates page lists progress and the public verify page handles unknown codes", async ({ page }) => {
    await signIn(page, DEMO.learner.email, DEMO.learner.password);
    await page.goto("/certificates");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/in progress|to go|lessons/i).first()).toBeVisible();
    await page.goto("/verify/NOPE12345");
    await expect(page.getByText(/not found|could not find|no certificate/i).first()).toBeVisible();
  });

  test("admin can unlock all modules for a learner; completing every required lesson issues a certificate", async ({ page }) => {
    test.setTimeout(600_000);
    // 1) admin unlocks drip for the demo learner
    await signIn(page, DEMO.admin.email, DEMO.admin.password);
    await page.goto("/admin/students?q=learner%40demo");
    await page.getByRole("link", { name: /Demo Learner/ }).first().click();
    await expect(page).toHaveURL(/\/admin\/students\//);
    // The enrollment table streams in after the shell; wait for the control before acting.
    const unlock = page.getByRole("button", { name: /^(unlock all|all unlocked)$/i }).first();
    await expect(unlock).toBeVisible({ timeout: 20_000 });
    if (/unlock all/i.test((await unlock.textContent()) ?? "")) {
      await unlock.click();
      await expect(page.getByRole("button", { name: /^all unlocked$/i }).first()).toBeVisible({ timeout: 20_000 });
    }
    await signOut(page);

    // 2) learner completes every required lesson (M0–M7)
    await signIn(page, DEMO.learner.email, DEMO.learner.password);
    const codes = ["m0"];
    const perModule: Record<number, number> = { 1: 5, 2: 8, 3: 6, 4: 7, 5: 7, 6: 6, 7: 6 };
    for (let m = 1; m <= 7; m++) for (let t = 0; t <= perModule[m]; t++) codes.push(`m${m}t${t}`);
    for (const code of codes) {
      await page.goto(`/learn/baby-steps/${code}`);
      await acceptDisclaimerIfShown(page);
      const btn = page.getByRole("button", { name: /mark complete/i }).first();
      if (await btn.count()) {
        await btn.click();
        await page.waitForTimeout(400);
      }
    }
    await page.goto("/certificates");
    await expect(page.getByText(/Baby Steps: Your Health Journey Toward Conception/).first()).toBeVisible();
    const download = page.getByRole("link", { name: /download pdf/i }).first();
    await expect(download).toBeVisible();
    const href = await download.getAttribute("href");
    const res = await page.request.get(href!);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/pdf");

    const verifyLink = page.getByRole("link", { name: /verify/i }).first();
    const verifyHref = (await verifyLink.getAttribute("href")) ?? "";
    if (verifyHref) {
      await signOut(page);
      await page.goto(verifyHref);
      await expect(page.getByText(/Demo Learner/).first()).toBeVisible();
      await expect(page.getByText(/verified|valid/i).first()).toBeVisible();
    }
  });
});
