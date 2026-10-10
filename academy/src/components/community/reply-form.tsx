"use client";

import * as React from "react";
import { useActionState } from "react";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { FormErrorSummary } from "@/components/auth/form-error-summary";
import { SubmitButton } from "@/components/auth/submit-button";
import { createReplyAction } from "@/app/(learner)/community/[course]/actions";
import { AnonymousSwitch } from "./anonymous-switch";
import { idleFormState } from "./types";

export interface ReplyFormProps {
  postId: string;
  className?: string;
}

/** Reply box under a post. Resets after a successful submit and toasts. */
function ReplyForm({ postId, className }: ReplyFormProps) {
  const [state, action] = useActionState(createReplyAction, idleFormState);
  const errors = state.errors ?? {};

  React.useEffect(() => {
    if (state.status === "success" && state.stamp) toast.success(state.message ?? "Reply posted.");
  }, [state.status, state.stamp, state.message]);

  // Remount after a successful submit so the textarea and the anonymous checkbox both clear.
  return (
    <form key={state.stamp ?? 0} action={action} noValidate className={cn("card-soft grid gap-4 p-4 sm:p-5", className)} aria-labelledby="reply-form-title">
      <h3 id="reply-form-title" className="font-serif text-xl font-medium">
        Add a reply
      </h3>
      <FormErrorSummary summary={state.summary} />
      <input type="hidden" name="postId" value={postId} />
      <FormField id="reply-body" label="Your reply" hideLabel required error={errors.body}>
        <Textarea name="body" rows={4} maxLength={5000} placeholder="Share what worked for you, ask a question, or just say: me too." />
      </FormField>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AnonymousSwitch variant="checkbox" label="Reply anonymously" />
        <SubmitButton pendingLabel="Posting your reply">Post reply</SubmitButton>
      </div>
    </form>
  );
}

export { ReplyForm };
