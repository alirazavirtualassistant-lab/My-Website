"use client";

/**
 * "Post Testimonial" action step: a short form that lands in the testimonials
 * table with status "pending" for Cynthia to review. Completing the step is
 * handled by the same Server Action.
 */
import * as React from "react";
import { Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";
import { submitTestimonialAction } from "@/app/(learner)/learn/[course]/[lesson]/actions";
import type { CompletionResult, TestimonialFormState } from "./types";

export interface TestimonialDialogProps {
  stepId: string;
  courseId: string;
  defaultName: string;
  completed: boolean;
  onCompleted: (result: CompletionResult | undefined) => void;
}

const idle: TestimonialFormState = { status: "idle" };

function TestimonialDialog({ stepId, courseId, defaultName, completed, onCompleted }: TestimonialDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [state, formAction, pending] = React.useActionState(submitTestimonialAction, idle);
  const handled = React.useRef<TestimonialFormState | null>(null);

  React.useEffect(() => {
    if (state.status === "success" && handled.current !== state) {
      handled.current = state;
      toast.success(state.message ?? "Thank you.");
      onCompleted(state.outcome);
      setOpen(false);
    }
  }, [state, onCompleted]);

  const errors = state.status === "error" ? (state.errors ?? {}) : {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={completed ? "ghost" : "secondary"}>
          <Quote aria-hidden="true" />
          {completed ? "Share another" : "Share your story"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share your story</DialogTitle>
          <DialogDescription>
            A few honest sentences about your experience. Cynthia reads every one before anything is published, and you can ask for it to be taken down at any time.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="stepId" value={stepId} />
          <input type="hidden" name="courseId" value={courseId} />
          <FormStack>
            <FormField id="t-name" label="Name to show" required error={errors.authorName}>
              <Input name="authorName" defaultValue={defaultName} autoComplete="name" maxLength={80} />
            </FormField>
            <FormField id="t-role" label="A little context" hint='For example "Mum of two" or "Trying for our first".' error={errors.authorRole}>
              <Input name="authorRole" maxLength={80} />
            </FormField>
            <fieldset className="grid gap-2">
              <legend className="text-sm font-semibold">How did the course feel overall?</legend>
              <RadioGroup name="rating" className="flex flex-wrap gap-4" aria-label="Rating out of five">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="flex items-center gap-1.5">
                    <RadioGroupItem id={`t-rating-${n}`} value={String(n)} />
                    <Label htmlFor={`t-rating-${n}`} className="text-sm">
                      {n}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <p className="text-xs text-muted-foreground">Optional. 1 = not for me, 5 = exactly what I needed.</p>
            </fieldset>
            <FormField id="t-body" label="Your words" required hint="What changed, what helped, what you would tell someone starting out." error={errors.body}>
              <Textarea name="body" rows={5} maxLength={2000} />
            </FormField>
          </FormStack>
          {errors.form ? (
            <p role="alert" className="text-sm font-medium text-danger">
              {errors.form}
            </p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Not now
            </Button>
            <Button type="submit" loading={pending}>
              Send to Cynthia
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { TestimonialDialog };
