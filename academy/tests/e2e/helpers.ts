import { expect, type Page } from "@playwright/test";

export const DEMO = {
  learner: { email: "learner@demo.cradleyourcravings.com", password: "BabySteps!demo1" },
  admin: { email: "cynthia@demo.cradleyourcravings.com", password: "Admin!demo1" },
  partner: { email: "partner@demo.cradleyourcravings.com", password: "Partner!demo1" },
};

export function uniqueEmail(prefix = "e2e") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.test`;
}

export async function dismissCookieBanner(page: Page) {
  const btn = page.getByRole("button", { name: /essential only/i });
  if (await btn.count()) await btn.first().click().catch(() => {});
}

export async function signIn(page: Page, email: string, password: string) {
  await page.goto("/sign-in");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await Promise.all([
    page.waitForURL((u) => !u.pathname.startsWith("/sign-in"), { timeout: 30_000 }),
    page.locator('form:has(input[name="password"]) button[type="submit"]').first().click(),
  ]);
  await dismissCookieBanner(page);
}

export async function signUp(page: Page, { name, email, password }: { name: string; email: string; password: string }) {
  await page.goto("/sign-up");
  await page.fill('input[name="name"]', name);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  const consent = page.locator('#su-consent, [role="checkbox"][id*="consent"], input[name="consent"]').first();
  if (await consent.count()) {
    const state = await consent.getAttribute("aria-checked");
    if (state !== "true") await consent.click();
  }
  await Promise.all([
    page.waitForURL((u) => !u.pathname.startsWith("/sign-up"), { timeout: 30_000 }),
    page.locator('form:has(input[name="password"]) button[type="submit"]').first().click(),
  ]);
  await dismissCookieBanner(page);
}

export async function acceptDisclaimerIfShown(page: Page) {
  const btn = page.getByRole("button", { name: /i understand/i });
  if (await btn.count()) {
    await btn.first().click();
    await expect(btn).toHaveCount(0, { timeout: 10_000 });
  }
}

/** Reads the newest email in the demo mailbox and returns the first link matching `pattern`. */
export async function latestMailboxLink(page: Page, to: string, pattern: RegExp): Promise<string> {
  await page.goto("/dev/mailbox");
  const row = page.locator("ul li a").filter({ hasText: to }).first();
  await expect(row).toBeVisible({ timeout: 15_000 });
  await row.click();
  const frame = page.frameLocator("iframe");
  const links = frame.locator("a");
  const n = await links.count();
  for (let i = 0; i < n; i++) {
    const href = await links.nth(i).getAttribute("href");
    if (href && pattern.test(href)) return href;
  }
  throw new Error(`No link matching ${pattern} in the latest email to ${to}`);
}
