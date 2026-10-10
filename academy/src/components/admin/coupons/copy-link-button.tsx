"use client";

import * as React from "react";
import { Check, Link2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";

/** Copies the auto-apply link (…/courses/<slug>?coupon=CODE) to the clipboard. */
function CopyLinkButton({ url, label = "Copy auto-apply link", ...props }: { url: string; label?: string } & Omit<ButtonProps, "onClick" | "children">) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={copied ? "Link copied" : label}
      title={url}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          toast.success("Auto-apply link copied.", { description: url });
        } catch {
          toast.error("Couldn't copy. Here's the link:", { description: url, duration: 10_000 });
        }
      }}
      {...props}
    >
      {copied ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />}
      {copied ? "Copied" : "Copy link"}
    </Button>
  );
}

export { CopyLinkButton };
