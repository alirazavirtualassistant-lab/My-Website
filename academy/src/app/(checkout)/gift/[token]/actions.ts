"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { getCourseById } from "@/lib/usecases/catalog";
import { redeemGift } from "@/lib/usecases/partner-gifts";
import type { SimpleActionState } from "@/components/checkout/types";

const schema = z.object({ token: z.string().trim().min(16).max(200) });

/** "Open my gift": enrols the signed-in user through the use case and sends them to the course. */
export async function redeemGiftAction(_prev: SimpleActionState, formData: FormData): Promise<SimpleActionState> {
  const parsed = schema.safeParse({ token: formData.get("token") });
  if (!parsed.success) return { status: "error", message: "This gift link looks incomplete. Please open it from your email again.", stamp: Date.now() };
  const session = await requireUser(`/gift/${parsed.data.token}`);
  const result = await redeemGift(parsed.data.token, session.user_id);
  if (!result.ok) return { status: "error", message: result.error ?? "We couldn't open this gift just now.", stamp: Date.now() };
  revalidatePath("/learn", "layout");
  const first = result.courseIds?.[0] ? await getCourseById(result.courseIds[0]) : null;
  redirect(first ? `/learn/${first.slug}` : "/learn");
}
