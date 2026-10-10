import * as React from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIGN_OUT_ACTION } from "./nav-config";

/** Posts to /api/auth/sign-out (route handler owned by the auth work). */
function SignOutButton({ className, children = "Sign out", ...props }: React.ComponentProps<"button">) {
  return (
    <form action={SIGN_OUT_ACTION} method="post" className="contents">
      <button
        type="submit"
        className={cn(
          "inline-flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-foreground hover:bg-rose-soft/60 hover:text-rose-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          className,
        )}
        {...props}
      >
        <LogOut className="size-4 text-muted-foreground" aria-hidden="true" />
        {children}
      </button>
    </form>
  );
}

export { SignOutButton };
