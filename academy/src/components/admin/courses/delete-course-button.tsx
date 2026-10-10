"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { deleteCourseAction } from "@/app/admin/(panel)/courses/actions";
import { ConfirmDialog } from "./confirm-dialog";

/**
 * Delete with confirmation. Courses with active enrollments require typing
 * DELETE and are deleted with `force` (enrollments and progress go too).
 */
function DeleteCourseButton({ courseId, title, enrolled, compact = false }: { courseId: string; title: string; enrolled: number; compact?: boolean }) {
  const router = useRouter();
  const force = enrolled > 0;
  return (
    <ConfirmDialog
      trigger={
        compact ? (
          <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-danger" aria-label={`Delete ${title}`}>
            <Trash2 />
          </Button>
        ) : (
          <Button variant="outline" className="text-danger hover:border-danger/50 hover:bg-danger-soft">
            <Trash2 /> Delete course
          </Button>
        )
      }
      title={`Delete “${title}”?`}
      description={
        force
          ? `${enrolled} ${enrolled === 1 ? "learner has" : "learners have"} an active enrollment. Deleting removes their access, progress and XP for this course. Consider archiving instead.`
          : "This removes the course with all of its modules, lessons, resources and action steps. There is no undo."
      }
      confirmLabel={force ? "Delete anyway" : "Delete course"}
      typeToConfirm={force ? "DELETE" : undefined}
      onConfirm={async () => {
        const result = await deleteCourseAction(courseId, force);
        if (!result.ok) {
          toast.error(result.error);
          throw new Error(result.error);
        }
        toast.success("Course deleted.");
        router.push("/admin/courses");
        router.refresh();
      }}
    />
  );
}

export { DeleteCourseButton };
