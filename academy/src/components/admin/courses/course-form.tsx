"use client";

import * as React from "react";
import { useActionState } from "react";
import type { Course } from "@/lib/types";
import { site } from "@/lib/config/site";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormRow, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Illustration, ILLUSTRATION_NAMES, isIllustrationName } from "@/components/shared/illustration";
import { createCourseAction, saveCourseAction } from "@/app/admin/(panel)/courses/actions";
import { AdminCard, FormErrors, SaveButton, useSavedToast } from "./form-bits";
import { idleAdminState } from "./form-state";
import { FaqEditor } from "./faq-editor";
import { NativeSelect } from "./native-select";

function toLocalDateTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const EMPTY: Omit<Course, "id" | "created_at" | "updated_at" | "last_updated_at"> = {
  slug: "",
  title: "",
  subtitle: "",
  description: "",
  short_description: "",
  thumbnail_path: null,
  illustration: "leaves",
  status: "draft",
  publish_at: null,
  level: "All levels",
  language: "English",
  topics: [],
  badge: null,
  partner_seat_enabled: true,
  certificate_enabled: true,
  lifetime_access: true,
  access_days: null,
  what_you_learn: [],
  requirements: [],
  who_for: [],
  faq: [],
  duration_weeks: null,
};

/**
 * Course settings. Used for both /admin/courses/new (create) and
 * /admin/courses/[id] (save). All fields post as FormData to a Server Action;
 * `useActionState` carries field errors back.
 */
