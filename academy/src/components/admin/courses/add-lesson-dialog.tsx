"use client";

import * as React from "react";
import { useActionState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField, FormRow, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLessonAction } from "@/app/admin/(panel)/courses/[id]/curriculum/actions";
import { FormErrors, SaveButton } from "./form-bits";
import { idleAdminState } from "./form-state";
import { suggestLessonCode } from "./codes";

/** "Add lesson" → creates the row and sends the admin to the lesson editor. */
function AddLessonDialog({ courseId, moduleId, moduleCode, moduleTitle, existingCodes }: { courseId: string; moduleId: string; moduleCode: string; moduleTitle: string; existingCodes: string[] }) {
  const [open, setOpen] = React.useState(false);
  const action = React.useMemo(() => createLessonAction.bind(null, moduleId, courseId), [moduleId, courseId]);
  const [state, formAction] = useActionState(action, idleAdminState);
  const suggested = suggestLessonCode(moduleCode, existingCodes.map((code) => ({ code })));
  const errors = state.errors ?? {};
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Plus /> Add lesson
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a lesson to {moduleTitle}</DialogTitle>
          <DialogDescription>It starts as a draft. You’ll land in the lesson editor to add the video, notes, resources and action steps.</DialogDescription>
        </DialogHeader>
        <form action={formAction} noValidate className="grid gap-5">
          <FormErrors state={state} />
          <FormStack>
            <FormRow className="sm:grid-cols-[8rem_1fr]">
              <FormField id={`${moduleId}-new-code`} label="Code" error={errors.code} required hint="Unique in the course">
                <Input name="code" defaultValue={suggested} maxLength={20} spellCheck={false} className="font-mono uppercase" required />
              </FormField>
              <FormField id={`${moduleId}-new-title`} label="Title" error={errors.title} required>
                <Input name="title" maxLength={200} required autoFocus />
              </FormField>
            </FormRow>
            <div className="flex items-center gap-2">
              <Checkbox id={`${moduleId}-new-intro`} name="is_intro" />
              <Label htmlFor={`${moduleId}-new-intro`} className="font-normal">
                This is the module introduction
              </Label>
            </div>
          </FormStack>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <SaveButton pendingLabel="Creating lesson…">Create lesson</SaveButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { AddLessonDialog };
