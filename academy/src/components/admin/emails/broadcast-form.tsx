"use client";

import * as React from "react";
import Link from "next/link";
import { Send, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormErrorSummary } from "@/components/auth/form-error-summary";
import { SubmitButton } from "@/components/auth/submit-button";
import { renderMarkdown } from "@/components/shared/markdown-render";
import { sendBroadcastAction, sendBroadcastTestAction } from "@/app/admin/(panel)/emails/actions";
import { useAdminAction } from "@/components/admin/students/use-admin-action";

export interface BroadcastFormProps {
  courses: Array<{ id: string; title: string }>;
  counts: { all: number; byCourse: Record<string, { course: number; incomplete: number }> };
  meEmail: string;
  demo: boolean;
}

type Audience = "all" | "course" | "incomplete";
const NONE = "__none__";

const AUDIENCES: Array<{ key: Audience; label: string; help: string }> = [
  { key: "all", label: "Everyone who opted in", help: "Every account with “Letters from Cynthia” switched on." },
  { key: "course", label: "Enrolled in a course", help: "Active enrollments in the course you pick." },
  { key: "incomplete", label: "Enrolled but not finished", help: "Enrolled in the course and without a certificate yet." },
];

/** Subject + markdown body + audience, with a live preview, a test send and a confirmed real send. */
function BroadcastForm({ courses, counts, meEmail, demo }: BroadcastFormProps) {
  const [state, sendAction] = useAdminAction(sendBroadcastAction, { toastError: false });
  const [testState, testAction] = useAdminAction(sendBroadcastTestAction);
  const [audience, setAudience] = React.useState<Audience>("all");
  const [courseId, setCourseId] = React.useState<string>(courses[0]?.id ?? NONE);
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const errors = { ...(testState.status === "error" ? testState.errors : {}), ...(state.status === "error" ? state.errors : {}) };

  const reach = audience === "all" ? counts.all : courseId !== NONE ? (counts.byCourse[courseId]?.[audience] ?? 0) : 0;
  const previewHtml = React.useMemo(() => renderMarkdown(body || "_Your message will appear here._"), [body]);

  return (
    <form action={sendAction} noValidate className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="grid gap-6">
        <FormErrorSummary summary={state.status === "error" ? state.summary : undefined} />
        <FormStack>
          <FormField id="bc-subject" label="Subject" required error={errors.subject}>
            <Input name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={160} required placeholder="A note from Cynthia: new replays are up" />
          </FormField>
          <FormField id="bc-body" label="Message" required hint="Markdown works: headings, **bold**, lists and [links](https://…). It opens with “Hi {first name},” automatically." error={errors.body}>
            <Textarea name="body" value={body} onChange={(e) => setBody(e.target.value)} rows={12} maxLength={20_000} required className="font-mono text-sm" />
          </FormField>
        </FormStack>

        <fieldset className="grid gap-3">
          <legend className="mb-1 text-sm font-semibold">Audience</legend>
          <RadioGroup name="audience" value={audience} onValueChange={(v) => setAudience(v as Audience)}>
            {AUDIENCES.map((a) => (
              <Label key={a.key} htmlFor={`aud-${a.key}`} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3 font-medium has-[[data-state=checked]]:border-rose has-[[data-state=checked]]:bg-rose-soft/40">
                <RadioGroupItem id={`aud-${a.key}`} value={a.key} className="mt-0.5" />
                <span className="grid gap-0.5">
                  <span>{a.label}</span>
                  <span className="text-xs font-normal text-muted-foreground">{a.help}</span>
                </span>
              </Label>
            ))}
          </RadioGroup>
          {errors.audience ? (
            <p role="alert" className="text-xs font-medium text-danger">
              {errors.audience}
            </p>
          ) : null}
          {audience !== "all" ? (
            <div className="grid gap-1.5">
              <Label htmlFor="bc-course">Course</Label>
              <Select name="course_id" value={courseId} onValueChange={setCourseId}>
                <SelectTrigger id="bc-course" className="w-full" aria-invalid={errors.course_id ? true : undefined}>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.length === 0 ? <SelectItem value={NONE}>No courses yet</SelectItem> : null}
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.course_id ? (
                <p role="alert" className="text-xs font-medium text-danger">
                  {errors.course_id}
                </p>
              ) : null}
            </div>
          ) : (
            <input type="hidden" name="course_id" value="" />
          )}
          <p className="rounded-lg bg-sage-soft/70 px-3 py-2 text-sm text-sage-strong" role="status" aria-live="polite">
            Will reach <span className="font-semibold tabular-nums">{reach.toLocaleString("en-US")}</span> {reach === 1 ? "person" : "people"} right now. Only accounts with the newsletter preference on are included.
          </p>
        </fieldset>

        <div className="grid gap-3 rounded-lg border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <Checkbox id="bc-confirm" name="confirm" value="on" aria-describedby={errors.confirm ? "bc-confirm-error" : undefined} aria-invalid={errors.confirm ? true : undefined} />
            <Label htmlFor="bc-confirm" className="cursor-pointer leading-snug font-medium">
              I’ve read the preview and I’m ready to send this to {reach.toLocaleString("en-US")} {reach === 1 ? "person" : "people"}.
            </Label>
          </div>
          {errors.confirm ? (
            <p id="bc-confirm-error" role="alert" className="text-xs font-medium text-danger">
              {errors.confirm}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <SubmitButton pendingLabel="Sending to everyone…" disabled={reach === 0}>
              <Send aria-hidden="true" /> Send to {reach.toLocaleString("en-US")}
            </SubmitButton>
            <Button type="submit" formAction={testAction} formNoValidate variant="outline">
              <FlaskConical aria-hidden="true" /> Send test to me
            </Button>
            <Button asChild variant="ghost">
              <Link href="/admin/emails/broadcasts">Cancel</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Tests go to {meEmail}
            {demo ? " (demo mode: open /dev/mailbox to read it)" : ""}. Sending happens one recipient at a time, so a single bad address never stops the rest.
          </p>
        </div>
      </div>

      <aside aria-label="Preview" className="lg:sticky lg:top-24 lg:self-start">
        <p className="eyebrow mb-2">Preview</p>
        <div className="card-soft overflow-hidden">
          <div className="border-b border-border bg-cream-2/60 px-5 py-3 text-sm">
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Subject</p>
            <p className="font-semibold">{subject || <span className="font-normal text-muted-foreground">Your subject line</span>}</p>
          </div>
          <div className="p-5">
            <p className="eyebrow mb-3 text-[0.65rem]">From Cynthia</p>
            <p className="mb-3 text-sm">Hi there,</p>
            <div className="prose-cyc text-sm" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            <p className="mt-5 text-sm text-muted-foreground">Warmly, Cynthia Myers Morrison, EdD</p>
          </div>
        </div>
      </aside>
    </form>
  );
}

export { BroadcastForm };
