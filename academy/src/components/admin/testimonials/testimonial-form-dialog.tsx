"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField, FormRow, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { FormErrorSummary } from "@/components/auth/form-error-summary";
import { SubmitButton } from "@/components/auth/submit-button";
import { idleState } from "@/components/auth/types";
import type { Testimonial } from "@/lib/types";
import { saveTestimonialAction } from "@/app/admin/(panel)/testimonials/actions";
import { messageOf } from "@/components/admin/students/form-state";

export interface TestimonialFormDialogProps {
  testimonial: Testimonial | null;
  courses: Array<{ id: string; title: string }>;
  trigger: React.ReactNode;
}

const NONE = "__none__";

/** Add (manual, with permission) or edit a testimonial. Manual additions are approved straight away. */
function TestimonialFormDialog({ testimonial, courses, trigger }: TestimonialFormDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [state, action] = useActionState(saveTestimonialAction, idleState);
  const errors = state.errors ?? {};
  const id = React.useId();
  React.useEffect(() => {
    if (!state.stamp || state.status === "error") return;
    const message = messageOf(state);
    if (message) toast.success(message);
    setOpen(false);
  }, [state]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{testimonial ? "Edit testimonial" : "Add a testimonial"}</DialogTitle>
          <DialogDescription>{testimonial ? "Light edits only — keep their words their own." : "Only add words someone has given you permission to share. It goes live as approved."}</DialogDescription>
        </DialogHeader>
        <form action={action} noValidate className="grid gap-5">
          {testimonial ? <input type="hidden" name="id" value={testimonial.id} /> : null}
          <FormErrorSummary summary={state.status === "error" ? state.summary : undefined} />
          <FormStack>
            <FormRow>
              <FormField id={`${id}-name`} label="Author name" required error={errors.author_name} hint="Full name, first name, or initials — whatever they agreed to.">
                <Input name="author_name" defaultValue={testimonial?.author_name ?? ""} required maxLength={80} />
              </FormField>
              <FormField id={`${id}-role`} label="Role or context" error={errors.author_role} hint="e.g. “Baby Steps graduate”.">
                <Input name="author_role" defaultValue={testimonial?.author_role ?? ""} maxLength={80} />
              </FormField>
            </FormRow>
            <FormField id={`${id}-body`} label="Their words" required error={errors.body}>
              <Textarea name="body" defaultValue={testimonial?.body ?? ""} rows={5} maxLength={2000} required />
            </FormField>
            <FormRow>
              <div className="grid gap-1.5">
                <Label htmlFor={`${id}-rating`}>Rating</Label>
                <Select name="rating" defaultValue={testimonial?.rating ? String(testimonial.rating) : NONE}>
                  <SelectTrigger id={`${id}-rating`} className="w-full" aria-invalid={errors.rating ? true : undefined}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>No rating</SelectItem>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} / 5
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.rating ? (
                  <p role="alert" className="text-xs font-medium text-danger">
                    {errors.rating}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`${id}-course`}>Course</Label>
                <Select name="course_id" defaultValue={testimonial?.course_id ?? NONE}>
                  <SelectTrigger id={`${id}-course`} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>General (whole academy)</SelectItem>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FormRow>
          </FormStack>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton pendingLabel="Saving…">{testimonial ? "Save changes" : "Add testimonial"}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { TestimonialFormDialog };
