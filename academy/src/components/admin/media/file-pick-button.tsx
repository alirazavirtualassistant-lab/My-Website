"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/**
 * A button that opens a file picker and reports progress while `onFile`
 * runs. Keeps the hidden input out of the tab order and resets it afterwards
 * so the same file can be picked twice.
 */
function FilePickButton({ accept, label, pendingLabel = "Uploading…", onFile, progress, disabled, children, ...props }: Omit<ButtonProps, "onClick"> & { accept: string; label: string; pendingLabel?: string; onFile: (file: File) => Promise<void> | void; progress: number | null }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const busy = progress !== null;
  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) await onFile(file);
        }}
      />
      <Button type="button" variant="outline" size="sm" {...props} disabled={disabled || busy} loading={busy} onClick={() => inputRef.current?.click()} aria-label={label}>
        {children ?? (
          <>
            <Upload /> {label}
          </>
        )}
      </Button>
      {busy ? (
        <div>
          <Progress value={progress} size="sm" tone="rose" aria-label={pendingLabel} />
          <p className="mt-1 text-xs text-muted-foreground tabular-nums" role="status">
            {pendingLabel} {progress}%
          </p>
        </div>
      ) : null}
    </div>
  );
}

export { FilePickButton };
