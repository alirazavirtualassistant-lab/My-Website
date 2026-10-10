"use client";

/**
 * Native, keyboard-friendly form for the in-app quizzes and surveys
 * (wellness-quiz, gut-health-quiz, sensitivity-quiz, pre-course-survey).
 * Questions render by type; the result shows score, bands and section bands
 * verbatim, with a "Mark the step complete" button for the linked action step.
 */
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CircleCheck, RotateCcw } from "lucide-react";
import type { QuizDefinition, QuizQuestion } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { isQuestionRequired } from "@/lib/domain/quizzes";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { completeActionStepAction, submitQuizAction } from "@/app/(learner)/learn/[course]/[lesson]/actions";
import { toastCompletion } from "./mark-complete";
import type { QuizResultView } from "./types";

export type QuizDefinitionView = Pick<QuizDefinition, "key" | "title" | "intro" | "questions" | "scoring" | "confirmation">;

export interface QuizFormProps {
  quiz: QuizDefinitionView;
  lessonId: string;
  lessonHref: string;
  /** The action step (or sub item) that "Mark the step complete" completes. */
  step: { id: string; label: string; subItemKey: string | null; completed: boolean } | null;
  previous: QuizResultView | null;
  className?: string;
}

type Answers = Record<string, string | number | null>;

function sectionLabel(quiz: QuizDefinitionView, key: string): string {
  const s = quiz.scoring.sections?.find((x) => x.key === key);
  if (s) return s.label;
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/[-_]/g, " ");
}

