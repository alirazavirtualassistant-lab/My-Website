/**
 * Tiny helpers for admin Server Actions that use the shared `FormState`
 * shape from the auth forms. `stamp` changes on every result so client
 * effects (toasts, closing dialogs) re-fire even for repeated messages.
 */
import type { FormState } from "@/components/auth/types";

export type AdminFormState = FormState;
export type AdminAction = (prev: FormState, formData: FormData) => Promise<FormState>;

export function done(message: string, extra: Partial<FormState> = {}): FormState {
  return { status: "success", message, stamp: Date.now(), ...extra };
}

export function sent(message: string, email?: string): FormState {
  return { status: "sent", message, email, stamp: Date.now() };
}

export function failed(message: string, errors: Record<string, string> = {}): FormState {
  const fieldMessages = Object.values(errors);
  return { status: "error", errors: { form: message, ...errors }, summary: [message, ...fieldMessages.filter((m) => m !== message)], stamp: Date.now() };
}

export function invalid(errors: Record<string, string>, summary?: string[]): FormState {
  return { status: "error", errors, summary: summary ?? Object.values(errors), stamp: Date.now() };
}

/** First human message out of a state, for toasts. */
export function messageOf(state: FormState): string | null {
  if (state.status === "error") return state.errors?.form ?? state.summary?.[0] ?? "Something went wrong. Please try again.";
  return state.message ?? null;
}
