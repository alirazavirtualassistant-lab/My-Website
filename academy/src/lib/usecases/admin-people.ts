import "server-only";
import { getServices } from "@/services";
import type { Session } from "@/services/types";
import type { Broadcast, Certificate, Enrollment, ForumPost, ForumReport, Profile, Role, Testimonial } from "@/lib/types";
import { isValidEmail, newId, normalizeEmail, nowIso } from "@/lib/utils";
import { site } from "@/lib/config/site";
import { grantEnrollment, revokeEnrollment } from "./fulfilment";
import { deleteUserAccount, logAudit } from "./users";

/**
 * Admin "people" use cases: role changes, comp enrollments, access toggles,
 * certificate revocation, community moderation, testimonial moderation,
 * broadcasts and team accounts. Every mutation writes an audit_log row.
 *
 * The guard functions at the top are pure (no I/O) so they can be unit
 * tested; the async functions below apply them against the data store.
 */

// ---------------------------------------------------------------------------
// Pure guards
// ---------------------------------------------------------------------------

export type Actor = Pick<Session, "user_id" | "role">;
export type GuardResult = { ok: true } | { ok: false; reason: string };

export const ROLES: readonly Role[] = ["learner", "assistant", "admin"];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export interface RoleChangeInput {
  actor: Actor;
  targetId: string;
  targetRole: Role;
  newRole: Role;
  /** Live (non-deleted) owner accounts, including the target when it is one. */
  adminCount: number;
}

/** Owner-only. You cannot change your own role, and the last owner can never be demoted. */
export function canChangeRole({ actor, targetId, targetRole, newRole, adminCount }: RoleChangeInput): GuardResult {
  if (actor.role !== "admin") return { ok: false, reason: "Only the owner can change roles." };
  if (!isRole(newRole)) return { ok: false, reason: "That role does not exist." };
  if (actor.user_id === targetId) return { ok: false, reason: "You can't change your own role. Ask another owner to do it." };
  if (targetRole === newRole) return { ok: true };
  if (targetRole === "admin" && newRole !== "admin" && adminCount <= 1) {
    return { ok: false, reason: "This is the last owner account. Promote someone else to owner first." };
  }
  return { ok: true };
}

export interface DeleteUserInput {
  actor: Actor;
  targetId: string;
  targetRole: Role;
  adminCount: number;
}

/** Admins and assistants may remove learners; only the owner may remove team members; nobody removes themselves here or the last owner. */
export function canDeleteUser({ actor, targetId, targetRole, adminCount }: DeleteUserInput): GuardResult {
  if (actor.role !== "admin" && actor.role !== "assistant") return { ok: false, reason: "Only team members can remove accounts." };
  if (actor.user_id === targetId) return { ok: false, reason: "You can't delete your own account from here. Use Account → Privacy instead." };
  if (targetRole !== "learner" && actor.role !== "admin") return { ok: false, reason: "Only the owner can remove team members." };
  if (targetRole === "admin" && adminCount <= 1) return { ok: false, reason: "This is the last owner account. Promote someone else to owner first." };
  return { ok: true };
}

/** Removing someone from the team = demoting them to learner, with the same rules as a role change. */
export function canRemoveTeamMember(input: Omit<RoleChangeInput, "newRole">): GuardResult {
  if (input.targetRole === "learner") return { ok: false, reason: "That account is not on the team." };
  return canChangeRole({ ...input, newRole: "learner" });
}

export type BroadcastAudience = Broadcast["audience"];

export interface RecipientSelectionInput {
  profiles: ReadonlyArray<Pick<Profile, "id" | "email" | "name" | "deleted_at" | "email_preferences">>;
  enrollments: ReadonlyArray<Pick<Enrollment, "user_id" | "course_id" | "status">>;
  certificates: ReadonlyArray<Pick<Certificate, "user_id" | "course_id" | "revoked_at">>;
  audience: BroadcastAudience;
  courseId: string | null;
}

