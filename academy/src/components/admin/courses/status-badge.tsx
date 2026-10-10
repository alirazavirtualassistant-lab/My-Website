import * as React from "react";
import { Badge } from "@/components/ui/badge";
import type { CourseStatus, LessonStatus } from "@/lib/types";

const variants: Record<CourseStatus | LessonStatus, { variant: React.ComponentProps<typeof Badge>["variant"]; label: string }> = {
  draft: { variant: "muted", label: "Draft" },
  published: { variant: "success", label: "Published" },
  scheduled: { variant: "gold", label: "Scheduled" },
  archived: { variant: "outline", label: "Archived" },
};

/** Course / lesson status pill. */
function StatusBadge({ status, className }: { status: CourseStatus | LessonStatus; className?: string }) {
  const v = variants[status] ?? variants.draft;
  return (
    <Badge variant={v.variant} className={className}>
      {v.label}
    </Badge>
  );
}

export { StatusBadge };
