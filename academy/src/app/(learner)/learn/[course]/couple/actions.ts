"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServices } from "@/services";
import { requireUser } from "@/lib/auth/session";
import { getCourseBySlug } from "@/lib/usecases/catalog";
import { getCoupleForCourse, invitePartner, revokePartnerInvite } from "@/lib/usecases/partner-gifts";
import { nowIso } from "@/lib/utils";
import type { CoupleFormState } from "@/components/couple/types";

const slug = z.string().min(1).max(120);
const email = z
  .string({ message: "Please enter your partner's email address." })
  .trim()
  .min(1, "Please enter your partner's email address.")
  .max(254, "That email address is a little long.")
  .toLowerCase()
  .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), "Please enter a valid email address.");

const inviteSchema = z.object({ course: slug, email });
const revokeSchema = z.object({ course: slug, link_id: z.string().min(1).max(80) });

function fail(message: string, field: "email" | "form" = "form"): CoupleFormState {
  return { status: "error", errors: { [field]: message }, stamp: Date.now() };
}

/** Sends (or re-sends with a new email) the single partner invitation for this course. */
export async function invitePartnerAction(_prev: CoupleFormState, formData: FormData): Promise<CoupleFormState> {
  const parsed = inviteSchema.safeParse({ course: formData.get("course"), email: formData.get("email") });
  if (!parsed.success) {
    const issue = parsed.error.issues.find((i) => i.path[0] === "email");
    return fail(issue?.message ?? "Please check the form.", issue ? "email" : "form");
  }
  const session = await requireUser(`/learn/${parsed.data.course}/couple`);
  const course = await getCourseBySlug(parsed.data.course);
  if (!course) return fail("We couldn't find that course.");
  const result = await invitePartner(session.user_id, course.id, parsed.data.email);
  if (!result.ok) return fail(result.error ?? "We couldn't send the invitation just now.", result.error?.toLowerCase().includes("email") ? "email" : "form");
  revalidatePath(`/learn/${course.slug}/couple`);
  return { status: "success", message: `We emailed ${parsed.data.email} a link to join you. It stays valid until you cancel it.`, stamp: Date.now() };
}

/**
 * Cancels a pending invitation or removes an accepted partner. When a *pending*
 * invite is cancelled, the seat is handed back (the use case decrements
 * `partner_invites_remaining` on send but does not restore it on revoke — see
 * the shared-change request in the report).
 */
export async function revokePartnerInviteAction(_prev: CoupleFormState, formData: FormData): Promise<CoupleFormState> {
  const parsed = revokeSchema.safeParse({ course: formData.get("course"), link_id: formData.get("link_id") });
  if (!parsed.success) return fail("Please check the form.");
  const session = await requireUser(`/learn/${parsed.data.course}/couple`);
  const course = await getCourseBySlug(parsed.data.course);
  if (!course) return fail("We couldn't find that course.");
  const couple = await getCoupleForCourse(session.user_id, course.id);
  if (!couple.link || couple.link.id !== parsed.data.link_id || couple.role !== "owner") return fail("That invitation is no longer active.");
  const wasPending = couple.link.status === "pending";
  await revokePartnerInvite(session.user_id, couple.link.id);
  if (wasPending) {
    const { db } = await getServices();
    const enrollment = (await db.from("enrollments").list({ where: { user_id: session.user_id, course_id: course.id } })).find((e) => e.status === "active" && e.source !== "partner");
    if (enrollment && enrollment.partner_invites_remaining < 1) {
      await db.from("enrollments").update(enrollment.id, { partner_invites_remaining: 1, updated_at: nowIso() });
    }
  }
  revalidatePath(`/learn/${course.slug}/couple`);
  revalidatePath("/learn", "layout");
  return { status: "success", message: wasPending ? "Invitation cancelled." : "Partner removed.", stamp: Date.now() };
}