/**
 * Who receives a marketing broadcast. Honours `email_preferences.newsletter`,
 * skips deleted profiles and bad addresses, and de-duplicates by email.
 *  - all:        every opted-in account
 *  - course:     opted-in accounts with an active enrollment in the course
 *  - incomplete: course recipients who do not hold a (live) certificate yet
 */
export function selectBroadcastRecipients({ profiles, enrollments, certificates, audience, courseId }: RecipientSelectionInput) {
  const optedIn = profiles.filter((p) => !p.deleted_at && p.email_preferences?.newsletter === true && isValidEmail(p.email));
  let picked = optedIn;
  if (audience === "course" || audience === "incomplete") {
    if (!courseId) return [];
    const enrolled = new Set(enrollments.filter((e) => e.course_id === courseId && e.status === "active").map((e) => e.user_id));
    picked = picked.filter((p) => enrolled.has(p.id));
    if (audience === "incomplete") {
      const certified = new Set(certificates.filter((c) => c.course_id === courseId && !c.revoked_at).map((c) => c.user_id));
      picked = picked.filter((p) => !certified.has(p.id));
    }
  }
  const seen = new Set<string>();
  const out: typeof optedIn = [];
  for (const p of picked) {
    const key = normalizeEmail(p.email);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

export type ModerationStatus = ForumPost["status"];
export type ReportAction = "hide" | "remove" | "dismiss";

/** What resolving a report does to the content and to the report row. */
export function reportResolution(action: ReportAction): { contentStatus: ModerationStatus | null; reportStatus: ForumReport["status"] } {
  switch (action) {
    case "hide":
      return { contentStatus: "hidden", reportStatus: "resolved" };
    case "remove":
      return { contentStatus: "removed", reportStatus: "resolved" };
    default:
      return { contentStatus: null, reportStatus: "dismissed" };
  }
}

/** Coupon codes are stored uppercase with only letters, digits, dashes and underscores. */
export function normalizeCouponCode(code: string): string {
  return code
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 40);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export type ActionResult<T = object> = ({ ok: true } & T) | { ok: false; error: string };

async function liveAdminCount(): Promise<number> {
  const { db } = await getServices();
  const admins = await db.from("profiles").list({ where: { role: "admin" } });
  return admins.filter((a) => !a.deleted_at).length;
}

async function liveProfile(userId: string): Promise<Profile | null> {
  const { db } = await getServices();
  const profile = await db.from("profiles").get(userId);
  return profile && !profile.deleted_at ? profile : null;
}

// ---------------------------------------------------------------------------
// Roles, accounts
// ---------------------------------------------------------------------------

export async function changeUserRole(actor: Actor, targetId: string, newRole: Role): Promise<ActionResult<{ profile: Profile }>> {
  const target = await liveProfile(targetId);
  if (!target) return { ok: false, error: "That account no longer exists." };
  const guard = canChangeRole({ actor, targetId, targetRole: target.role, newRole, adminCount: await liveAdminCount() });
  if (!guard.ok) return { ok: false, error: guard.reason };
  if (target.role === newRole) return { ok: true, profile: target };
  const { db } = await getServices();
  const profile = await db.from("profiles").update(targetId, { role: newRole, updated_at: nowIso() });
  await logAudit(actor.user_id, "user.role_changed", "profile", targetId, { from: target.role, to: newRole });
  return { ok: true, profile };
}

/** Admin "remove any user": the self-service deletion path with admin guards on top. */
export async function adminDeleteUser(actor: Actor, targetId: string): Promise<ActionResult> {
  const target = await liveProfile(targetId);
  if (!target) return { ok: false, error: "That account no longer exists." };
  const guard = canDeleteUser({ actor, targetId, targetRole: target.role, adminCount: await liveAdminCount() });
  if (!guard.ok) return { ok: false, error: guard.reason };
  const result = await deleteUserAccount(targetId, actor.user_id);
  if (!result.ok) return { ok: false, error: result.error ?? "We couldn't delete that account." };
  return { ok: true };
}

export async function sendPasswordResetFor(actor: Actor, userId: string): Promise<ActionResult<{ email: string }>> {
  const target = await liveProfile(userId);
  if (!target) return { ok: false, error: "That account no longer exists." };
  const { auth } = await getServices();
  await auth.requestPasswordReset({ email: target.email });
  await logAudit(actor.user_id, "user.password_reset_sent", "profile", userId, {});
  return { ok: true, email: target.email };
}

// ---------------------------------------------------------------------------
// Enrollments, certificates
// ---------------------------------------------------------------------------

/** Complimentary access, through the same grantEnrollment path the webhook uses. */
export async function compEnroll(actor: Actor, userId: string, courseId: string): Promise<ActionResult<{ enrollment: Enrollment }>> {
  const target = await liveProfile(userId);
  if (!target) return { ok: false, error: "That account no longer exists." };
  const { db } = await getServices();
  const course = await db.from("courses").get(courseId);
  if (!course) return { ok: false, error: "That course no longer exists." };
  const enrollment = await db.transaction((tx) => grantEnrollment(tx, { userId, courseId, source: "comp", orderId: null, subscriptionId: null }));
  await logAudit(actor.user_id, "enrollment.comp", "enrollment", enrollment.id, { user_id: userId, course_id: courseId });
  return { ok: true, enrollment };
}

export async function revokeUserEnrollment(actor: Actor, enrollmentId: string, reason = "admin"): Promise<ActionResult> {
  const { db } = await getServices();
  const enrollment = await db.from("enrollments").get(enrollmentId);
  if (!enrollment) return { ok: false, error: "That enrollment no longer exists." };
  if (enrollment.status === "revoked") return { ok: true };
  await db.transaction((tx) => revokeEnrollment(tx, enrollmentId, reason));
  await logAudit(actor.user_id, "enrollment.revoked_by_admin", "enrollment", enrollmentId, { user_id: enrollment.user_id, course_id: enrollment.course_id, reason });
  return { ok: true };
}

export async function reactivateEnrollment(actor: Actor, enrollmentId: string): Promise<ActionResult> {
  const { db } = await getServices();
  const enrollment = await db.from("enrollments").get(enrollmentId);
  if (!enrollment) return { ok: false, error: "That enrollment no longer exists." };
  if (enrollment.status === "active") return { ok: true };
  const now = nowIso();
  const expires_at = enrollment.expires_at && new Date(enrollment.expires_at) <= new Date() ? null : enrollment.expires_at;
  await db.from("enrollments").update(enrollmentId, { status: "active", expires_at, updated_at: now });
  await logAudit(actor.user_id, "enrollment.reactivated", "enrollment", enrollmentId, { user_id: enrollment.user_id, course_id: enrollment.course_id, previous: enrollment.status });
  return { ok: true };
}

export async function setEnrollmentUnlockAll(actor: Actor, enrollmentId: string, unlockAll: boolean): Promise<ActionResult> {
  const { db } = await getServices();
  const enrollment = await db.from("enrollments").get(enrollmentId);
  if (!enrollment) return { ok: false, error: "That enrollment no longer exists." };
  if (enrollment.unlock_all === unlockAll) return { ok: true };
  await db.from("enrollments").update(enrollmentId, { unlock_all: unlockAll, updated_at: nowIso() });
  await logAudit(actor.user_id, unlockAll ? "enrollment.unlock_all" : "enrollment.drip_restored", "enrollment", enrollmentId, { user_id: enrollment.user_id, course_id: enrollment.course_id });
  return { ok: true };
}

export async function setCertificateRevoked(actor: Actor, certificateId: string, revoked: boolean): Promise<ActionResult> {
  const { db } = await getServices();
  const cert = await db.from("certificates").get(certificateId);
  if (!cert) return { ok: false, error: "That certificate no longer exists." };
  if (!!cert.revoked_at === revoked) return { ok: true };
  await db.from("certificates").update(certificateId, { revoked_at: revoked ? nowIso() : null });
  await logAudit(actor.user_id, revoked ? "certificate.revoked" : "certificate.restored", "certificate", certificateId, { user_id: cert.user_id, course_id: cert.course_id });
  return { ok: true };
}

/** Re-sends the purchase receipt for a paid order to the order's email. */
export async function resendOrderReceipt(actor: Actor, orderId: string): Promise<ActionResult<{ email: string }>> {
  const { db } = await getServices();
  const order = await db.from("orders").get(orderId);
  if (!order) return { ok: false, error: "That order no longer exists." };
  if (!["paid", "partially_refunded", "refunded"].includes(order.status)) return { ok: false, error: "Receipts are available once a payment has gone through." };
  const profile = order.user_id ? await db.from("profiles").get(order.user_id) : null;
  const to = profile && !profile.deleted_at ? profile.email : order.email;
  if (!isValidEmail(to)) return { ok: false, error: "This order has no usable email address." };
  const { sendTemplate } = await import("@/lib/email/send");
  const result = await sendTemplate("purchase-receipt", to, {
    name: profile?.name ?? null,
    orderId: order.id,
    items: order.items,
    totalCents: order.total_cents,
    discountCents: order.discount_cents,
    taxCents: order.tax_cents,
    currency: order.currency,
    learnUrl: `${site.url}/learn`,
  });
  if (!result.ok) return { ok: false, error: result.error ?? "We couldn't send the receipt just now." };
  await logAudit(actor.user_id, "order.receipt_resent", "order", order.id, { to });
  return { ok: true, email: to };
}

// ---------------------------------------------------------------------------
// Community moderation
// ---------------------------------------------------------------------------

export async function setPostStatus(actor: Actor, postId: string, status: ModerationStatus): Promise<ActionResult> {
  const { db } = await getServices();
  const post = await db.from("forum_posts").get(postId);
  if (!post) return { ok: false, error: "That post no longer exists." };
  if (post.status !== status) await db.from("forum_posts").update(postId, { status, updated_at: nowIso() });
  await logAudit(actor.user_id, `post.${status}`, "forum_post", postId, { from: post.status, course_id: post.course_id });
  return { ok: true };
}

export async function setPostFlags(actor: Actor, postId: string, flags: { pinned?: boolean; locked?: boolean }): Promise<ActionResult> {
  const { db } = await getServices();
  const post = await db.from("forum_posts").get(postId);
  if (!post) return { ok: false, error: "That post no longer exists." };
  const patch: Partial<ForumPost> = { updated_at: nowIso() };
  if (typeof flags.pinned === "boolean") patch.pinned = flags.pinned;
  if (typeof flags.locked === "boolean") patch.locked = flags.locked;
  await db.from("forum_posts").update(postId, patch);
  const action = typeof flags.pinned === "boolean" ? (flags.pinned ? "post.pinned" : "post.unpinned") : flags.locked ? "post.locked" : "post.unlocked";
  await logAudit(actor.user_id, action, "forum_post", postId, { course_id: post.course_id });
  return { ok: true };
}

export async function setReplyStatus(actor: Actor, replyId: string, status: ModerationStatus): Promise<ActionResult> {
  const { db } = await getServices();
  const reply = await db.from("forum_replies").get(replyId);
  if (!reply) return { ok: false, error: "That reply no longer exists." };
  if (reply.status !== status) {
    await db.from("forum_replies").update(replyId, { status });
    // Keep the parent's visible reply count honest.
    const post = await db.from("forum_posts").get(reply.post_id);
    if (post) {
      const visible = await db.from("forum_replies").count({ post_id: post.id, status: "visible" });
      await db.from("forum_posts").update(post.id, { reply_count: visible, updated_at: nowIso() });
    }
  }
  await logAudit(actor.user_id, `reply.${status}`, "forum_reply", replyId, { from: reply.status, post_id: reply.post_id });
  return { ok: true };
}

export async function resolveReport(actor: Actor, reportId: string, action: ReportAction): Promise<ActionResult> {
  const { db } = await getServices();
  const report = await db.from("forum_reports").get(reportId);
  if (!report) return { ok: false, error: "That report no longer exists." };
  const { contentStatus, reportStatus } = reportResolution(action);
  if (contentStatus) {
    if (report.post_id) {
      const res = await setPostStatus(actor, report.post_id, contentStatus);
      if (!res.ok) return res;
    } else if (report.reply_id) {
      const res = await setReplyStatus(actor, report.reply_id, contentStatus);
      if (!res.ok) return res;
    }
  }
  await db.from("forum_reports").update(reportId, { status: reportStatus, resolved_at: nowIso() });
  await logAudit(actor.user_id, `report.${reportStatus}`, "forum_report", reportId, { action, post_id: report.post_id, reply_id: report.reply_id });
  return { ok: true };
}

/**
 * The closest thing to a ban without a schema change: every post and reply by
 * the member is marked removed and their open reports are left for review.
 * (A real "banned_at" flag on profiles would need a migration — see report.)
 */
export async function removeAllPostsByUser(actor: Actor, userId: string): Promise<ActionResult<{ posts: number; replies: number }>> {
  const target = await liveProfile(userId);
  if (!target) return { ok: false, error: "That account no longer exists." };
  const { db } = await getServices();
  const now = nowIso();
  const { posts, replies } = await db.transaction(async (tx) => {
    const posts = await tx.from("forum_posts").updateWhere({ user_id: userId, status: ["visible", "hidden"] }, { status: "removed", updated_at: now });
    const replies = await tx.from("forum_replies").updateWhere({ user_id: userId, status: ["visible", "hidden"] }, { status: "removed" });
    return { posts, replies };
  });
  await logAudit(actor.user_id, "community.user_content_removed", "profile", userId, { posts, replies });
  return { ok: true, posts, replies };
}


// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export async function moderateTestimonial(actor: Actor, id: string, status: Testimonial["status"]): Promise<ActionResult> {
  const { db } = await getServices();
  const row = await db.from("testimonials").get(id);
  if (!row) return { ok: false, error: "That testimonial no longer exists." };
  await db.from("testimonials").update(id, { status, reviewed_at: nowIso(), featured: status === "approved" ? row.featured : false });
  await logAudit(actor.user_id, `testimonial.${status}`, "testimonial", id, { from: row.status });
  return { ok: true };
}

export async function setTestimonialFeatured(actor: Actor, id: string, featured: boolean): Promise<ActionResult> {
  const { db } = await getServices();
  const row = await db.from("testimonials").get(id);
  if (!row) return { ok: false, error: "That testimonial no longer exists." };
  if (featured && row.status !== "approved") return { ok: false, error: "Approve the testimonial before featuring it." };
  await db.from("testimonials").update(id, { featured });
  await logAudit(actor.user_id, featured ? "testimonial.featured" : "testimonial.unfeatured", "testimonial", id, {});
  return { ok: true };
}

export interface TestimonialInput {
  author_name: string;
  author_role: string | null;
  body: string;
  rating: number | null;
  course_id: string | null;
}

export async function updateTestimonial(actor: Actor, id: string, patch: TestimonialInput): Promise<ActionResult> {
  const { db } = await getServices();
  const row = await db.from("testimonials").get(id);
  if (!row) return { ok: false, error: "That testimonial no longer exists." };
  await db.from("testimonials").update(id, { ...patch });
  await logAudit(actor.user_id, "testimonial.edited", "testimonial", id, {});
  return { ok: true };
}

export async function deleteTestimonial(actor: Actor, id: string): Promise<ActionResult> {
  const { db } = await getServices();
  const row = await db.from("testimonials").get(id);
  if (!row) return { ok: true };
  await db.from("testimonials").delete(id);
  await logAudit(actor.user_id, "testimonial.deleted", "testimonial", id, { author_name: row.author_name });
  return { ok: true };
}

/** Manually added testimonial (with the author's permission); published straight away. */
export async function createTestimonial(actor: Actor, input: TestimonialInput): Promise<ActionResult<{ testimonial: Testimonial }>> {
  const { db } = await getServices();
  const now = nowIso();
  const testimonial = await db.from("testimonials").insert({
    id: newId(),
    user_id: null,
    course_id: input.course_id,
    author_name: input.author_name,
    author_role: input.author_role,
    body: input.body,
    rating: input.rating,
    status: "approved",
    featured: false,
    created_at: now,
    reviewed_at: now,
  });
  await logAudit(actor.user_id, "testimonial.created", "testimonial", testimonial.id, { manual: true });
  return { ok: true, testimonial };
}

// ---------------------------------------------------------------------------
// Broadcasts
// ---------------------------------------------------------------------------

async function loadRecipients(audience: BroadcastAudience, courseId: string | null) {
  const { db } = await getServices();
  const [profiles, enrollments, certificates] = await Promise.all([
    db.from("profiles").list(),
    audience === "all" ? Promise.resolve([]) : db.from("enrollments").list({ where: { status: "active" } }),
    audience === "incomplete" ? db.from("certificates").list() : Promise.resolve([]),
  ]);
  return selectBroadcastRecipients({ profiles, enrollments, certificates, audience, courseId });
}

export async function countBroadcastAudience(audience: BroadcastAudience, courseId: string | null): Promise<number> {
  return (await loadRecipients(audience, courseId)).length;
}

export interface BroadcastInput {
  subject: string;
  body: string;
  audience: BroadcastAudience;
  courseId: string | null;
}

/** Sends the broadcast to every recipient, one at a time, never letting one failure stop the rest. */
export async function sendBroadcast(actor: Actor, input: BroadcastInput): Promise<ActionResult<{ broadcastId: string; sent: number; failed: number; total: number }>> {
  const subject = input.subject.trim().slice(0, 160);
  const body = input.body.trim().slice(0, 20_000);
  if (!subject) return { ok: false, error: "Please add a subject." };
  if (!body) return { ok: false, error: "Please write the message." };
  if ((input.audience === "course" || input.audience === "incomplete") && !input.courseId) return { ok: false, error: "Please choose a course for this audience." };
  const recipients = await loadRecipients(input.audience, input.courseId);
  if (recipients.length === 0) return { ok: false, error: "Nobody matches that audience right now, so nothing was sent." };

  const { db } = await getServices();
  const now = nowIso();
  const row = await db.from("broadcasts").insert({
    id: newId(),
    subject,
    body,
    audience: input.audience,
    course_id: input.courseId,
    sent_count: 0,
    status: "draft",
    created_by: actor.user_id,
    created_at: now,
    sent_at: null,
  });

  const { sendTemplate } = await import("@/lib/email/send");
  const preferencesUrl = `${site.url}/account/emails`;
  let sent = 0;
  let failed = 0;
  for (const r of recipients) {
    try {
      const res = await sendTemplate("broadcast", r.email, { name: r.name, subject, body, preferencesUrl, job_key: `broadcast:${row.id}:${r.id}` });
      if (res.ok) sent += 1;
      else failed += 1;
    } catch (err) {
      failed += 1;
      console.warn("[broadcast] send failed", r.email, err);
    }
  }
  await db.from("broadcasts").update(row.id, { sent_count: sent, status: "sent", sent_at: nowIso() });
  await logAudit(actor.user_id, "broadcast.sent", "broadcast", row.id, { audience: input.audience, course_id: input.courseId, sent, failed });
  return { ok: true, broadcastId: row.id, sent, failed, total: recipients.length };
}

/** "Send test to me": the same template, to the signed-in admin only, not recorded as a broadcast. */
export async function sendBroadcastTest(actor: Actor & { email: string }, input: Pick<BroadcastInput, "subject" | "body">): Promise<ActionResult<{ email: string }>> {
  const subject = input.subject.trim().slice(0, 160) || "(no subject)";
  const body = input.body.trim().slice(0, 20_000) || "(empty message)";
  const profile = await liveProfile(actor.user_id);
  const to = profile?.email ?? actor.email;
  const { sendTemplate } = await import("@/lib/email/send");
  const res = await sendTemplate("broadcast", to, { name: profile?.name ?? null, subject: `[Test] ${subject}`, body, preferencesUrl: `${site.url}/account/emails` });
  if (!res.ok) return { ok: false, error: res.error ?? "We couldn't send the test just now." };
  return { ok: true, email: to };
}

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

export interface AddTeamMemberInput {
  name: string;
  email: string;
  role: Extract<Role, "admin" | "assistant">;
  /** Temporary password, or null to email a set-password link instead. */
  password: string | null;
}

/**
 * "Admin can create accounts": ensures the account exists (verified, no
 * password), sets the role, then either sets a temporary password or lets the
 * set-password email from ensureAccount do its job, and sends the welcome.
 */
export async function addTeamMember(actor: Actor, input: AddTeamMemberInput): Promise<ActionResult<{ profile: Profile; created: boolean }>> {
  if (actor.role !== "admin") return { ok: false, error: "Only the owner can add team members." };
  if (input.role !== "admin" && input.role !== "assistant") return { ok: false, error: "Team roles are owner or assistant." };
  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) return { ok: false, error: "Please enter a valid email address." };
  const { auth, db } = await getServices();
  const existing = await db.from("profiles").findOne({ email });
  if (existing?.deleted_at) return { ok: false, error: "That email belongs to a deleted account. Please use a different address." };
  if (existing && existing.id === actor.user_id) return { ok: false, error: "That's you. You can't change your own role." };

  const { profile, created } = await auth.ensureAccount({ email, name: input.name.trim(), sendSetPassword: !input.password });

  if (!created) {
    // Existing account: only the role changes (guarded), never their password or name.
    const res = await changeUserRole(actor, profile.id, input.role);
    if (!res.ok) return res;
    await logAudit(actor.user_id, "team.member_added", "profile", profile.id, { role: input.role, previous_role: profile.role, via: "existing_account" });
    return { ok: true, profile: res.profile, created: false };
  }

  if (input.password) await auth.adminSetPassword({ userId: profile.id, password: input.password });
  const patch: Partial<Profile> = { role: input.role, updated_at: nowIso() };
  if (input.name.trim() && profile.name !== input.name.trim()) patch.name = input.name.trim();
  const updated = await db.from("profiles").update(profile.id, patch);
  const { sendTemplate } = await import("@/lib/email/send");
  await sendTemplate("welcome", email, { name: updated.name, learnUrl: `${site.url}/admin` });
  await logAudit(actor.user_id, "team.member_created", "profile", profile.id, { role: input.role, via: input.password ? "temporary_password" : "set_password_email" });
  return { ok: true, profile: updated, created: true };
}

export async function removeTeamMember(actor: Actor, targetId: string, mode: "demote" | "delete"): Promise<ActionResult> {
  const target = await liveProfile(targetId);
  if (!target) return { ok: false, error: "That account no longer exists." };
  const adminCount = await liveAdminCount();
  const guard = canRemoveTeamMember({ actor, targetId, targetRole: target.role, adminCount });
  if (!guard.ok) return { ok: false, error: guard.reason };
  if (mode === "delete") return adminDeleteUser(actor, targetId);
  const res = await changeUserRole(actor, targetId, "learner");
  return res.ok ? { ok: true } : res;
}
