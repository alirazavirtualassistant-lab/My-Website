"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { getServices } from "@/services";
import { sendBroadcast, sendBroadcastTest } from "@/lib/usecases/admin-people";
import { failed, invalid, sent, type AdminFormState } from "@/components/admin/students/form-state";

export interface EmailHtmlResult {
  ok: boolean;
  subject?: string;
  to?: string;
  html?: string | null;
  text?: string | null;
  error?: string;
}

/** Loads one logged email's HTML for the preview dialog (admin + assistant). */
export async function loadEmailHtmlAction(id: string): Promise<EmailHtmlResult> {
  await requireAdmin();
  const parsed = z.string().trim().min(1).max(120).safeParse(id);
  if (!parsed.success) return { ok: false, error: "That email could not be found." };
  const { db } = await getServices();
  const event = await db.from("email_events").get(parsed.data);
  if (!event) return { ok: false, error: "That email could not be found." };
  const text = typeof event.payload?.text === "string" ? (event.payload.text as string) : null;
  return { ok: true, subject: event.subject, to: event.to, html: event.html, text };
}

const broadcastSchema = z.object({
  subject: z.string().trim().min(3, "Please add a subject (at least 3 characters).").max(160, "Please keep the subject under 160 characters."),
  body: z.string().trim().min(10, "Please write the message (at least 10 characters).").max(20_000, "Please keep the message under 20,000 characters."),
  audience: z.enum(["all", "course", "incomplete"], { message: "Please choose who should receive this." }),
  course_id: z
    .string()
    .trim()
    .max(120)
    .transform((v) => (v === "" || v === "__none__" ? null : v)),
});

function parse(formData: FormData) {
  return broadcastSchema.safeParse({
    subject: formData.get("subject") ?? "",
    body: formData.get("body") ?? "",
    audience: formData.get("audience") ?? "",
    course_id: formData.get("course_id") ?? "",
  });
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in errors)) errors[key] = issue.message;
  }
  return errors;
}

export async function sendBroadcastTestAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) {
    const errors = fieldErrors(parsed.error);
    // A test only needs words; audience errors can wait until the real send.
    delete errors.audience;
    delete errors.course_id;
    if (Object.keys(errors).length) return invalid(errors);
  }
  const res = await sendBroadcastTest(actor, { subject: String(formData.get("subject") ?? ""), body: String(formData.get("body") ?? "") });
  if (!res.ok) return failed(res.error);
  return sent(`Test sent to ${res.email}. Check the demo mailbox or your inbox.`, res.email);
}

export async function sendBroadcastAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return invalid(fieldErrors(parsed.error));
  const { audience, course_id } = parsed.data;
  if ((audience === "course" || audience === "incomplete") && !course_id) return invalid({ course_id: "Please choose a course for this audience." });
  if (formData.get("confirm") !== "on") return invalid({ confirm: "Please tick the box to confirm you’ve reviewed the message." });
  const res = await sendBroadcast(actor, { subject: parsed.data.subject, body: parsed.data.body, audience, courseId: audience === "all" ? null : course_id });
  if (!res.ok) return failed(res.error);
  revalidatePath("/admin/emails");
  revalidatePath("/admin/emails/broadcasts");
  redirect(`/admin/emails/broadcasts?sent=${res.sent}&failed=${res.failed}`);
}
