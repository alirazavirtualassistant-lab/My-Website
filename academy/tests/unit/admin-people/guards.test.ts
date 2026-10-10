import { describe, expect, it } from "vitest";
import {
  canChangeRole,
  canDeleteUser,
  canRemoveTeamMember,
  normalizeCouponCode,
  reportResolution,
  selectBroadcastRecipients,
  type Actor,
} from "@/lib/usecases/admin-people";

const owner: Actor = { user_id: "owner-1", role: "admin" };
const assistant: Actor = { user_id: "asst-1", role: "assistant" };
const learner: Actor = { user_id: "learner-1", role: "learner" };

describe("canChangeRole", () => {
  it("lets the owner promote a learner to assistant or admin", () => {
    expect(canChangeRole({ actor: owner, targetId: "u1", targetRole: "learner", newRole: "assistant", adminCount: 1 })).toEqual({ ok: true });
    expect(canChangeRole({ actor: owner, targetId: "u1", targetRole: "learner", newRole: "admin", adminCount: 1 })).toEqual({ ok: true });
  });

  it("refuses assistants and learners", () => {
    expect(canChangeRole({ actor: assistant, targetId: "u1", targetRole: "learner", newRole: "assistant", adminCount: 2 }).ok).toBe(false);
    expect(canChangeRole({ actor: learner, targetId: "u1", targetRole: "learner", newRole: "admin", adminCount: 2 }).ok).toBe(false);
  });

  it("never lets you change your own role (no self-demotion)", () => {
    const res = canChangeRole({ actor: owner, targetId: owner.user_id, targetRole: "admin", newRole: "learner", adminCount: 5 });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reason).toMatch(/own role/i);
  });

  it("protects the last owner from demotion", () => {
    const res = canChangeRole({ actor: owner, targetId: "other-admin", targetRole: "admin", newRole: "assistant", adminCount: 1 });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reason).toMatch(/last owner/i);
    expect(canChangeRole({ actor: owner, targetId: "other-admin", targetRole: "admin", newRole: "assistant", adminCount: 2 })).toEqual({ ok: true });
  });

  it("rejects unknown roles and treats a no-op as fine", () => {
    expect(canChangeRole({ actor: owner, targetId: "u1", targetRole: "learner", newRole: "superuser" as never, adminCount: 2 }).ok).toBe(false);
    expect(canChangeRole({ actor: owner, targetId: "u1", targetRole: "assistant", newRole: "assistant", adminCount: 2 })).toEqual({ ok: true });
  });
});

describe("canDeleteUser", () => {
  it("lets admins and assistants remove learners", () => {
    expect(canDeleteUser({ actor: owner, targetId: "u1", targetRole: "learner", adminCount: 1 })).toEqual({ ok: true });
    expect(canDeleteUser({ actor: assistant, targetId: "u1", targetRole: "learner", adminCount: 1 })).toEqual({ ok: true });
  });

  it("blocks learners, self-deletion, assistants removing team members and deleting the last owner", () => {
    expect(canDeleteUser({ actor: learner, targetId: "u1", targetRole: "learner", adminCount: 1 }).ok).toBe(false);
    expect(canDeleteUser({ actor: owner, targetId: owner.user_id, targetRole: "admin", adminCount: 3 }).ok).toBe(false);
    expect(canDeleteUser({ actor: assistant, targetId: "asst-2", targetRole: "assistant", adminCount: 2 }).ok).toBe(false);
    expect(canDeleteUser({ actor: owner, targetId: "admin-2", targetRole: "admin", adminCount: 1 }).ok).toBe(false);
    expect(canDeleteUser({ actor: owner, targetId: "admin-2", targetRole: "admin", adminCount: 2 })).toEqual({ ok: true });
  });
});

