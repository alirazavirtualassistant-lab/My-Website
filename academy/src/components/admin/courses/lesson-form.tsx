"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { Lesson, LessonStatus } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormRow, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveLessonAction } from "@/app/admin/(panel)/courses/[id]/lessons/[lessonId]/actions";
import { AdminCard, FormErrors, SaveButton, useSavedToast } from "./form-bits";
import { idleAdminState } from "./form-state";
import { NativeSelect } from "./native-select";
import { splitDuration } from "./reorder";

function toLocalDateTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function Toggle({ id, name, label, hint, defaultChecked }: { id: string; name: string; label: string; hint: string; defaultChecked: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <Checkbox id={id} name={name} defaultChecked={defaultChecked} className="mt-0.5" />
      <Label htmlFor={id} className="flex-col items-start gap-0.5 font-normal">
        <span className="font-semibold">{label}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </Label>
    </div>
  );
}

/**
 * Lesson text + scheduling. Media, resources and action steps have their own
 * cards so a large transcript save never collides with an upload.
 */
function LessonForm({ lesson, courseId, quizzes, moduleDripDays }: { lesson: Lesson; courseId: string; quizzes: Array<{ key: string; title: string }>; moduleDripDays: number }) {
  const router = useRouter();
  const action = React.useMemo(() => saveLessonAction.bind(null, lesson.id, courseId), [lesson.id, courseId]);
  const [state, formAction] = useActionState(action, idleAdminState);
  const refresh = React.useCallback(() => router.refresh(), [router]);
  useSavedToast(state, refresh);
  const errors = state.errors ?? {};
  const [status, setStatus] = React.useState<LessonStatus>(lesson.status);
  const { minutes, seconds } = splitDuration(lesson.duration_sec);
  const words = lesson.transcript.trim() ? lesson.transcript.trim().split(/\s+/).length : 0;

  return (
    <form action={formAction} noValidate className="space-y-6">
      <FormErrors state={state} />

      <AdminCard id="lesson-basics" title="Lesson" description="Titles, descriptions and notes come verbatim from the course sheet when imported.">
        <FormStack>
          <FormRow className="sm:grid-cols-[8rem_1fr]">
            <FormField id="lesson-code" label="Code" error={errors.code} required hint="Also the URL slug">
              <Input name="code" defaultValue={lesson.code} maxLength={20} spellCheck={false} className="font-mono uppercase" required />
            </FormField>
            <FormField id="lesson-title" label="Title" error={errors.title} required>
              <Input name="title" defaultValue={lesson.title} maxLength={200} required />
            </FormField>
          </FormRow>
          <FormField id="lesson-series" label="Series" hint="e.g. THE FIX for Cravings, Group Coaching Replay" error={errors.series}>
            <Input name="series" defaultValue={lesson.series ?? ""} maxLength={200} />
          </FormField>
          <FormField id="lesson-description" label="Short description" error={errors.description}>
            <Textarea name="description" defaultValue={lesson.description} maxLength={2000} className="min-h-20" />
          </FormField>
          <FormField id="lesson-notes" label="Notes" hint="Shown under the video as lesson notes." error={errors.notes}>
            <Textarea name="notes" defaultValue={lesson.notes} maxLength={10000} className="min-h-24" />
          </FormField>
          <FormRow className="sm:grid-cols-[auto_auto_1fr] sm:items-end">
            <FormField id="lesson-minutes" label="Duration (min)" error={errors.minutes}>
              <Input name="minutes" type="number" min={0} max={600} defaultValue={minutes} inputMode="numeric" className="w-24" />
            </FormField>
            <FormField id="lesson-seconds" label="Seconds" error={errors.seconds}>
              <Input name="seconds" type="number" min={0} max={59} defaultValue={seconds} inputMode="numeric" className="w-24" />
            </FormField>
            <FormField id="lesson-filename" label="Planned video filename" hint="Used by the bulk uploader to match files." error={errors.planned_video_filename}>
              <Input name="planned_video_filename" defaultValue={lesson.planned_video_filename ?? ""} maxLength={255} spellCheck={false} className="font-mono text-sm" />
            </FormField>
          </FormRow>
        </FormStack>
      </AdminCard>

      <AdminCard id="lesson-transcript" title="Transcript" description={`Teleprompter text, shown verbatim to learners. ${words.toLocaleString("en-US")} words.`}>
        <FormField id="lesson-transcript-text" label="Transcript" hideLabel error={errors.transcript}>
          <Textarea name="transcript" defaultValue={lesson.transcript} className="min-h-80 font-mono text-xs leading-relaxed" spellCheck={false} />
        </FormField>
        {lesson.transcript_source_file ? <p className="mt-2 text-xs text-muted-foreground">Source: {lesson.transcript_source_file}</p> : null}
      </AdminCard>

      <AdminCard id="lesson-flags" title="Behaviour" description="Preview, intro, doctor callout and the native quiz attached to this lesson.">
        <FormStack>
          <div className="grid gap-3 sm:grid-cols-3">
            <Toggle id="lesson-preview" name="is_preview" label="Free preview" hint="Public at /courses/…/preview" defaultChecked={lesson.is_preview} />
            <Toggle id="lesson-intro" name="is_intro" label="Module introduction" hint="The MxT0 lesson" defaultChecked={lesson.is_intro} />
            <Toggle id="lesson-doctor" name="doctor_callout" label="Doctor callout" hint="Shows the “check with your doctor” note" defaultChecked={lesson.doctor_callout} />
          </div>
          <FormRow>
            <FormField id="lesson-quiz" label="Quiz or survey" hint="A native in-app form shown with this lesson." error={errors.quiz_key}>
              <NativeSelect name="quiz_key" defaultValue={lesson.quiz_key ?? ""}>
                <option value="">None</option>
                {quizzes.map((q) => (
                  <option key={q.key} value={q.key}>
                    {q.title} ({q.key})
                  </option>
                ))}
              </NativeSelect>
            </FormField>
            <FormField
              id="lesson-drip"
              label="Unlock override (days)"
              hint={`Blank = follow the module (${moduleDripDays === 0 ? "opens on enrolment" : `after ${moduleDripDays} days`}). Counted from the learner’s enrolment date.`}
              error={errors.drip_days_override}
            >
              <Input name="drip_days_override" type="number" min={0} max={3650} defaultValue={lesson.drip_days_override ?? ""} inputMode="numeric" />
            </FormField>
          </FormRow>
        </FormStack>
      </AdminCard>

      <AdminCard id="lesson-publishing" title="Publishing" description="Draft lessons are hidden from learners; scheduled ones appear at the chosen time.">
        <FormRow>
          <FormField id="lesson-status" label="Status" error={errors.status} required>
            <NativeSelect name="status" value={status} onChange={(e) => setStatus(e.target.value as LessonStatus)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </NativeSelect>
          </FormField>
          {status === "scheduled" ? (
            <FormField id="lesson-publish-at" label="Publish at" error={errors.publish_at} required>
              <Input name="publish_at" type="datetime-local" defaultValue={toLocalDateTime(lesson.publish_at)} />
            </FormField>
          ) : null}
        </FormRow>
      </AdminCard>

      <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-3 border-t border-border bg-cream/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-lg lg:border lg:px-4">
        <SaveButton>Save lesson</SaveButton>
      </div>
    </form>
  );
}

export { LessonForm };
