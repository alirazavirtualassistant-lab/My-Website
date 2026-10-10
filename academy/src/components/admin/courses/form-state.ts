/**
 * `useActionState` shape shared by every admin CMS form. Plain types only so
 * Server Actions and Client Components can both import it.
 */
import type { z } from "zod";

export interface AdminFormState {
  status: "idle" | "error" | "success";
  /** Per-field messages keyed by input name; "form" for general errors. */
  errors?: Record<string, string>;
  /** Flat list for the error summary. */
  summary?: string[];
  /** Human message for the success toast. */
  message?: string;
  /** Changes on every successful submit so toast effects re-fire. */
  stamp?: number;
}

export const idleAdminState: AdminFormState = { status: "idle" };

export function adminError(errors: Record<string, string>, summary?: string[]): AdminFormState {
  return { status: "error", errors, summary: summary ?? Object.values(errors) };
}

export function adminFormError(message: string): AdminFormState {
  return adminError({ form: message }, [message]);
}

export function adminSuccess(message = "Saved"): AdminFormState {
  return { status: "success", message, stamp: Date.now() };
}

/** First message per field from a zod error, plus the flat summary. */
export function zodErrors(error: z.ZodError): AdminFormState {
  const errors: Record<string, string> = {};
  const summary: string[] = [];
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in errors)) {
      errors[key] = issue.message;
      summary.push(issue.message);
    }
  }
  return adminError(errors, summary);
}

/** Plain object from FormData: repeated keys become arrays, files are skipped. */
export function formToObject(formData: FormData): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  formData.forEach((value, key) => {
    if (typeof value !== "string") return;
    const bare = key.endsWith("[]") ? key.slice(0, -2) : key;
    if (key.endsWith("[]")) {
      const arr = (out[bare] as string[] | undefined) ?? [];
      arr.push(value);
      out[bare] = arr;
    } else if (!(bare in out)) {
      out[bare] = value;
    }
  });
  return out;
}

/** One entry per non-empty line. */
export function linesToList(text: string | undefined | null): string[] {
  return (text ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}
