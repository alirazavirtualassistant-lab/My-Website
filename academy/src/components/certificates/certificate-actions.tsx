"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Download, Link2, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";

export interface CertificateActionsProps extends React.ComponentProps<"div"> {
  pdfPath: string;
  linkedInUrl: string;
  verifyUrl: string;
  /** Downloads are disabled for revoked certificates. */
  revoked?: boolean;
  size?: "sm" | "md";
  /** Lay the buttons out vertically (detail page sidebar). */
  stacked?: boolean;
}

/** Download PDF · Share on LinkedIn · Copy verify link. */
function CertificateActions({ pdfPath, linkedInUrl, verifyUrl, revoked = false, size = "md", stacked = false, className, ...props }: CertificateActionsProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(verifyUrl);
      } else {
        const input = document.createElement("textarea");
        input.value = verifyUrl;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopied(true);
      toast.success("Verify link copied", { description: verifyUrl });
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Couldn't copy the link", { description: "You can copy it from the address bar of the verify page instead." });
    }
  }

  return (
    <div className={cn("flex flex-wrap gap-2", stacked && "flex-col", className)} {...props}>
      {revoked ? (
        <Button size={size} disabled aria-disabled="true" title="This certificate has been revoked">
          <Download aria-hidden="true" />
          Download PDF
        </Button>
      ) : (
        <Button asChild size={size}>
          <a href={pdfPath} download>
            <Download aria-hidden="true" />
            Download PDF
          </a>
        </Button>
      )}
      <Button asChild variant="outline" size={size} disabled={revoked}>
        <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" aria-disabled={revoked || undefined} tabIndex={revoked ? -1 : undefined} className={cn(revoked && "pointer-events-none opacity-50")}>
          <Linkedin aria-hidden="true" />
          Share on LinkedIn
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </Button>
      <Button type="button" variant="outline" size={size} onClick={copy} aria-live="polite">
        {copied ? <Check className="text-sage-strong" aria-hidden="true" /> : <Link2 aria-hidden="true" />}
        {copied ? "Copied" : "Copy verify link"}
      </Button>
      <Button asChild variant="link" size={size} className="px-1">
        <Link href={new URL(verifyUrl).pathname}>Open verify page</Link>
      </Button>
    </div>
  );
}

export { CertificateActions };
