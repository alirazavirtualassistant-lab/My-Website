"use client";

import { useActionState } from "react";
import { toast } from "@/components/ui/toaster";
import { idleState, type FormState } from "@/components/auth/types";
import { messageOf, type AdminAction } from "./form-state";

export interface UseAdminActionOptions {
  /** Runs after a non-error result (the action may also redirect, in which case nothing runs). */
  onSuccess?: (state: FormState) => void;
  onError?: (state: FormState) => void;
  /** Toast the success message (default true). */
  toastSuccess?: boolean;
  /** Toast the error message (default true; turn off when the form shows an inline summary). */
  toastError?: boolean;
}

/**
 * `useActionState` plus the result handling every admin form needs, done in
 * the action callback itself (not in an effect): toasts, closing dialogs,
 * resetting local state.
 */
export function useAdminAction(action: AdminAction, opts: UseAdminActionOptions = {}) {
  return useActionState(async (prev: FormState, formData: FormData) => {
    const next = await action(prev, formData);
    // A redirecting action resolves without a state while the router navigates away.
    if (!next) return prev;
    const message = messageOf(next);
    if (next.status === "error") {
      if (opts.toastError !== false) toast.error(message ?? "Something went wrong. Please try again.");
      opts.onError?.(next);
    } else {
      if (opts.toastSuccess !== false && message) toast.success(message);
      opts.onSuccess?.(next);
    }
    return next;
  }, idleState);
}
