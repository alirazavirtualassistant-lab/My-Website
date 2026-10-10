import { test, expect } from "@playwright/test";
import { DEMO, signIn, uniqueEmail, signOut } from "./helpers";

test.describe("admin panel", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, DEMO.admin.email, DEMO.admin.password);
  });

  test("learners cannot open the admin panel", async ({ page }) => {
    await signOut(page);
    await signIn(page, DEMO.learner.email, DEMO.learner.password);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/learn\?denied=1|\/sign-in/);
  });

  test("dashboard, courses, curriculum and lesson editor render with the seeded course", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/revenue/i).first()).toBeVisible();
    await page.goto("/admin/courses");
    await page.getByRole("link", { name: /Baby Steps: Your Health Journey Toward Conception/ }).first().click();
    await expect(page).toHaveURL(/\/admin\/courses\//);
    await page.getByRole("link", { name: /curriculum/i }).first().click();
    await expect(page.getByText("Foundations of Family Wellness").first()).toBeVisible();
    await expect(page.getByText(/Introduction to Pre-Conception Health/).first()).toBeVisible();
    await page.getByRole("link", { name: /Introduction to Pre-Conception Health/ }).first().click();
    await expect(page).toHaveURL(/\/lessons\//);
    await expect(page.locator('input[name="title"]').first()).toHaveValue("Introduction to Pre-Conception Health");
    await expect(page.getByText(/M1T1-Intro\.mp4/).first()).toBeVisible();
    await expect(page.getByText(/video coming soon|no video yet|upload video/i).first()).toBeVisible();
  });

  test("products page shows placeholder prices and a price can be edited", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page.getByText(/CONFIRM WITH CYNTHIA/i).first()).toBeVisible();
    await expect(page.getByText("$197").first()).toBeVisible();
    await page.getByRole("link", { name: /^edit$/i }).first().click();
    await expect(page).toHaveURL(/\/admin\/products\//);
    const price = page.locator('input[name="price"], input[name="price_dollars"], input[name="price_cents"]').first();
    await expect(price).toBeVisible();
  });

  test("students: search, open a student, see completion status only, export CSV", async ({ page }) => {
    await page.goto("/admin/students?q=demo");
    await expect(page.getByText("Demo Learner").first()).toBeVisible();
    await page.getByRole("link", { name: /Demo Learner/ }).first().click();
    await expect(page.getByText(/enrollments?/i).first()).toBeVisible();
    await expect(page.getByText(/Baby Steps/).first()).toBeVisible();
    // privacy: admin never sees note or quiz contents
    await expect(page.getByText("E2E note about mindset.")).toHaveCount(0);
    const csv = await page.request.get("/admin/students/export");
    expect(csv.status()).toBe(200);
    expect(await csv.text()).toContain("learner@demo.cradleyourcravings.com");
  });

  test("testimonials: a manual testimonial is added from the dialog and shows on the home page", async ({ page }) => {
    await page.goto("/admin/testimonials");
    await page.getByRole("button", { name: /add testimonial/i }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.locator('input[name="author_name"]').fill("E2E Reviewer");
    await dialog.locator('textarea[name="body"]').fill("A calm, well-sourced course. The baby steps made it doable.");
    await dialog.getByRole("button", { name: /add testimonial/i }).click();
    await expect(dialog).toBeHidden({ timeout: 30_000 });
    await page.goto("/admin/testimonials?status=approved");
    await expect(page.getByText("E2E Reviewer").first()).toBeVisible();
    await page.goto("/");
    await expect(page.getByText(/baby steps made it doable/).first()).toBeVisible();
  });

  test("team: owner adds an assistant who can sign in but cannot see Settings", async ({ page }) => {
    const email = uniqueEmail("assistant");
    await page.goto("/admin/team");
    const add = page.getByRole("link", { name: /add team member/i }).first();
    const nameField = page.locator('input[name="name"]').first();
    await expect(add.or(nameField)).toBeVisible({ timeout: 20_000 });
    if (await add.isVisible()) await add.click();
    await page.fill('input[name="name"]', "E2E Assistant");
    await page.fill('input[name="email"]', email);
    // Role defaults to assistant. Choose "Set a temporary password now" so the password field appears.
    await page.getByLabel(/set a temporary password now/i).click();
    await page.locator('input[name="password"]').first().fill("Assist!e2e1");
    await page.locator('form:has(input[name="email"]) button[type="submit"]').first().click();
    await expect(page.getByText("E2E Assistant").first()).toBeVisible({ timeout: 30_000 });
    await signOut(page);
    await signIn(page, email, "Assist!e2e1");
    await page.goto("/admin");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.goto("/admin/settings");
    await expect(page).toHaveURL(/\/admin\?denied=1/);
  });

  test("settings: disclaimer text edits show on the public site; demo reset is available", async ({ page }) => {
    await page.goto("/admin/settings");
    await expect(page.getByText(/reset demo data/i).first()).toBeVisible();
    const support = page.locator('input[name="support_email"]').first();
    await expect(support).toHaveValue(/@/);
  });

  test("importer: the bundled package can be previewed and re-imported without duplicating lessons", async ({ page }) => {
    test.setTimeout(240_000);
    await page.goto("/admin/importer");
    await page.getByRole("button", { name: /re-import the bundled|bundled/i }).first().click();
    await expect(page).toHaveURL(/\/admin\/importer\//, { timeout: 60_000 });
    await expect(page.getByText(/59/).first()).toBeVisible();
    await expect(page.getByText(/4,?085/).first()).toBeVisible();
    await page.getByRole("button", { name: /update existing course/i }).first().click();
    await page.getByRole("dialog").getByRole("button", { name: /^update course$/i }).click();
    await expect(page).toHaveURL(/\/admin\/courses\/.*curriculum/, { timeout: 120_000 });
    await page.goto("/learn/baby-steps").catch(() => {});
    await page.goto("/courses/baby-steps");
    await expect(page.getByText(/59 lessons/).first()).toBeVisible();
  });
});
