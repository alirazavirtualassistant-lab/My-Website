import { test, expect } from "@playwright/test";
import { DEMO, signIn, acceptDisclaimerIfShown } from "./helpers";

test.describe("course player", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, DEMO.learner.email, DEMO.learner.password);
  });

  test("course overview shows progress, modules and drip locks", async ({ page }) => {
    await page.goto("/learn/baby-steps");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Baby Steps");
    await expect(page.getByText(/59 lessons/).first()).toBeVisible();
    await expect(page.getByText("Foundations of Family Wellness").first()).toBeVisible();
    await expect(page.getByText(/opens in \d+ days/).first()).toBeVisible();
  });

  test("lesson page has tabs, verbatim transcript, resources and action steps with XP", async ({ page }) => {
    await page.goto("/learn/baby-steps/m1t2");
    await acceptDisclaimerIfShown(page);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Understanding Cravings and Triggers");
    for (const tab of [/overview/i, /transcript/i, /resources/i, /action steps/i, /notes/i, /discussion/i]) {
      await expect(page.getByRole("tab", { name: tab })).toBeVisible();
    }
    await page.getByRole("tab", { name: /transcript/i }).click();
    await expect(page.getByText(/M1T2: UNDERSTANDING CRAVINGS AND TRIGGERS/i).first()).toBeVisible();
    await page.getByRole("tab", { name: /resources/i }).click();
    await expect(page.getByText("Triggers Worksheet").first()).toBeVisible();
    await page.getByRole("tab", { name: /action steps/i }).click();
    await expect(page.getByText("Identify 3 Triggers")).toBeVisible();
    await expect(page.getByText("+40 XP").first()).toBeVisible();
  });

  test("ticking an action step awards XP and mark complete advances", async ({ page }) => {
    await page.goto("/learn/baby-steps/m1t4");
    await acceptDisclaimerIfShown(page);
    await page.getByRole("tab", { name: /action steps/i }).click();
    await page.waitForTimeout(300);
    const box = page.locator('[role="tabpanel"] button[role="checkbox"]').first();
    const wasChecked = (await box.getAttribute("aria-checked")) === "true" || (await box.isChecked().catch(() => false));
    if (!wasChecked) {
      await box.click();
      await expect(page.getByText(/40 \/ 90 XP|40 of 90 XP/).first()).toBeVisible({ timeout: 15_000 });
    }
    await page.getByRole("button", { name: /mark complete/i }).first().click();
    await expect(page).toHaveURL(/\/learn\/baby-steps\/m1t5/, { timeout: 20_000 });
  });

  test("locked lessons show when they open instead of content", async ({ page }) => {
    await page.goto("/learn/baby-steps/m3t1");
    await acceptDisclaimerIfShown(page);
    await expect(page.getByText(/Module 3 opens on/i)).toBeVisible();
    await expect(page.getByText(/M3T1: GENTLE YOGA/i)).toHaveCount(0);
  });

  test("quiz page renders the verbatim Wellness Quiz and scores it", async ({ page }) => {
    await page.goto("/learn/baby-steps/m1t1/quiz/wellness-quiz");
    await acceptDisclaimerIfShown(page);
    await expect(page.getByText(/I ate vegetables at two or more meals a day/)).toBeVisible();
    const radios = page.locator('input[type="radio"], [role="radio"]');
    expect(await radios.count()).toBeGreaterThanOrEqual(100);
    // pick the last option of every question (grouped by name / radiogroup)
    const names = new Set<string>();
    for (const r of await radios.all()) {
      const name = (await r.getAttribute("name")) ?? (await r.getAttribute("data-group")) ?? "";
      if (name) names.add(name);
    }
    if (names.size >= 25) {
      for (const name of names) await page.locator(`input[type="radio"][name="${name}"]`).last().check({ force: true });
    } else {
      const groups = page.locator('[role="radiogroup"], fieldset');
      for (let i = 0; i < (await groups.count()); i++) await groups.nth(i).locator('[role="radio"], input[type="radio"]').last().click({ force: true });
    }
    for (const field of await page.locator('form input[type="text"], form textarea').all()) await field.fill("Nutrition");
    await page.locator('form button[type="submit"]').last().click();
    await expect(page.getByText(/rooted|growing|seedling/i).first()).toBeVisible({ timeout: 20_000 });
  });

  test("notes can be saved and exported", async ({ page }) => {
    await page.goto("/learn/baby-steps/m1t3");
    await acceptDisclaimerIfShown(page);
    await page.getByRole("tab", { name: /notes/i }).click();
    await page.locator('[role="tabpanel"] textarea').first().fill("E2E note about mindset.");
    await page.getByRole("button", { name: /save note/i }).click();
    await expect(page.getByText("E2E note about mindset.").first()).toBeVisible({ timeout: 15_000 });
    await page.goto("/learn/baby-steps/notes");
    await expect(page.getByText("E2E note about mindset.").first()).toBeVisible();
  });
});
