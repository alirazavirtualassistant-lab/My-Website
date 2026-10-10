/**
 * End-to-end over the mock store: boots the demo seed (Baby Steps + demo
 * learner with some progress), then checks the dashboard loader, the
 * certificate viewer guard and the PDF renderer against real data.
 */
import { beforeAll, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "cyc-dashboard-"));
process.env.DEMO_DATA_DIR = ROOT;
process.env.DEMO_MODE = "1";
process.env.AUTH_SECRET = "test-secret-not-for-production";
process.env.NEXT_PUBLIC_SITE_URL = "https://academy.example.com";

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined, getAll: () => [], has: () => false, set() {}, delete() {} }),
  headers: async () => new Headers(),
}));

const { ensureBootstrapped } = await import("@/lib/usecases/demo");
const { getServices } = await import("@/services");
const { demoAccount } = await import("@/services/mock/seed");
const { loadDashboard, loadLearnerOverview, buildBadgeItems } = await import("@/components/dashboard/dashboard-data");
const { loadCertificateForViewer, qrDataUrlFor } = await import("@/components/certificates/certificate-data");
const { renderCertificatePdf } = await import("@/components/certificates/certificate-pdf");
const { BADGE_DEFINITIONS } = await import("@/lib/usecases/demo");

let learnerId = "";
let adminId = "";
let courseId = "";

beforeAll(async () => {
  await ensureBootstrapped();
  const { db } = await getServices();
  const learner = await db.from("profiles").findOne({ email: demoAccount("learner").email });
  const admin = await db.from("profiles").findOne({ email: demoAccount("admin").email });
  const course = await db.from("courses").findOne({ slug: "baby-steps" });
  if (!learner || !admin || !course) throw new Error("demo seed did not produce the expected rows");
  learnerId = learner.id;
  adminId = admin.id;
  courseId = course.id;
});

describe("buildBadgeItems", () => {
  it("orders course goals first (minimum → target → stretch), then modules, then streaks", () => {
    const items = buildBadgeItems(BADGE_DEFINITIONS, [{ key: "module:M1", awarded_at: "2026-10-01T00:00:00.000Z", course_id: "c" }]);
    expect(items.map((i) => i.key).slice(0, 3)).toEqual(["goal:minimum", "goal:target", "goal:stretch"]);
    expect(items.map((i) => i.key).slice(3, 10)).toEqual(["module:M1", "module:M2", "module:M3", "module:M4", "module:M5", "module:M6", "module:M7"]);
    expect(items.map((i) => i.key).slice(10)).toEqual(["streak:7", "streak:30"]);
    expect(items.find((i) => i.key === "module:M1")).toMatchObject({ earned: true, awardedAt: "2026-10-01T00:00:00.000Z", group: "module" });
    expect(items.find((i) => i.key === "goal:minimum")?.description).toContain("Minimum goal (50 XP)");
  });
});

describe("loadDashboard (demo learner)", () => {
  it("points the hero at M1T2 with the resume position and reports the seeded progress", async () => {
    const data = await loadDashboard(learnerId, "learner", null);
    expect(data.courses).toHaveLength(1);
    const view = data.courses[0];
    expect(view.course.slug).toBe("baby-steps");
    expect(view.state.summary.completedLessons).toBe(3);
    expect(view.state.summary.totalLessons).toBe(59);
    expect(view.state.courseXp.total).toBe(4085);
    expect(view.courseXpEarned).toBeGreaterThan(0);
    expect(view.courseXpEarned).toBe(data.overview.xpTotal);

    expect(data.continuePick).not.toBeNull();
    expect(data.continuePick!.href).toBe("/learn/baby-steps/m1t2");
    expect(data.continuePick!.resumeSec).toBe(215);
    expect(data.continuePick!.moduleCode).toBe("M1");
    expect(data.continuePick!.unlocked).toBe(true);

    // Enrolled 10 days ago: M1 (0d) and M2 (7d) are open; M3 (14d) is the next unlock.
    expect(view.nextUnlock?.moduleCode).toBe("M3");
    expect(data.unlocks.map((u) => u.moduleCode)).toEqual(["M3", "M4", "M5", "M6", "M7"]);
    expect(data.unlocks[0].phrase).toMatch(/opens in \d+ days/);

    expect(data.overview.level.level.key).toBe("seedling");
    expect(data.overview.streak.current).toBe(3);
    expect(data.overview.streak.activeToday).toBe(true);
    expect(data.overview.badges).toHaveLength(BADGE_DEFINITIONS.length);
    expect(data.certificates).toEqual([]);
    expect(data.recommended).toEqual([]); // enrolled in the only published course
    expect(data.previews).toEqual([]); // previews are only loaded for the empty state
  });

  it("returns a calm empty state with preview lessons for a learner with no enrolments", async () => {
    const data = await loadDashboard(adminId, "learner", null);
    expect(data.courses).toEqual([]);
    expect(data.continuePick).toBeNull();
    expect(data.recommended.map((c) => c.slug)).toEqual(["baby-steps"]);
    expect(data.previews.length).toBeGreaterThan(0);
    expect(data.previews[0].href).toMatch(/^\/courses\/baby-steps\/preview\/[a-z0-9-]+$/);
    const overview = await loadLearnerOverview(adminId, "America/New_York");
    expect(overview.xpTotal).toBe(0);
    expect(overview.streak.current).toBe(0);
  });
});

describe("certificates", () => {
  it("guards by owner, lets admins through only when asked, and renders a real PDF", async () => {
    const { db } = await getServices();
    const cert = await db.from("certificates").insert({
      id: "cert-test-1",
      user_id: learnerId,
      course_id: courseId,
      issued_at: "2026-10-10T12:00:00.000Z",
      verify_code: "K7PQ2MXD4R",
      learner_name: "Demo Learner",
      course_title: "Baby Steps: Your Health Journey Toward Conception",
      revoked_at: null,
    });
    const asLearner = { user_id: learnerId, email: "l@example.com", role: "learner" as const, provider: "mock" as const, remember: false };
    const asAdmin = { user_id: adminId, email: "a@example.com", role: "admin" as const, provider: "mock" as const, remember: false };
    expect((await loadCertificateForViewer(cert.id, asLearner))?.id).toBe(cert.id);
    expect(await loadCertificateForViewer(cert.id, asAdmin)).toBeNull();
    expect((await loadCertificateForViewer(cert.id, asAdmin, { allowAdmin: true }))?.id).toBe(cert.id);
    expect(await loadCertificateForViewer("nope", asAdmin, { allowAdmin: true })).toBeNull();

    const verifyUrl = "https://academy.example.com/verify/K7PQ2MXD4R";
    const qrDataUrl = await qrDataUrlFor(verifyUrl, 128);
    expect(qrDataUrl.startsWith("data:image/png;base64,")).toBe(true);

    const pdf = await renderCertificatePdf({
      certificateId: cert.id,
      verifyCode: cert.verify_code,
      verifyUrl,
      learnerName: cert.learner_name,
      courseTitle: cert.course_title,
      issuedAt: cert.issued_at,
      qrDataUrl,
    });
    expect(Buffer.isBuffer(pdf)).toBe(true);
    expect(pdf.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    expect(pdf.byteLength).toBeGreaterThan(5_000);
    // A4 landscape media box (842 x 595 pt) is present in the page dictionary.
    expect(pdf.toString("latin1")).toMatch(/MediaBox \[0 0 841\.8\d+ 595\.2\d+\]/);
    fs.writeFileSync(path.join(ROOT, "certificate.pdf"), pdf);
  });
});
