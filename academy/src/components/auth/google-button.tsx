"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { googleStartAction } from "@/app/(auth)/actions";
import { idleState } from "./types";

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4.5" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.7h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" />
      <path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6z" />
      <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z" />
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
