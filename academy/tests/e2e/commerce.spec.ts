import { test, expect } from "@playwright/test";
import { DEMO, signIn, signUp, uniqueEmail, dismissCookieBanner, signOut, latestMailboxLink } from "./helpers";

test.describe("commerce (mock payments)", () => {
  test("new learner buys Baby Steps through the test checkout and is enrolled", async ({ page }) => {
    const email = uniqueEmail("buyer");
    await signUp(page, { name: "Buyer One", email, password: "Passw0rd!buy" });

    await page.goto("/courses/baby-steps");
    await dismissCookieBanner(page);
    await page.getByRole("button", { name: /buy now/i }).first().click();
    await expect(page).toHaveURL(/\/checkout/, { timeout: 30_000 });
    await expect(page.getByText("$197").first()).toBeVisible();

    const consent = page.locator('[role="checkbox"], input[type="checkbox"]').first();
    if ((await consent.getAttribute("aria-checked")) !== "true" && !(await consent.isChecked().catch(() => false))) await consent.click();
    await page.getByRole("button", { name: /pay securely/i }).click();
    await expect(page).toHaveURL(/\/checkout\/mock\//, { timeout: 30_000 });
    await expect(page.getByText(/test mode/i).first()).toBeVisible();
    await page.getByRole("button", { name: /^pay/i }).first().click();
    await expect(page).toHaveURL(/\/checkout\/success/, { timeout: 30_000 });
    await expect(page.getByText(/start learning/i).first()).toBeVisible({ timeout: 30_000 });

    // Enrollment was created by the (mock) webhook path.
    await page.goto("/learn/baby-steps");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Baby Steps");
    await expect(page.getByText(/0 of 59 lessons|59 lessons/).first()).toBeVisible();

    // Receipt email exists in the demo mailbox.
    await page.goto("/dev/mailbox");
    await expect(page.locator("ul li").filter({ hasText: email }).filter({ hasText: /receipt|order|welcome to baby steps/i }).first()).toBeVisible();
  });

  test("coupon auto-apply link pre-fills the code and the cart shows the discount", async ({ page }) => {
    await signIn(page, DEMO.admin.email, DEMO.admin.password);
    // create a coupon in admin
    await page.goto("/admin/coupons/new");
    await page.fill('input[name="code"]', "E2E20");
    const percent = page.locator('input[name="amount"]');
    await percent.fill("20");
    await page.locator('form button[type="submit"]').first().click();
    await expect(page).toHaveURL(/\/admin\/coupons/, { timeout: 30_000 });
    await signOut(page);

    await page.goto("/courses/baby-steps?coupon=E2E20");
    await expect(page.locator('input[name="coupon"]').first()).toHaveValue("E2E20");
    await page.getByRole("button", { name: /add to cart/i }).first().click();
    await expect(page.getByRole("link", { name: /cart, empty/i })).toHaveCount(0, { timeout: 20_000 });
    await page.goto("/cart");
    await page.fill('input[name="coupon"]', "E2E20");
    await page.locator('form:has(input[name="coupon"]) button[type="submit"]').first().click();
    await expect(page.getByText(/-\$39\.40|−\$39\.40|\$157\.60/).first()).toBeVisible({ timeout: 15_000 });
  });

  test("gift purchase emails a redeem link that enrols the recipient", async ({ page }) => {
    const buyer = uniqueEmail("gifter");
    const recipient = uniqueEmail("recipient");
    await signUp(page, { name: "Gifter", email: buyer, password: "Passw0rd!gift" });
    await page.goto("/courses/baby-steps");
    await page.getByRole("button", { name: /gift this course/i }).first().click();
    await expect(page).toHaveURL(/\/checkout\?gift=1/, { timeout: 30_000 });
    await page.fill('input[name="recipient_name"]', "Gift Recipient");
    await page.fill('input[name="recipient_email"]', recipient);
    const consent = page.locator('[role="checkbox"], input[type="checkbox"]').first();
    if ((await consent.getAttribute("aria-checked")) !== "true" && !(await consent.isChecked().catch(() => false))) await consent.click();
    await page.getByRole("button", { name: /pay securely/i }).click();
    await expect(page).toHaveURL(/\/checkout\/mock\//, { timeout: 30_000 });
    await page.getByRole("button", { name: /^pay/i }).first().click();
    await expect(page).toHaveURL(/\/checkout\/success/, { timeout: 30_000 });
    await expect(page.getByText(/gift/i).first()).toBeVisible({ timeout: 30_000 });

    // find the redeem link
    const redeem = await latestMailboxLink(page, recipient, /\/gift\//);

    // recipient signs up and redeems
    await signOut(page);
    await signUp(page, { name: "Gift Recipient", email: recipient, password: "Passw0rd!rcpt" });
    await page.goto(redeem);
    await page.getByRole("button", { name: /add it to my account|redeem/i }).first().click();
    await expect(page).toHaveURL(/\/learn\/baby-steps/, { timeout: 30_000 });
  });

  test("partner seat: owner invites a partner who accepts and shares the couple space", async ({ page }) => {
    const owner = uniqueEmail("owner");
    const partner = uniqueEmail("partner");
    await signUp(page, { name: "Seat Owner", email: owner, password: "Passw0rd!own" });
    await page.goto("/courses/baby-steps");
    await page.getByRole("button", { name: /buy now/i }).first().click();
    const consent = page.locator('[role="checkbox"], input[type="checkbox"]').first();
    if ((await consent.getAttribute("aria-checked")) !== "true" && !(await consent.isChecked().catch(() => false))) await consent.click();
    await page.getByRole("button", { name: /pay securely/i }).click();
    await expect(page).toHaveURL(/\/checkout\/mock\//, { timeout: 30_000 });
    await page.getByRole("button", { name: /^pay/i }).first().click();
    await expect(page).toHaveURL(/\/checkout\/success/, { timeout: 30_000 });
    await expect(page.getByText(/start learning/i).first()).toBeVisible({ timeout: 30_000 });

    await page.goto("/learn/baby-steps/couple");
    await page.fill('input[name="email"]', partner);
    await page.locator('form:has(input[name="email"]) button[type="submit"]').first().click();
    await expect(page.getByText(/invit/i).first()).toBeVisible({ timeout: 15_000 });

    const accept = await latestMailboxLink(page, partner, /\/partner\//);

    await signOut(page);
    await signUp(page, { name: "Seat Partner", email: partner, password: "Passw0rd!prt" });
    await page.goto(accept);
    await page.getByRole("button", { name: /join as partner|accept/i }).first().click();
    await expect(page).toHaveURL(/\/learn\/baby-steps/, { timeout: 30_000 });
    await page.goto("/learn/baby-steps/couple");
    await expect(page.getByText("Seat Owner").first()).toBeVisible();
    await expect(page.getByText("Partner Involvement Basics").first()).toBeVisible();
  });
});
