import "server-only";
import { getServices } from "@/services";
import type { PartnerLink, Gift, Product } from "@/lib/types";
import { newId, nowIso, randomToken, sha256Hex, normalizeEmail, isValidEmail } from "@/lib/utils";
import { grantEnrollment } from "./fulfilment";
import { site } from "@/lib/config/site";

// ---------------------------------------------------------------------------
// Partner seat
// ---------------------------------------------------------------------------

export async function invitePartner(ownerUserId: string, courseId: string, partnerEmail: string): Promise<{ ok: boolean; error?: string; link?: PartnerLink }> {
  const { db } = await getServices();
  const email = normalizeEmail(partnerEmail);
  if (!isValidEmail(email)) return { ok: false, error: "Please enter a valid email address" };
  const owner = await db.from("profiles").get(ownerUserId);
  if (!owner) return { ok: false, error: "Account not found" };
  if (owner.email === email) return { ok: false, error: "You cannot invite yourself" };
  const course = await db.from("courses").get(courseId);
  if (!course?.partner_seat_enabled) return { ok: false, error: "Partner seats are not available for this course" };
  const enrollment = (await db.from("enrollments").list({ where: { user_id: ownerUserId, course_id: courseId } })).find((e) => e.status === "active" && e.source !== "partner");
  if (!enrollment) return { ok: false, error: "You need an active enrollment to invite a partner" };
  const existing = await db.from("partner_links").list({ where: { owner_user_id: ownerUserId, course_id: courseId } });
  const pending = existing.find((l) => l.status === "pending");
  const accepted = existing.find((l) => l.status === "accepted");
  if (accepted) return { ok: false, error: "Your partner seat has already been used" };
  if (!pending && enrollment.partner_invites_remaining <= 0) return { ok: false, error: "No partner invites remaining" };
  const token = randomToken(24);
  const now = nowIso();
  const link: PartnerLink = pending
    ? await db.from("partner_links").update(pending.id, { invite_email: email, token_hash: await sha256Hex(token), created_at: now })
    : await db.from("partner_links").insert({ id: newId(), owner_user_id: ownerUserId, partner_user_id: null, course_id: courseId, invite_email: email, token_hash: await sha256Hex(token), status: "pending", created_at: now, accepted_at: null });
  if (!pending) await db.from("enrollments").update(enrollment.id, { partner_invites_remaining: enrollment.partner_invites_remaining - 1, updated_at: now });
  try {
    const { sendTemplate } = await import("@/lib/email/send");
    await sendTemplate("partner-invite", email, { inviterName: owner.name, courseTitle: course.title, acceptUrl: `${site.url}/partner/${token}` });
  } catch (err) {
    console.warn("[partner] invite email failed", err);
  }
  return { ok: true, link };
}

export async function getPartnerInviteByToken(token: string): Promise<(PartnerLink & { course_title: string; inviter_name: string }) | null> {
  const { db } = await getServices();
  const hash = await sha256Hex(token);
  const link = await db.from("partner_links").findOne({ token_hash: hash });
  if (!link || link.status !== "pending") return null;
  const [course, owner] = await Promise.all([db.from("courses").get(link.course_id), db.from("profiles").get(link.owner_user_id)]);
  return { ...link, course_title: course?.title ?? "", inviter_name: owner?.name ?? "" };
}

/** Accepts a partner invite for the signed-in user; grants a partner enrollment with the owner's drip clock. */
export async function acceptPartnerInvite(token: string, userId: string): Promise<{ ok: boolean; error?: string; courseId?: string }> {
  const { db } = await getServices();
  const hash = await sha256Hex(token);
  return db.transaction(async (tx) => {
    const link = await tx.from("partner_links").findOne({ token_hash: hash });
    if (!link || link.status !== "pending") return { ok: false, error: "This invitation is no longer valid" };
    if (link.owner_user_id === userId) return { ok: false, error: "You cannot accept your own invitation" };
    const ownerEnrollment = (await tx.from("enrollments").list({ where: { user_id: link.owner_user_id, course_id: link.course_id } })).find((e) => e.status === "active");
    if (!ownerEnrollment) return { ok: false, error: "The inviting account no longer has access to this course" };
    await grantEnrollment(tx, { userId, courseId: link.course_id, source: "partner", orderId: ownerEnrollment.order_id, subscriptionId: null, startedAt: ownerEnrollment.started_at });
    await tx.from("partner_links").update(link.id, { partner_user_id: userId, status: "accepted", accepted_at: nowIso() });
    return { ok: true, courseId: link.course_id };
  });
}

export async function revokePartnerInvite(ownerUserId: string, linkId: string) {
  const { db } = await getServices();
  const link = await db.from("partner_links").get(linkId);
  if (!link || link.owner_user_id !== ownerUserId) return;
  await db.from("partner_links").update(link.id, { status: "revoked" });
  if (link.partner_user_id) {
    for (const e of await db.from("enrollments").list({ where: { user_id: link.partner_user_id, course_id: link.course_id, source: "partner" } })) {
      if (e.status === "active") await db.from("enrollments").update(e.id, { status: "revoked", updated_at: nowIso() });
    }
  }
}

/** The couple: owner + partner for a course, from either side. */
export async function getCoupleForCourse(userId: string, courseId: string) {
  const { db } = await getServices();
  const asOwner = (await db.from("partner_links").list({ where: { owner_user_id: userId, course_id: courseId } })).find((l) => l.status !== "revoked") ?? null;
  const asPartner = (await db.from("partner_links").list({ where: { partner_user_id: userId, course_id: courseId } })).find((l) => l.status === "accepted") ?? null;
  const link = asOwner ?? asPartner;
  if (!link) return { link: null, owner: null, partner: null, role: "owner" as const };
  const [owner, partner] = await Promise.all([
    db.from("profiles").get(link.owner_user_id),
    link.partner_user_id ? db.from("profiles").get(link.partner_user_id) : Promise.resolve(null),
  ]);
  return { link, owner, partner, role: asOwner ? ("owner" as const) : ("partner" as const) };
}

// ---------------------------------------------------------------------------
// Gifts
// ---------------------------------------------------------------------------

export async function getGiftByToken(token: string): Promise<(Gift & { product: Product | null }) | null> {
  const { db } = await getServices();
  const gift = await db.from("gifts").findOne({ token_hash: await sha256Hex(token) });
  if (!gift) return null;
  const product = await db.from("products").get(gift.product_id);
  return { ...gift, product };
}

export async function redeemGift(token: string, userId: string): Promise<{ ok: boolean; error?: string; courseIds?: string[] }> {
  const { db } = await getServices();
  const hash = await sha256Hex(token);
  return db.transaction(async (tx) => {
    const gift = await tx.from("gifts").findOne({ token_hash: hash });
    if (!gift) return { ok: false, error: "This gift link is not valid" };
    if (gift.status === "redeemed") return { ok: false, error: "This gift has already been redeemed" };
    if (gift.status === "canceled") return { ok: false, error: "This gift was cancelled" };
    const product = await tx.from("products").get(gift.product_id);
    if (!product) return { ok: false, error: "The gifted course is no longer available" };
    const courseIds = product.grants_all_courses ? (await tx.from("courses").list({ where: { status: "published" } })).map((c) => c.id) : product.course_ids;
    for (const courseId of courseIds) await grantEnrollment(tx, { userId, courseId, source: "gift", orderId: gift.order_id, subscriptionId: null });
    await tx.from("gifts").update(gift.id, { status: "redeemed", redeemed_by_user_id: userId, redeemed_at: nowIso() });
    return { ok: true, courseIds };
  });
}