function CourseForm({ course }: { course: Course | null }) {
  const c = course ?? EMPTY;
  const action = React.useMemo(() => (course ? saveCourseAction.bind(null, course.id) : createCourseAction), [course]);
  const [state, formAction] = useActionState(action, idleAdminState);
  useSavedToast(state);
  const errors = state.errors ?? {};
  const [lifetime, setLifetime] = React.useState(c.lifetime_access);
  const [status, setStatus] = React.useState<Course["status"]>(c.status);
  const [illustration, setIllustration] = React.useState(c.illustration ?? "");

  return (
    <form action={formAction} noValidate className="space-y-6">
      <FormErrors state={state} />

      <AdminCard id="basics" title="Basics" description="What learners see in the catalogue and on the course page.">
        <FormStack>
          <FormRow>
            <FormField id="course-title" label="Title" error={errors.title} required>
              <Input name="title" defaultValue={c.title} maxLength={160} required />
            </FormField>
            <FormField id="course-slug" label="Slug" hint="Lowercase letters, numbers and dashes. Leave blank to derive it from the title." error={errors.slug}>
              <Input name="slug" defaultValue={c.slug} maxLength={80} spellCheck={false} placeholder="baby-steps" />
            </FormField>
          </FormRow>
          <FormField id="course-subtitle" label="Subtitle" error={errors.subtitle}>
            <Input name="subtitle" defaultValue={c.subtitle} maxLength={300} />
          </FormField>
          <FormField id="course-short" label="Short description" hint="One or two sentences for the catalogue card." error={errors.short_description}>
            <Textarea name="short_description" defaultValue={c.short_description} maxLength={400} className="min-h-20" />
          </FormField>
          <FormField id="course-description" label="Long description" hint="Markdown is fine. Shown on the course page." error={errors.description}>
            <Textarea name="description" defaultValue={c.description} maxLength={20000} className="min-h-40" />
          </FormField>
        </FormStack>
      </AdminCard>

      <AdminCard id="look" title="Illustration & tags" description="Line-art illustration, level, language and topics for filtering.">
        <FormStack>
          <fieldset>
            <legend className="text-sm font-semibold text-foreground">Illustration</legend>
            <p className="mt-1 text-xs text-muted-foreground">Used wherever there is no thumbnail.</p>
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
              {ILLUSTRATION_NAMES.map((name) => {
                const checked = illustration === name;
                return (
                  <label key={name} className={`flex cursor-pointer flex-col items-center gap-1 rounded-lg border p-2 text-[11px] capitalize transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${checked ? "border-rose bg-rose-soft/50 text-rose-strong" : "border-border bg-card text-muted-foreground hover:border-rose/40"}`}>
                    <input type="radio" name="illustration" value={name} checked={checked} onChange={() => setIllustration(name)} className="sr-only" />
                    <Illustration name={name} size={36} className={checked ? "text-rose-strong" : "text-foreground/70"} />
                    {name}
                  </label>
                );
              })}
            </div>
            {errors.illustration ? (
              <p role="alert" className="mt-2 text-xs font-medium text-danger">
                {errors.illustration}
              </p>
            ) : null}
          </fieldset>
          <FormRow>
            <FormField id="course-level" label="Level" error={errors.level}>
              <NativeSelect name="level" defaultValue={c.level}>
                {site.levels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
            <FormField id="course-language" label="Language" error={errors.language}>
              <Input name="language" defaultValue={c.language} maxLength={40} />
            </FormField>
          </FormRow>
          <fieldset>
            <legend className="text-sm font-semibold text-foreground">Topics</legend>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
              {site.topics.map((t) => (
                <div key={t.key} className="flex items-center gap-2">
                  <Checkbox id={`topic-${t.key}`} name="topics[]" value={t.key} defaultChecked={c.topics.includes(t.key)} />
                  <Label htmlFor={`topic-${t.key}`} className="font-normal">
                    {t.label}
                  </Label>
                </div>
              ))}
            </div>
          </fieldset>
          <FormRow>
            <FormField id="course-badge" label="Badge" error={errors.badge}>
              <NativeSelect name="badge" defaultValue={c.badge ?? ""}>
                <option value="">None</option>
                <option value="new">New</option>
                <option value="bestseller">Bestseller</option>
              </NativeSelect>
            </FormField>
            <FormField id="course-weeks" label="Duration (weeks)" error={errors.duration_weeks}>
              <Input name="duration_weeks" type="number" min={0} max={520} defaultValue={c.duration_weeks ?? ""} inputMode="numeric" />
            </FormField>
          </FormRow>
        </FormStack>
      </AdminCard>

      <AdminCard id="access" title="Access & features" description="Partner seat, certificate and how long learners keep access.">
        <FormStack>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-lg border border-border p-3">
              <Checkbox id="course-partner" name="partner_seat_enabled" defaultChecked={c.partner_seat_enabled} className="mt-0.5" />
              <Label htmlFor="course-partner" className="flex-col items-start gap-0.5 font-normal">
                <span className="font-semibold">Partner seat</span>
                <span className="text-xs text-muted-foreground">Each enrolment can invite one partner.</span>
              </Label>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-3">
              <Checkbox id="course-cert" name="certificate_enabled" defaultChecked={c.certificate_enabled} className="mt-0.5" />
              <Label htmlFor="course-cert" className="flex-col items-start gap-0.5 font-normal">
                <span className="font-semibold">Certificate</span>
                <span className="text-xs text-muted-foreground">Issued when required modules are complete.</span>
              </Label>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-3">
              <Checkbox id="course-lifetime" name="lifetime_access" checked={lifetime} onCheckedChange={(v) => setLifetime(v === true)} className="mt-0.5" />
              <Label htmlFor="course-lifetime" className="flex-col items-start gap-0.5 font-normal">
                <span className="font-semibold">Lifetime access</span>
                <span className="text-xs text-muted-foreground">Otherwise access expires after a set number of days.</span>
              </Label>
            </div>
          </div>
          {!lifetime ? (
            <FormField id="course-days" label="Access days" hint="Counted from the day a learner enrols." error={errors.access_days} required>
              <Input name="access_days" type="number" min={1} max={100000} defaultValue={c.access_days ?? 365} inputMode="numeric" className="max-w-xs" />
            </FormField>
          ) : null}
        </FormStack>
      </AdminCard>

      <AdminCard id="copy" title="Course page copy" description="One item per line.">
        <FormStack>
          <FormField id="course-learn" label="What you’ll learn" error={errors.what_you_learn}>
            <Textarea name="what_you_learn" defaultValue={c.what_you_learn.join("\n")} className="min-h-32" />
          </FormField>
          <FormField id="course-req" label="Requirements" error={errors.requirements}>
            <Textarea name="requirements" defaultValue={c.requirements.join("\n")} className="min-h-24" />
          </FormField>
          <FormField id="course-who" label="Who it’s for" error={errors.who_for}>
            <Textarea name="who_for" defaultValue={c.who_for.join("\n")} className="min-h-24" />
          </FormField>
        </FormStack>
      </AdminCard>

      <AdminCard id="faq" title="FAQ" description="Questions and answers shown on the course page.">
        <FaqEditor initial={c.faq} />
      </AdminCard>

      <AdminCard id="publishing" title="Publishing" description="Drafts are hidden from the catalogue. Scheduled courses go live at the chosen time.">
        <FormRow>
          <FormField id="course-status" label="Status" error={errors.status} required>
            <NativeSelect name="status" value={status} onChange={(e) => setStatus(e.target.value as Course["status"])}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </NativeSelect>
          </FormField>
          {status === "scheduled" ? (
            <FormField id="course-publish-at" label="Publish at" error={errors.publish_at} required>
              <Input name="publish_at" type="datetime-local" defaultValue={toLocalDateTime(c.publish_at)} />
            </FormField>
          ) : null}
        </FormRow>
      </AdminCard>

      <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-3 border-t border-border bg-cream/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {course ? null : <p className="mr-auto text-sm text-muted-foreground">You can add a thumbnail, modules and lessons after creating the course.</p>}
        <SaveButton>{course ? "Save changes" : "Create course"}</SaveButton>
      </div>
    </form>
  );
}

export { CourseForm };
