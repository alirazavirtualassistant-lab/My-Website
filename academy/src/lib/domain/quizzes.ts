/**
 * Quiz scoring — pure functions over a QuizDefinition and submitted answers.
 *
 * Rules (from the course forms):
 * - `scale` answers add their numeric value (clamped to min..max);
 * - `yesno` answers add `yes_value` for a yes (the Sensitivity Quiz's
 *   family-history item is "yes = 3") and 0 for a no;
 * - `choice`, `short` and `paragraph` answers never score;
 * - `scale` and `yesno` questions are always required when the quiz is
 *   summed; the others use their `required` flag;
 * - `scoring.kind === "none"` surveys return null scores and bands.
 */
import type { QuizDefinition, QuizQuestion, QuizResponse } from "@/lib/types";

export type QuizAnswers = QuizResponse["answers"];
export type QuizAnswer = QuizAnswers[string] | undefined;
export type QuizBand = { min: number; max: number; label: string; text: string };

export interface QuizScore {
  /** null when the quiz is not scored */
  score: number | null;
  /** per `question.section`, null when not scored or no question has a section */
  section_scores: Record<string, number> | null;
  /** highest possible score, null when not scored */
  max_score: number | null;
  band: QuizBand | null;
  /** keyed by `scoring.sections[].key` */
  section_bands: Record<string, QuizBand | null>;
  /** keys of required questions without an answer */
  missing_required: string[];
}

const YES = new Set(["yes", "y", "true", "1"]);
const NO = new Set(["no", "n", "false", "0"]);

export function isYes(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (typeof value === "string") return YES.has(value.trim().toLowerCase());
  return false;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Whether a question has a usable answer. */
export function isAnswered(question: QuizQuestion, answer: QuizAnswer): boolean {
  if (answer === null || answer === undefined) return false;
  switch (question.type) {
    case "scale":
      return toNumber(answer) !== null;
    case "yesno": {
      if (typeof answer === "boolean" || typeof answer === "number") return true;
      const s = String(answer).trim().toLowerCase();
      return YES.has(s) || NO.has(s);
    }
    case "choice":
      return typeof answer === "string" && answer.trim() !== "" && (question.options.length === 0 || question.options.includes(answer));
    case "short":
    case "paragraph":
      return String(answer).trim() !== "";
  }
}

export function isQuestionRequired(question: QuizQuestion, scoringKind: QuizDefinition["scoring"]["kind"] = "sum"): boolean {
  switch (question.type) {
    case "scale":
    case "yesno":
      return scoringKind === "sum";
    default:
      return question.required;
  }
}

/** The points an answer contributes (0 for unscored types or no answer). */
export function questionPoints(question: QuizQuestion, answer: QuizAnswer): number {
  if (!isAnswered(question, answer)) return 0;
  switch (question.type) {
    case "scale": {
      const n = toNumber(answer) as number;
      return Math.min(question.max, Math.max(question.min, n));
    }
    case "yesno":
      return isYes(answer) ? question.yes_value : 0;
    default:
      return 0;
  }
}

export function questionMaxPoints(question: QuizQuestion): number {
  switch (question.type) {
    case "scale":
      return question.max;
    case "yesno":
      return Math.max(0, question.yes_value);
    default:
      return 0;
  }
}

/** Highest possible total for a summed quiz (null for unscored surveys). */
export function maxQuizScore(definition: Pick<QuizDefinition, "questions" | "scoring">): number | null {
  if (definition.scoring.kind !== "sum") return null;
  return definition.questions.reduce((n, q) => n + questionMaxPoints(q), 0);
}

/** First band whose inclusive range contains `score`, or null. */
export function bandFor(bands: ReadonlyArray<QuizBand> | undefined, score: number | null): QuizBand | null {
  if (score === null || !bands) return null;
  return bands.find((b) => score >= b.min && score <= b.max) ?? null;
}

export function scoreQuiz(definition: Pick<QuizDefinition, "questions" | "scoring">, answers: QuizAnswers): QuizScore {
  const scored = definition.scoring.kind === "sum";
  const missing_required: string[] = [];
  let score = 0;
  const sections: Record<string, number> = {};
  let hasSection = false;

  for (const question of definition.questions) {
    const answer = answers[question.key];
    if (isQuestionRequired(question, definition.scoring.kind) && !isAnswered(question, answer)) missing_required.push(question.key);
    if (!scored) continue;
    const points = questionPoints(question, answer);
    if (question.type === "scale" || question.type === "yesno") {
      score += points;
      if (question.section) {
        hasSection = true;
        sections[question.section] = (sections[question.section] ?? 0) + points;
      }
    }
  }

  const section_scores = scored && hasSection ? sections : null;
  const section_bands: Record<string, QuizBand | null> = {};
  for (const section of definition.scoring.sections ?? []) {
    section_bands[section.key] = bandFor(section.bands, section_scores?.[section.key] ?? null);
  }

  return {
    score: scored ? score : null,
    section_scores,
    max_score: maxQuizScore(definition),
    band: scored ? bandFor(definition.scoring.bands, score) : null,
    section_bands,
    missing_required,
  };
}
