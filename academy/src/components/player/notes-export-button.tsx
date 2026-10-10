"use client";

/** "Download .md": asks the Server Action for the Markdown and saves it as a file. */
import * as React from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { exportNotesAction } from "@/app/(learner)/learn/[course]/notes/actions";

function NotesExportButton({ courseSlug, disabled }: { courseSlug: string; disabled?: boolean }) {
  const [pending, startTransition] = React.useTransition();
  function download() {
    startTransition(async () => {
      const res = await exportNotesAction({ courseSlug });
      if (!res.ok || !res.markdown) {
        toast.error(res.error ?? "We couldn't build the export just now.");
        return;
      }
      const blob = new Blob([res.markdown], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename ?? "notes.md";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }
  return (
    <Button onClick={download} loading={pending} disabled={disabled} variant="outline">
      <FileDown aria-hidden="true" />
      Download .md
    </Button>
  );
}

export { NotesExportButton };