function QuizForm({ quiz, lessonId, lessonHref, step, previous, className }: QuizFormProps) {
  const router = useRouter();
  const [answers, setAnswers] = React.useState<Answers>({});
  const [errors, setErrors] = React.useState<Set<string>>(new Set());
  const [result, setResult] = React.useState<QuizResultView | null>(null);
  const [showForm, setShowForm] = React.useState(!previous);
  const [pending, startTransition] = React.useTransition();
  const [stepDone, setStepDone] = React.useState(step?.completed ?? false);
  const [completing, startComplete] = React.useTransition();
  const errorRef = React.useRef<HTMLParagraphElement | null>(null);

  const set = (key: string, value: string | number | null) => setAnswers((a) => ({ ...a, [key]: value }));

  // Questions with a section heading wherever the section changes.
  const rows = React.useMemo(() => {
    const out: Array<{ q: QuizQuestion; heading: string | null }> = [];
    let current: string | undefined;
    for (const q of quiz.questions) {
      const heading = q.section && q.section !== current ? sectionLabel(quiz, q.section) : null;
      if (q.section) current = q.section;
      out.push({ q, heading });
    }
    return out;
  }, [quiz]);

  function validate(): string[] {
    const missing: string[] = [];
    for (const q of quiz.questions) {
      if (!isQuestionRequired(q, quiz.scoring.kind)) continue;
      const v = answers[q.key];
      if (v === null || v === undefined || String(v).trim() === "") missing.push(q.key);
    }
    return missing;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const missing = validate();
    if (missing.length) {
      setErrors(new Set(missing));
      requestAnimationFrame(() => {
        errorRef.current?.focus();
        document.getElementById(`q-${missing[0]}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
      return;
    }
    setErrors(new Set());
    startTransition(async () => {
      const res = await submitQuizAction({ quizKey: quiz.key, lessonId, answers });
      if (!res.ok) {
        if (res.missing?.length) setErrors(new Set(res.missing));
        toast.error(res.error ?? "We couldn't save your answers just now.");
        return;
      }
      setResult(res);
      setShowForm(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function completeStep() {
    if (!step) return;
    startComplete(async () => {
      const res = await completeActionStepAction({ stepId: step.id, subItemKey: step.subItemKey });
      if (!res.ok) {
        toast.error(res.error ?? "We couldn't save that step just now.");
        return;
      }
      setStepDone(true);
      toastCompletion(res, { title: res.stepCompleted ? "Step complete" : "Saved", router });
    });
  }

  const shown = result ?? previous;
  if (!showForm && shown) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <QuizResultCard quiz={quiz} result={shown} isFresh={!!result} />
        <div className="flex flex-wrap items-center gap-3">
          {step ? (
            stepDone ? (
              <span className="inline-flex h-10 items-center gap-2 rounded-lg bg-sage-soft px-4 text-sm font-semibold text-sage-strong">
                <CircleCheck className="size-4" aria-hidden="true" />
                Step complete
              </span>
            ) : (
              <Button onClick={completeStep} loading={completing}>
                <CircleCheck aria-hidden="true" />
                Mark the step complete
              </Button>
            )
          ) : null}
          <Button asChild variant="outline">
            <Link href={lessonHref}>
              <ArrowLeft aria-hidden="true" />
              Back to the lesson
            </Link>
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setAnswers({});
              setResult(null);
              setShowForm(true);
            }}
          >
            <RotateCcw aria-hidden="true" />
            Take it again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={cn("flex flex-col gap-8", className)} aria-describedby={errors.size ? "quiz-errors" : undefined}>
      {errors.size ? (
        <p id="quiz-errors" ref={errorRef} tabIndex={-1} role="alert" className="rounded-lg border border-danger/40 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          Please answer the {errors.size === 1 ? "highlighted question" : `${errors.size} highlighted questions`} to continue.
        </p>
      ) : null}
      {rows.map(({ q, heading }, i) => {
        const invalid = errors.has(q.key);
        return (
          <React.Fragment key={q.key}>
            {heading ? (
              <h2 className="font-serif text-2xl text-rose-strong -mb-4">
                {heading}
              </h2>
            ) : null}
            <Question q={q} index={i} value={answers[q.key] ?? null} onChange={(v) => set(q.key, v)} invalid={invalid} required={isQuestionRequired(q, quiz.scoring.kind)} />
          </React.Fragment>
        );
      })}
      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Button type="submit" loading={pending} size="lg">
          {quiz.scoring.kind === "sum" ? "See my result" : "Save my answers"}
        </Button>
        <Button asChild variant="ghost">
          <Link href={lessonHref}>Back to the lesson</Link>
        </Button>
        {previous ? (
          <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
            View my last result
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function Question({ q, index, value, onChange, invalid, required }: { q: QuizQuestion; index: number; value: string | number | null; onChange: (v: string | number | null) => void; invalid: boolean; required: boolean }) {
  const id = `q-${q.key}`;
  const legend = (
    <span className="block text-base leading-snug font-semibold text-foreground">
      <span className="mr-2 font-serif text-lg text-muted-foreground">{index + 1}.</span>
      {q.text}
      {required ? (
        <span aria-hidden="true" className="ml-1 text-rose-strong">
          *
        </span>
      ) : null}
    </span>
  );
  const errorText = invalid ? (
    <p id={`${id}-error`} role="alert" className="text-xs font-medium text-danger">
      This one needs an answer.
    </p>
  ) : null;
  const wrap = cn("grid gap-3 rounded-lg border p-4", invalid ? "border-danger/50 bg-danger-soft/30" : "border-border bg-card");

  if (q.type === "scale") {
    const options: number[] = [];
    for (let v = q.min; v <= q.max; v++) options.push(v);
    return (
      <fieldset id={id} className={wrap} aria-describedby={invalid ? `${id}-error` : undefined} aria-invalid={invalid || undefined}>
        <legend className="px-1">{legend}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {options.map((v, i) => {
            const optId = `${id}-${v}`;
            const label = q.labels[i] ?? String(v);
            return (
              <div key={v} className="flex items-center gap-2">
                <input type="radio" id={optId} name={q.key} value={v} checked={value === v} onChange={() => onChange(v)} required={required} className="size-4 accent-[var(--rose)]" />
                <Label htmlFor={optId} className="text-sm font-normal">
                  {label}
                </Label>
              </div>
            );
          })}
        </div>
        {errorText}
      </fieldset>
    );
  }
  if (q.type === "yesno") {
    return (
      <fieldset id={id} className={wrap} aria-describedby={invalid ? `${id}-error` : undefined} aria-invalid={invalid || undefined}>
        <legend className="px-1">{legend}</legend>
        <div className="flex gap-6">
          {(["yes", "no"] as const).map((v) => (
            <div key={v} className="flex items-center gap-2">
              <input type="radio" id={`${id}-${v}`} name={q.key} value={v} checked={value === v} onChange={() => onChange(v)} required={required} className="size-4 accent-[var(--rose)]" />
              <Label htmlFor={`${id}-${v}`} className="text-sm font-normal capitalize">
                {v}
              </Label>
            </div>
          ))}
        </div>
        {errorText}
      </fieldset>
    );
  }
  if (q.type === "choice") {
    return (
      <fieldset id={id} className={wrap} aria-describedby={invalid ? `${id}-error` : undefined} aria-invalid={invalid || undefined}>
        <legend className="px-1">{legend}</legend>
        <div className="grid gap-2">
          {q.options.map((opt, i) => {
            const optId = `${id}-${i}`;
            return (
              <div key={opt} className="flex items-start gap-2">
                <input type="radio" id={optId} name={q.key} value={opt} checked={value === opt} onChange={() => onChange(opt)} required={required} className="mt-1 size-4 accent-[var(--rose)]" />
                <Label htmlFor={optId} className="text-sm leading-snug font-normal">
                  {opt}
                </Label>
              </div>
            );
          })}
        </div>
        {errorText}
      </fieldset>
    );
  }
  if (q.type === "paragraph") {
    return (
      <div id={id} className={wrap}>
        <Label htmlFor={`${id}-input`}>{legend}</Label>
        <Textarea id={`${id}-input`} name={q.key} rows={4} value={value === null ? "" : String(value)} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-error` : undefined} required={required} maxLength={5000} />
        {errorText}
      </div>
    );
  }
  return (
    <div id={id} className={wrap}>
      <Label htmlFor={`${id}-input`}>{legend}</Label>
      <Input id={`${id}-input`} name={q.key} value={value === null ? "" : String(value)} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-error` : undefined} required={required} maxLength={500} />
      {errorText}
    </div>
  );
}

function QuizResultCard({ quiz, result, isFresh }: { quiz: QuizDefinitionView; result: QuizResultView; isFresh: boolean }) {
  return (
    <section aria-labelledby="quiz-result-title" className="card-soft flex flex-col gap-4 p-6">
      <p className="eyebrow">{isFresh ? "Your result" : `Your last result · ${formatDate(result.submittedAt)}`}</p>
      <h2 id="quiz-result-title" className="font-serif text-3xl">
        {quiz.title}
      </h2>
      {result.score !== null ? (
        <p className="text-lg">
          <span className="font-serif text-4xl text-rose-strong">{result.score}</span>
          {result.maxScore !== null ? <span className="text-muted-foreground"> / {result.maxScore}</span> : null}
          {result.band ? (
            <span className="ml-3 inline-flex rounded-full bg-gold-soft px-3 py-1 text-sm font-semibold text-warning">{result.band.label}</span>
          ) : null}
        </p>
      ) : null}
      {result.band?.text ? <p className="text-base text-foreground/90">{result.band.text}</p> : null}
      {result.sections.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {result.sections.map((s) => (
            <li key={s.key} className="rounded-lg border border-border bg-cream-2/50 p-4">
              <p className="flex items-center justify-between text-sm font-semibold">
                {s.label}
                <span className="font-serif text-xl text-rose-strong">{s.score}</span>
              </p>
              {s.band ? (
                <>
                  <p className="mt-1 text-xs font-bold tracking-wider text-sage-strong uppercase">{s.band.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.band.text}</p>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      {result.confirmation ? <p className="rounded-lg bg-sage-soft/60 p-4 text-sm leading-relaxed text-foreground/90">{result.confirmation}</p> : null}
    </section>
  );
}

export { QuizForm, QuizResultCard };
