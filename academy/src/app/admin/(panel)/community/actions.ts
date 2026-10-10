"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { resolveReport, setPostFlags, setPostStatus, setReplyStatus } from "@/lib/usecases/admin-people";
import { done, failed, type AdminFormState } from "@/components/admin/students/form-state";

const id = z.string().trim().min(1).max(120);
const status = z.enum(["visible", "hidden", "removed"]);
const STATUS_WORD = { visible: "restored", hidden: "hidden", removed: "removed" } as const;

function refresh() {
  revalidatePath("/admin/community");
  revalidatePath("/community", "layout");
}

export async function resolveReportAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z.object({ report_id: id, action: z.enum(["hide", "remove", "dismiss"]) }).safeParse({ report_id: formData.get("report_id"), action: formData.get("action") });
  if (!parsed.success) return failed("We couldn't find that report.");
  const res = await resolveReport(actor, parsed.data.report_id, parsed.data.action);
  if (!res.ok) return failed(res.error);
  refresh();
  return done(parsed.data.action === "dismiss" ? "Report dismissed." : parsed.data.action === "hide" ? "Hidden and report resolved." : "Removed and report resolved.");
}

export async function setPostStatusAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z.object({ post_id: id, status }).safeParse({ post_id: formData.get("post_id"), status: formData.get("status") });
  if (!parsed.success) return failed("We couldn't find that post.");
  const res = await setPostStatus(actor, parsed.data.post_id, parsed.data.status);
  if (!res.ok) return failed(res.error);
  refresh();
  return done(`Post ${STATUS_WORD[parsed.data.status]}.`);
}

export async function setPostFlagAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z.object({ post_id: id, flag: z.enum(["pinned", "locked"]), value: z.string() }).safeParse({ post_id: formData.get("post_id"), flag: formData.get("flag"), value: formData.get("value") ?? "" });
  if (!parsed.success) return failed("We couldn't find that post.");
  const value = parsed.data.value === "1";
  const res = await setPostFlags(actor, parsed.data.post_id, { [parsed.data.flag]: value });
  if (!res.ok) return failed(res.error);
  refresh();
  return done(parsed.data.flag === "pinned" ? (value ? "Post pinned to the top." : "Post unpinned.") : value ? "Thread locked. No new replies." : "Thread unlocked.");
}

export async function setReplyStatusAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z.object({ reply_id: id, status }).safeParse({ reply_id: formData.get("reply_id"), status: formData.get("status") });
  if (!parsed.success) return failed("We couldn't find that reply.");
  const res = await setReplyStatus(actor, parsed.data.reply_id, parsed.data.status);
  if (!res.ok) return failed(res.error);
  refresh();
  return done(`Reply ${STATUS_WORD[parsed.data.status]}.`);
}
