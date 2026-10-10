"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { reimportBundledAction } from "@/app/admin/(panel)/importer/actions";

/** Demo mode: preview the bundled Baby Steps package without uploading anything. */
function ReimportBundledButton() {
  const [pending, startTransition] = React.useTransition();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      loading={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await reimportBundledAction();
          if (res && res.status === "error") toast.error(res.summary?.[0] ?? "Could not load the bundled package.");
        })
      }
    >
      <RefreshCw /> Re-import bundled Baby Steps
    </Button>
  );
}

export { ReimportBundledButton };
