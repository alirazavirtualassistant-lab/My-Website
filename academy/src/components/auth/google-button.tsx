"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { googleStartAction } from "@/app/(auth)/actions";
import { idleState } from "./types";

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4.5" aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.3 0-5.9-2.7-5.9-6s2.6-6 5.9-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" />
      <path fill="#4285F4" d="M21.2 12.2c0-.6-.1-1.1-.2-1.6H12v3.9h5.4c-.2 1.2-1 2.3-2.1 3l3.4 2.6c2-1.8 3.1-4.5 3.1-7.9z" opacity=".001" />
    </svg>
  );
}

/** Starts the Google flow via a Server Action (so PKCE cookies can be set). Mock mode goes to the demo picker. */
function GoogleButton({ next, label = "Continue with Google" }: { next: string; label?: string }) {
  const [state, action, pending] = useActionState(googleStartAction, idleState);
  return (
    <form action={action} className="grid gap-2">
      <input type="hidden" name="next" value={next} />
      <Button type="submit" variant="outline" size="lg" className="w-full" loading={pending}>
        {!pending ? <GoogleGlyph /> : null}
        {label}
      </Button>
      {state.status === "error" ? (
        <p role="alert" className="text-xs font-medium text-danger">
          {state.errors?.form}
        </p>
      ) : null}
    </form>
  );
}

export { GoogleButton };
