/** Shared `useActionState` shape for every auth + account form. Plain types only. */
import type { AuthErrorCode, FieldErrors } from "./logic";

export interface FormState {
  status: "idle" | "error" | "sent" | "success";
  /** Per-field messages keyed by input name; "form" for general errors. */
  errors?: FieldErrors;
  /** Flat list for the error summary (screen-reader friendly). */
  summary?: string[];
  /** Human message for sent/success states. */
  message?: string;
  code?: AuthErrorCode;
  /** Email the message was sent to (sent states). */
  email?: string;
  /** Changes on every successful submit so effects (toasts) can re-fire. */
  stamp?: number;
}

export const idleState: FormState = { status: "idle" };

export function errorState(errors: FieldErrors, summary?: string[], code?: AuthErrorCode): FormState {
  return { status: "error", errors, summary: summary ?? Object.values(errors), code };
}

export function formError(message: string, code?: AuthErrorCode): FormState {
  return errorState({ form: message }, [message], code);
}
