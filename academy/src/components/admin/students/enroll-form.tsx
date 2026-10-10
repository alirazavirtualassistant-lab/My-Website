"use client";

import * as React from "react";
import { useActionState } from "react";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toaster";
import { idleState } from "@/components/auth/types";
import { compEnrollAction } from "@/app/admin/(panel)/students/actions";
import { messageOf } from "./form-state";

export interface EnrollFormProps {
  userId: string;
  courses: Array<{ id: string; title: string; status: string }>;
}

/** "Enroll in course" (complimentary access) — goes through the same grantEnrollment path as a purchase. */
function EnrollForm({ userId, courses }: EnrollFormProps) {
  const [state, action, pending] = useActionState(compEnrollAction, idleState);
  const [courseId, setCourseId] = React.useState<string>(courses[0]?.id ?? "");
  React.useEffect(() => {
    if (!state.stamp) return;
    const message = messageOf(state);
    if (state.status === "error") toast.error(message ?? "Something went wrong.");
    else if (message) toast.success(message);
  }, [state]);
  if (courses.length === 0) {
    return <p className="text-sm text-muted-foreground">This student already has access to every course.</p>;
  }
  return (
    <form action={action} className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <input type="hidden" name="user_id" value={userId} />
      <div className="grid flex-1 gap-1.5">
        <Label htmlFor="enroll-course">Enroll in course (complimentary)</Label>
        <Select name="course_id" value={courseId} onValueChange={setCourseId}>
          <SelectTrigger id="enroll-course" className="w-full" aria-invalid={state.errors?.course_id ? true : undefined}>
            <SelectValue placeholder="Choose a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.title}
                {c.status !== "published" ? ` (${c.status})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.status === "error" && state.errors?.course_id ? (
          <p role="alert" className="text-xs font-medium text-danger">
            {state.errors.course_id}
          </p>
        ) : null}
      </div>
      <Button type="submit" loading={pending} disabled={!courseId}>
        <Gift aria-hidden="true" /> Enroll
      </Button>
    </form>
  );
}

export { EnrollForm };
