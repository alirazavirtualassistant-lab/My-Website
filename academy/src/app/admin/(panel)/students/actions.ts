"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireRole } from "@/lib/auth/session";
import { refundOrder } from "@/lib/usecases/fulfilment";
import {
  adminDeleteUser,
  changeUserRole,
  compEnroll,
  isRole,
  reactivateEnrollment,
  removeAllPostsByUser,
  resendOrderReceipt,
  revokeUserEnrollment,
  sendPasswordResetFor,
  setCertificateRevoked,
  setEnrollmentUnlockAll,
} from "@/lib/usecases/admin-people";
import { done, failed, sent, type AdminFormState } from "@/components/admin/students/form-state";

const id = z.string().trim().min(1).max(120);
const flag = z.preprocess((v) => v === "1" || v === "true" || v === "on", z.boolean());

function refresh(userId: string) {
  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${userId}`);
  revalidatePath("/admin/orders");
}

export async function changeRoleAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireRole("admin");
  const parsed = z.object({ user_id: id, role: z.string() }).safeParse({ user_id: formData.get("user_id"), role: formData.get("role") });
  if (!parsed.success || !isRole(parsed.data.role)) return failed("Please choose a valid role.");
  const res = await changeUserRole(actor, parsed.data.user_id, parsed.data.role);
  if (!res.ok) return failed(res.error);
  refresh(parsed.data.user_id);
  revalidatePath("/admin/team");
  return done(`Role updated to ${parsed.data.role}.`);
}

export async function compEnrollAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z.object({ user_id: id, course_id: id }).safeParse({ user_id: formData.get("user_id"), course_id: formData.get("course_id") });
  if (!parsed.success) return failed("Please choose a course.", { course_id: "Please choose a course." });
  const res = await compEnroll(actor, parsed.data.user_id, parsed.data.course_id);
  if (!res.ok) return failed(res.error);
  refresh(parsed.data.user_id);
  return done("Enrolled with complimentary access.");
}

export async function revokeEnrollmentAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z.object({ enrollment_id: id, user_id: id }).safeParse({ enrollment_id: formData.get("enrollment_id"), user_id: formData.get("user_id") });
  if (!parsed.success) return failed("We couldn't find that enrollment.");
  const res = await revokeUserEnrollment(actor, parsed.data.enrollment_id, "admin");
  if (!res.ok) return failed(res.error);
  refresh(parsed.data.user_id);
  return done("Access revoked.");
}

export async function reactivateEnrollmentAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z.object({ enrollment_id: id, user_id: id }).safeParse({ enrollment_id: formData.get("enrollment_id"), user_id: formData.get("user_id") });
  if (!parsed.success) return failed("We couldn't find that enrollment.");
  const res = await reactivateEnrollment(actor, parsed.data.enrollment_id);
  if (!res.ok) return failed(res.error);
  refresh(parsed.data.user_id);
  return done("Access re-activated.");
}

export async function setUnlockAllAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z
    .object({ enrollment_id: id, user_id: id, unlock_all: flag })
    .safeParse({ enrollment_id: formData.get("enrollment_id"), user_id: formData.get("user_id"), unlock_all: formData.get("unlock_all") });
  if (!parsed.success) return failed("We couldn't find that enrollment.");
  const res = await setEnrollmentUnlockAll(actor, parsed.data.enrollment_id, parsed.data.unlock_all);
  if (!res.ok) return failed(res.error);
  refresh(parsed.data.user_id);
  revalidatePath("/learn", "layout");
  return done(parsed.data.unlock_all ? "All modules unlocked for this learner." : "Weekly drip restored.");
}

export async function setCertificateRevokedAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z
    .object({ certificate_id: id, user_id: id, revoked: flag })
    .safeParse({ certificate_id: formData.get("certificate_id"), user_id: formData.get("user_id"), revoked: formData.get("revoked") });
  if (!parsed.success) return failed("We couldn't find that certificate.");
  const res = await setCertificateRevoked(actor, parsed.data.certificate_id, parsed.data.revoked);
  if (!res.ok) return failed(res.error);
  refresh(parsed.data.user_id);
  revalidatePath("/certificates", "layout");
  return done(parsed.data.revoked ? "Certificate revoked." : "Certificate restored.");
}

export async function refundOrderAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z.object({ order_id: id, user_id: z.string().trim().max(120).optional() }).safeParse({ order_id: formData.get("order_id"), user_id: formData.get("user_id") ?? undefined });
  if (!parsed.success) return failed("We couldn't find that order.");
  const res = await refundOrder(parsed.data.order_id, actor.user_id);
  if (!res.ok) return failed(res.error ?? "That order could not be refunded.");
  if (parsed.data.user_id) refresh(parsed.data.user_id);
  else revalidatePath("/admin/orders");
  return done("Refund issued. Access tied to this order has been removed.");
}

export async function resendReceiptAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z.object({ order_id: id }).safeParse({ order_id: formData.get("order_id") });
  if (!parsed.success) return failed("We couldn't find that order.");
  const res = await resendOrderReceipt(actor, parsed.data.order_id);
  if (!res.ok) return failed(res.error);
  return sent(`Receipt sent to ${res.email}.`, res.email);
}

export async function sendPasswordResetAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z.object({ user_id: id }).safeParse({ user_id: formData.get("user_id") });
  if (!parsed.success) return failed("We couldn't find that account.");
  const res = await sendPasswordResetFor(actor, parsed.data.user_id);
  if (!res.ok) return failed(res.error);
  refresh(parsed.data.user_id);
  return sent(`Password reset link sent to ${res.email}.`, res.email);
}

export async function removeUserPostsAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z.object({ user_id: id }).safeParse({ user_id: formData.get("user_id") });
  if (!parsed.success) return failed("We couldn't find that account.");
  const res = await removeAllPostsByUser(actor, parsed.data.user_id);
  if (!res.ok) return failed(res.error);
  refresh(parsed.data.user_id);
  revalidatePath("/admin/community");
  revalidatePath("/community", "layout");
  return done(`Removed ${res.posts} post${res.posts === 1 ? "" : "s"} and ${res.replies} repl${res.replies === 1 ? "y" : "ies"}.`);
}

export async function deleteUserAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z.object({ user_id: id, confirm: z.string().trim() }).safeParse({ user_id: formData.get("user_id"), confirm: formData.get("confirm") ?? "" });
  if (!parsed.success) return failed("We couldn't find that account.");
  if (parsed.data.confirm !== "DELETE") return failed("Please type DELETE to confirm.", { confirm: "Please type DELETE exactly." });
  const res = await adminDeleteUser(actor, parsed.data.user_id);
  if (!res.ok) return failed(res.error);
  revalidatePath("/admin/students");
  revalidatePath("/admin/team");
  revalidatePath("/admin/community");
  redirect("/admin/students?deleted=1");
}