describe("canRemoveTeamMember", () => {
  it("only applies to team accounts and follows the role-change rules", () => {
    expect(canRemoveTeamMember({ actor: owner, targetId: "u1", targetRole: "learner", adminCount: 2 }).ok).toBe(false);
    expect(canRemoveTeamMember({ actor: owner, targetId: "asst-1", targetRole: "assistant", adminCount: 1 })).toEqual({ ok: true });
    expect(canRemoveTeamMember({ actor: owner, targetId: "admin-2", targetRole: "admin", adminCount: 1 }).ok).toBe(false);
    expect(canRemoveTeamMember({ actor: owner, targetId: owner.user_id, targetRole: "admin", adminCount: 2 }).ok).toBe(false);
  });
});

describe("selectBroadcastRecipients", () => {
  const prefs = (newsletter: boolean) => ({ progress_nudges: true, drip_unlocks: true, newsletter, community: true });
  const profiles = [
    { id: "a", email: "a@example.com", name: "A", deleted_at: null, email_preferences: prefs(true) },
    { id: "b", email: "b@example.com", name: "B", deleted_at: null, email_preferences: prefs(false) },
    { id: "c", email: "c@example.com", name: "C", deleted_at: "2026-01-01T00:00:00.000Z", email_preferences: prefs(true) },
    { id: "d", email: "D@EXAMPLE.COM", name: "D", deleted_at: null, email_preferences: prefs(true) },
    { id: "d2", email: "d@example.com", name: "D again", deleted_at: null, email_preferences: prefs(true) },
    { id: "e", email: "not-an-email", name: "E", deleted_at: null, email_preferences: prefs(true) },
  ];
  const enrollments = [
    { user_id: "a", course_id: "course-1", status: "active" as const },
    { user_id: "b", course_id: "course-1", status: "active" as const },
    { user_id: "d", course_id: "course-1", status: "revoked" as const },
    { user_id: "d2", course_id: "course-1", status: "active" as const },
  ];
  const certificates = [{ user_id: "a", course_id: "course-1", revoked_at: null }];

  it("'all' honours the newsletter preference, skips deleted/bad addresses and de-duplicates emails", () => {
    const out = selectBroadcastRecipients({ profiles, enrollments, certificates, audience: "all", courseId: null });
    expect(out.map((p) => p.id)).toEqual(["a", "d"]);
  });

  it("'course' needs a course and an active enrollment", () => {
    expect(selectBroadcastRecipients({ profiles, enrollments, certificates, audience: "course", courseId: null })).toEqual([]);
    const out = selectBroadcastRecipients({ profiles, enrollments, certificates, audience: "course", courseId: "course-1" });
    expect(out.map((p) => p.id)).toEqual(["a", "d2"]);
  });

  it("'incomplete' drops learners who already hold a live certificate", () => {
    const out = selectBroadcastRecipients({ profiles, enrollments, certificates, audience: "incomplete", courseId: "course-1" });
    expect(out.map((p) => p.id)).toEqual(["d2"]);
    const revoked = selectBroadcastRecipients({ profiles, enrollments, certificates: [{ ...certificates[0], revoked_at: "2026-02-01T00:00:00.000Z" }], audience: "incomplete", courseId: "course-1" });
    expect(revoked.map((p) => p.id)).toEqual(["a", "d2"]);
  });
});

describe("reportResolution", () => {
  it("maps moderation actions to content + report states", () => {
    expect(reportResolution("hide")).toEqual({ contentStatus: "hidden", reportStatus: "resolved" });
    expect(reportResolution("remove")).toEqual({ contentStatus: "removed", reportStatus: "resolved" });
    expect(reportResolution("dismiss")).toEqual({ contentStatus: null, reportStatus: "dismissed" });
  });
});

describe("normalizeCouponCode", () => {
  it("uppercases and strips anything that is not a letter, digit, dash or underscore", () => {
    expect(normalizeCouponCode("  launch20 ")).toBe("LAUNCH20");
    expect(normalizeCouponCode("spring-sale_2026!")).toBe("SPRING-SALE_2026");
    expect(normalizeCouponCode("a".repeat(60))).toHaveLength(40);
  });
});
