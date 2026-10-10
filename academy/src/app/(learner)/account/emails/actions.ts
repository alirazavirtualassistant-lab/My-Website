"use server";

import { updateProfile } from "@/lib/usecases/users";
import { emailPreferencesSchema, parseForm } from "@/components/auth/logic";
import { errorState, type FormState } from "@/components/auth/types";
import { requireProfile } from "../_shared";

export async function updateEmailPreferencesAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireProfile("/account/emails");
  const parsed = parseForm(emailPreferencesSchema, formData);
  if (!parsed.ok) return errorState(parsed.errors, parsed.summary);
  await updateProfile(me.session.user_id, { email_preferences: parsed.data });
  return { status: "success", message: "Preferences saved.", stamp: Date.now() };
}
