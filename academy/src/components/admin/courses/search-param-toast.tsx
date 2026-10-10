"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/toaster";

const MESSAGES: Record<string, { kind: "success" | "info"; text: string }> = {
  created: { kind: "success", text: "Course created. Add modules and lessons when you’re ready." },
  imported: { kind: "success", text: "Package imported. The curriculum below reflects the new content." },
  deleted: { kind: "success", text: "Deleted." },
  "lesson-created": { kind: "success", text: "Lesson added." },
  "module-created": { kind: "success", text: "Module added." },
};

function Inner() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const key = params.get("toast");
  React.useEffect(() => {
    if (!key) return;
    const msg = MESSAGES[key];
    if (msg) toast[msg.kind](msg.text);
    const next = new URLSearchParams(params.toString());
    next.delete("toast");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [key, params, pathname, router]);
  return null;
}

/**
 * Shows a one-off toast from `?toast=<key>` after a redirect, then removes the
 * param so refreshes do not repeat it. Renders nothing. Wrapped in Suspense
 * because `useSearchParams` needs a boundary.
 */
function SearchParamToast() {
  return (
    <React.Suspense fallback={null}>
      <Inner />
    </React.Suspense>
  );
}

export { SearchParamToast };
