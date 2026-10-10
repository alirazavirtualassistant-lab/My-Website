"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServices } from "@/services";
import { deleteUserAccount } from "@/lib/usecases/users";
import { deleteAccountSchema, parseForm } from "@/components/auth/logic";
import { errorState, formError, type FormState } from "@/components/auth/types";
import { requireProfile } from "../_shared";

export async function deleteAccountAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireProfile("/account/privacy");
  const parsed = parseForm(deleteAccountSchema, formData);
  if (!parsed.ok) return errorState(parsed.errors, parsed.summary);
  const result = await deleteUserAccount(me.session.user_id, me.session.user_id);
  if (!result.ok) return formError(result.error ?? "We couldn't delete the account just now. Please try again or contact support.");
  const { auth } = await getServices();
  try {
    await auth.signOut();
  } catch (err) {
    console.warn("[account/privacy] sign-out after delete failed", err);
  }
  revalidatePath("/", "layout");
  redirect("/sign-in?notice=deleted");
}
