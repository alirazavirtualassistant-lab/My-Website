import { test, expect } from "@playwright/test";

test.describe("public pages", () => {
  test("home renders the hero, featured course and curriculum", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Cradle Your Cravings/);
    await expect(page.getByRole("link", { name: /start your baby steps/i }).first()).toBeVisible();
    await expect(page.locator("main").getByRole("heading", { name: /Baby Steps: Your Health Journey Toward Conception/ }).first()).toBeVisible();
    await expect(page.locator("main").getByRole("heading", { name: /Foundations of Family Wellness/ }).first()).toBeVisible();
    // No invented testimonials: the empty state shows instead.
    await expect(page.getByText(/learner stories will appear here/i)).toBeVisible();
  });

  test("catalog lists Baby Steps and filters by topic", async ({ page }) => {
    await page.goto("/courses");
    await expect(page.locator("main").getByRole("heading", { name: /Baby Steps: Your Health Journey Toward Conception/ }).first()).toBeVisible();
    await page.goto("/courses?topic=cravings");
    await expect(page.locator("main").getByRole("heading", { name: /Baby Steps: Your Health Journey Toward Conception/ }).first()).toBeVisible();
    await page.goto("/courses?q=zzzz-no-such-course");
    await expect(page.locator("main").getByText(/no courses match|nothing matches|clear filters/i).first()).toBeVisible();
  });

  test("course landing page shows price, previews and full curriculum", async ({ page }) => {
    await page.goto("/courses/baby-steps");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Baby Steps");
    await expect(page.getByText("$197").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /buy now/i }).first()).toBeVisible();
    await expect(page.locator("main").getByText("Nutrition for Optimal Fertility").first()).toBeVisible();
    await expect(page.locator("main").getByText(/medical disclaimer/i).first()).toBeVisible();
    // free preview link
    await expect(page.getByRole("link", { name: /Introduction to Pre-Conception Health/ }).first()).toBeVisible();
  });

  test("free preview lesson shows the verbatim transcript and no placeholder links", async ({ page }) => {
    await page.goto("/courses/baby-steps/preview/m1t1");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Introduction to Pre-Conception Health");
    await expect(page.getByText(/I don't want to wait anymore. I want to prepare/).first()).toBeVisible();
    const html = await page.content();
    expect(html).not.toMatch(/href="https?:\/\/(forms\.gle|youtube\.com)/);
    await expect(page.getByText(/video coming soon/i).first()).toBeVisible();
  });

  test("non-preview lesson is not publicly previewable", async ({ page }) => {
    await page.goto("/courses/baby-steps/preview/m1t2");
    // The not-found page renders (status is 404 in production builds; dev streams the shell first).
    await expect(page.getByText(/wandered off the path/i)).toBeVisible();
    await expect(page.getByText(/M1T2: UNDERSTANDING CRAVINGS/i)).toHaveCount(0);
  });

  test("legal, about, pricing, faq, blog and contact render", async ({ page }) => {
    for (const path of ["/about", "/pricing", "/faq", "/blog", "/blog/why-the-next-90-days-matter", "/contact", "/terms", "/privacy", "/refund-policy", "/medical-disclaimer", "/cookies"]) {
      const res = await page.goto(path);
      expect(res?.status(), path).toBe(200);
      await expect(page.getByRole("heading", { level: 1 }), path).toBeVisible();
    }
  });

  test("sitemap and robots exist", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain("/courses/baby-steps");
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toMatch(/Disallow: \/admin/);
  });
});
