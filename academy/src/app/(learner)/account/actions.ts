"use server";

import { revalidatePath } from "next/cache";
import { storePublicAsset } from "@/lib/usecases/uploads";
import { updateProfile } from "@/lib/usecases/users";
import { parseForm, profileSchema } from "@/components/auth/logic";
import { errorState, formError, type FormState } from "@/components/auth/types";
import { requireProfile } from "./_shared";

const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

function isValidTimeZone(zone: string): boolean {
  try {
    return Intl.supportedValuesOf("timeZone").includes(zone);
  } catch {
    return true;
  }
}

export async function updateProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireProfile("/account");
  const parsed = parseForm(profileSchema, formData);
  if (!parsed.ok) return errorState(parsed.errors, parsed.summary);
  const { name, timezone } = parsed.data;
  if (timezone && !isValidTimeZone(timezone)) return errorState({ timezone: "Please pick a time zone from the list." });

  let avatar_url: string | undefined;
  const file = formData.get("avatar");
  if (file instanceof File && file.size > 0) {
    if (!AVATAR_TYPES.includes(file.type)) return errorState({ avatar: "Please choose a JPG, PNG or WebP image." });
    try {
      avatar_url = (await storePublicAsset("avatars", file, "avatar")).url;
    } catch (err) {
      return errorState({ avatar: (err as Error).message || "We couldn't save that photo. Please try another." });
    }
  }

  await updateProfile(me.session.user_id, { name, timezone, ...(avatar_url ? { avatar_url } : {}) });
  revalidatePath("/", "layout");
  return { status: "success", message: "Saved. Looking good.", stamp: Date.now() };
}

export async function removeAvatarAction(): Promise<FormState> {
  const me = await requireProfile("/account");
  try {
    await updateProfile(me.session.user_id, { avatar_url: null });
  } catch {
    return formError("We couldn't remove the photo just now. Please try again.");
  }
  revalidatePath("/", "layout");
  return { status: "success", message: "Photo removed.", stamp: Date.now() };
}
