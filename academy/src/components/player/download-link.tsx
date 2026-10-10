"use client";

/**
 * Download button for a course resource. The server renders a signed URL as
 * the href (works without JS); on click we fetch a fresh signed URL through a
 * Server Action because links expire after ten minutes.
 */
import * as React from "react";
import { Download, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { resourceUrlAction } from "@/app/(learner)/learn/[course]/[lesson]/actions";

export interface DownloadLinkProps {
  resourceId: string;
  href: string;
  fileName: string;
  label?: string;
  size?: "sm" | "md";
  variant?: "outline" | "secondary" | "ghost";
  className?: string;
}

function DownloadLink({ resourceId, href, fileName, label = "Download", size = "sm", variant = "outline", className }: DownloadLinkProps) {
  const [pending, startTransition] = React.useTransition();
  return (
    <a
      href={href}
      download={fileName}
      aria-busy={pending || undefined}
      className={cn(buttonVariants({ size, variant }), className)}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        startTransition(async () => {
          const res = await resourceUrlAction({ resourceId });
          if (res.ok && res.url) {
            window.location.assign(res.url);
          } else {
            toast.error(res.error ?? "We couldn't prepare that download.");
          }
        });
      }}
    >
      {pending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Download aria-hidden="true" />}
      {label}
      <span className="sr-only"> {fileName}</span>
    </a>
  );
}

export { DownloadLink };
