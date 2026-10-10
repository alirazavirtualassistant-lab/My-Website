"use server";

/**
 * Server Actions for every public auth screen. All of them validate with zod,
 * talk to the AuthProvider only (no adapter-specific logic), and return a
 * `FormState` for `useActionState` or redirect on success.
 */
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServices } from "@/services";
import { getSession } from "@/lib/auth/session";
import { safeRedirectPath } from "@/lib/utils";
import {
  demoGoogleSchema,
  errorField,
  forgotPasswordSchema,
  isHoneypotTripped,
  magicLinkSchema,
  parseForm,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  tokenSchema,
  emailSchema,
  nextSchema,
} from "@/components/auth/logic";
import { errorState, formError, type FormState } from "@/components/auth/types";

const GENERIC = "Something went wrong on our side. Please try again in a moment.";

function verifyUrl(next: string, email?: string): string {
  const params = new URLSearchParams({ next });
  if (email) params.set("email", email);
  return `/verify-email?${params.toString()}`;
}

export async function signUpAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(signUpSchema, formData);
  if (!parsed.ok) return errorState(parsed.errors, parsed.summary);
  const { name, email, password, remember, next, website } = parsed.data;
  if (isHoneypotTripped(website)) redirect(verifyUrl(next, email));

  const { auth } = await getServices();
  const result = await auth.signUpWithPassword({ email, password, name, remember });
  if (!result.ok) {
    return { ...errorState({ [errorField(result.code)]: result.error }, [result.error], result.code), email };
  }
  revalidatePath("/", "layout");
  if (result.needs_verification) redirect(verifyUrl(next, email));
  redirect(next);
}

export async function signInAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(signInSchema, formData);
  if (!parsed.ok) return errorState(parsed.errors, parsed.summary);
  const { email, password, remember, next, website } = parsed.data;
  if (isHoneypotTripped(website)) redirect(next);

  const { auth } = await getServices();
  const result = await auth.signInWithPassword({ email, password, remember });
  if (!result.ok) {
    return { ...errorState({ [errorField(result.code)]: result.error }, [result.error], result.code), email };
  }
  revalidatePath("/", "layout");
  // Mock mode signs unverified users in (soft verification); Supabase reports `unverified` above.
  redirect(next);
}

export async function magicLinkAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(magicLinkSchema, formData);
  if (!parsed.ok) return errorState(parsed.errors, parsed.summary);
  const { email, next, website } = parsed.data;
  if (isHoneypotTripped(website)) return { status: "sent", email };

  const { auth } = await getServices();
  const result = await auth.sendMagicLink({ email, redirectTo: next });
  if (!result.ok) return { ...formError(result.error ?? GENERIC), email };
  return { status: "sent", email, message: "Check your inbox for a sign-in link." };
}

export async function googleStartAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const next = nextSchema.parse(String(formData.get("next") ?? ""));
  const { auth } = await getServices();
  let url: string;
  try {
    url = await auth.oauthStartUrl({ provider: "google", redirectTo: next });
  } catch (err) {
    console.warn("[auth] google start failed", err);
    return formError("Google sign-in isn't available right now. Please use your email instead.");
  }
  redirect(url);
}

export async function forgotPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(forgotPasswordSchema, formData);
  if (!parsed.ok) return errorState(parsed.errors, parsed.summary);
  const { email, website } = parsed.data;
  if (!isHoneypotTripped(website)) {
    const { auth } = await getServices();
    await auth.requestPasswordReset({ email });
  }
  // Always the same copy: never reveal whether an account exists.
  return { status: "sent", email };
}

export async function resetPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(resetPasswordSchema, formData);
  if (!parsed.ok) return errorState(parsed.errors, parsed.summary);
  const { token, password } = parsed.data;

  const { auth } = await getServices();
  const result = await auth.resetPassword({ token, password });
  if (!result.ok) {
    const field = result.code === "weak_password" ? "password" : "form";
    return errorState({ [field]: result.error }, [result.error], result.code);
  }
  revalidatePath("/", "layout");
  redirect("/learn");
}

export async function verifyEmailAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const token = tokenSchema.safeParse(String(formData.get("token") ?? ""));
  if (!token.success) return formError("That link looks incomplete. Please open it from your email again.");
  const { auth } = await getServices();
  const result = await auth.verifyEmail({ token: token.data });
  if (!result.ok) {
    const session = await getSession();
    return { ...formError(result.error, result.code), email: session?.email };
  }
  revalidatePath("/", "layout");
  return { status: "success", email: result.profile.email, stamp: Date.now() };
}

export async function resendVerificationAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = String(formData.get("email") ?? "");
  let email: string;
  if (raw) {
    const parsed = emailSchema.safeParse(raw);
    if (!parsed.success) return errorState({ email: parsed.error.issues[0]?.message ?? "Please enter a valid email address." });
    email = parsed.data;
  } else {
    const session = await getSession();
    if (!session) return errorState({ email: "Please enter your email address." });
    email = session.email;
  }
  const { auth } = await getServices();
  const result = await auth.sendVerificationEmail({ email });
  if (!result.ok) return formError(result.error ?? GENERIC);
  return { status: "sent", email };
}

export async function demoGoogleAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { auth, mode } = await getServices();
  if (!mode.demo || auth.kind !== "mock") return formError("The demo account picker is only available in demo mode.");
  const chosen = String(formData.get("email") ?? "").trim() || String(formData.get("email_custom") ?? "").trim();
  const parsed = parseForm(demoGoogleSchema, { email: chosen, next: String(formData.get("next") ?? "") });
  if (!parsed.ok) return errorState(parsed.errors, parsed.summary);
  const result = await auth.completeOAuth({ code: parsed.data.email });
  if (!result.ok) return formError(result.error, result.code);
  revalidatePath("/", "layout");
  redirect(safeRedirectPath(parsed.data.next, "/learn"));
}
