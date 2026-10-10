"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { getCourseById } from "@/lib/usecases/catalog";
import { acceptPartnerInvite } from "@/lib/usecases/partner-gifts";
import type { SimpleActionState } from "@/components/checkout/types";

const schema = z.object({ token: z.string().trim().min(16).max(200) });

/** "Join as partner": grants the partner enrollment (owner's drip clock) and opens the course. */
export async function acceptPartnerInviteAction(_prev: SimpleActionState, formData: FormData): Promise<SimpleActionState> {
  const parsed = schema.safeParse({ token: formData.get("token") });
  if (!parsed.success) return { status: "error", message: "This invitation link looks incomplete. Please open it from your email again.", stamp: Date.now() };
  const session = await requireUser(`/partner/${parsed.data.token}`);
  const result = await acceptPartnerInvite(parsed.data.token, session.user_id);
  if (!result.ok) return { status: "error", message: result.error ?? "We couldn't accept this invitation just now.", stamp: Date.now() };
  revalidatePath("/learn", "layout");
  const course = result.courseId ? await getCourseById(result.courseId) : null;
  redirect(course ? `/learn/${course.slug}` : "/learn");
}
