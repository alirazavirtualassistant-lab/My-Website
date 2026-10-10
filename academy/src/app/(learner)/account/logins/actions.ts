"use server";

import { getServices } from "@/services";
import { changePasswordSchema, parseForm } from "@/components/auth/logic";
import { errorState, formError, type FormState } from "@/components/auth/types";
import { requireProfile } from "../_shared";

export async function changePasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireProfile("/account/logins");
  const parsed = parseForm(changePasswordSchema, formData);
  if (!parsed.ok) return errorState(parsed.errors, parsed.summary);
  const { auth } = await getServices();
  const result = await auth.changePassword({ userId: me.session.user_id, currentPassword: parsed.data.current, newPassword: parsed.data.password });
  if (!result.ok) {
    const message = result.error ?? "We couldn't update your password. Please try again.";
    const field = /current password/i.test(message) ? "current" : /password/i.test(message) ? "password" : "form";
    return errorState({ [field]: message });
  }
  return { status: "success", message: "Password updated. Nicely done.", stamp: Date.now() };
}

export async function sendMagicLinkToMeAction(): Promise<FormState> {
  const me = await requireProfile("/account/logins");
  const { auth } = await getServices();
  const result = await auth.sendMagicLink({ email: me.profile.email, redirectTo: "/account/logins" });
  if (!result.ok) return formError(result.error ?? "We couldn't send the link. Please try again.");
  return { status: "sent", email: me.profile.email };
}
