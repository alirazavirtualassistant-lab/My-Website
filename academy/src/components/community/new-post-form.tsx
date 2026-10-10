"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { BookOpen, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormField, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormErrorSummary } from "@/components/auth/form-error-summary";
import { SubmitButton } from "@/components/auth/submit-button";
import { createPostAction } from "@/app/(learner)/community/[course]/actions";
import { AnonymousSwitch } from "./anonymous-switch";
import { idleFormState, type LessonChipView } from "./types";

export interface NewPostFormProps {
  courseId: string;
  categories: Array<{ id: string; title: string }>;
  defaultCategoryId: string | null;
  lesson: LessonChipView | null;
  defaultAnonymous?: boolean;
  cancelHref: string;
  className?: string;
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const IMAGE_MAX_BYTES = 10 * 1024 * 1024;

const selectClass =
  "flex h-10 w-full min-w-0 rounded-lg border border-input bg-card px-3 py-2 text-base text-foreground shadow-xs outline-none transition-[color,box-shadow,border-color] focus-visible:border-rose focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-danger md:text-sm";

/**
 * New post: title, body, category, optional lesson tag (from ?lesson=),
 * "post anonymously" switch and an optional image. Server validation drives
 * the inline errors; the image gets a quick client-side check for friendliness.
 */
function NewPostForm({ courseId, categories, defaultCategoryId, lesson, defaultAnonymous = false, cancelHref, className }: NewPostFormProps) {
  const [state, action] = useActionState(createPostAction, idleFormState);
  const errors = state.errors ?? {};
  const [lessonTag, setLessonTag] = React.useState<LessonChipView | null>(lesson);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName(null);
    setFileError(null);
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setFileError("Please choose a JPG, PNG, WebP or GIF image.");
      e.target.value = "";
      return;
    }
    if (file.size > IMAGE_MAX_BYTES) {
      setFileError("That image is over 10 MB. A smaller one will look just as lovely.");
      e.target.value = "";
      return;
    }
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  }

  function clearFile() {
    if (fileRef.current) fileRef.current.value = "";
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName(null);
    setFileError(null);
  }

  const imageError = errors.image ?? fileError ?? undefined;

  return (
    <form action={action} noValidate encType="multipart/form-data" className={cn("grid gap-6", className)}>
      <FormErrorSummary summary={state.summary} />
      <input type="hidden" name="courseId" value={courseId} />
      {lessonTag ? <input type="hidden" name="lessonId" value={lessonTag.id} /> : null}

      <FormStack>
        <FormField id="np-title" label="Title" required error={errors.title} hint="A few words that say what this is about.">
          <Input name="title" maxLength={160} placeholder="For example: My first week of baby steps" autoComplete="off" />
        </FormField>

        <FormField id="np-category" label="Category" required error={errors.categoryId}>
          <select name="categoryId" defaultValue={defaultCategoryId ?? ""} className={selectClass}>
            <option value="" disabled>
              Choose a category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </FormField>

        {lessonTag ? (
          <div className="grid gap-1.5">
            <p className="text-sm font-semibold">Linked lesson</p>
            <div className="flex flex-wrap items-center gap-2">
              <Link href={lessonTag.href} className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-sage/50 bg-sage-soft/60 px-3 py-1 text-sm font-semibold text-sage-strong hover:bg-sage-soft">
                <BookOpen className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {lessonTag.code} · {lessonTag.title}
                </span>
              </Link>
              <Button type="button" variant="ghost" size="sm" onClick={() => setLessonTag(null)} aria-label={`Remove the link to lesson ${lessonTag.code}`}>
                <X aria-hidden="true" />
                Remove
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Your post will show a chip linking back to this lesson.</p>
            {errors.lessonId ? (
              <p role="alert" className="text-xs font-medium text-danger">
                {errors.lessonId}
              </p>
            ) : null}
          </div>
        ) : null}

        <FormField id="np-body" label="Your post" required error={errors.body} hint="Plain text, line breaks kept. Share what is true for you; a sentence is plenty.">
          <Textarea name="body" rows={8} maxLength={10_000} placeholder="This week was…" />
        </FormField>

        <div className="grid gap-1.5">
          <Label htmlFor="np-image" className="font-semibold">
            Add a photo
            <span className="ml-auto text-xs font-normal text-muted-foreground">Optional</span>
          </Label>
          <input
            ref={fileRef}
            id="np-image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onFileChange}
            aria-describedby={imageError ? "np-image-error" : "np-image-hint"}
            aria-invalid={imageError ? true : undefined}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:inline-flex file:h-9 file:cursor-pointer file:items-center file:rounded-lg file:border file:border-border file:bg-card file:px-3 file:text-sm file:font-semibold file:text-foreground hover:file:border-rose/60 hover:file:bg-rose-soft/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          />
          {imageError ? (
            <p id="np-image-error" role="alert" className="text-xs font-medium text-danger">
              {imageError}
            </p>
          ) : (
            <p id="np-image-hint" className="flex items-center gap-1 text-xs text-muted-foreground">
              <ImagePlus className="size-3.5" aria-hidden="true" />
              JPG, PNG, WebP or GIF, up to 10 MB. Visible to members of this course.
            </p>
          )}
          {preview ? (
            <div className="mt-1 flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview, not an optimisable asset */}
              <img src={preview} alt="" className="max-h-40 max-w-full rounded-lg border border-border object-cover" />
              <div className="grid gap-1">
                <p className="text-xs text-muted-foreground">{fileName}</p>
                <Button type="button" variant="ghost" size="sm" onClick={clearFile}>
                  <X aria-hidden="true" />
                  Remove photo
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <AnonymousSwitch defaultChecked={defaultAnonymous} />
      </FormStack>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button asChild variant="outline">
          <Link href={cancelHref}>Cancel</Link>
        </Button>
        <SubmitButton pendingLabel="Publishing your post">Publish post</SubmitButton>
      </div>
    </form>
  );
}

export { NewPostForm };
