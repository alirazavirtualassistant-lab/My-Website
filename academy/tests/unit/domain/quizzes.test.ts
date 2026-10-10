import { describe, expect, it } from "vitest";
import type { QuizQuestion } from "@/lib/types";
import {
  bandFor,
  isAnswered,
  isQuestionRequired,
  isYes,
  maxQuizScore,
  questionMaxPoints,
  questionPoints,
  scoreQuiz,
} from "@/lib/domain/quizzes";
import { WELLNESS_SECTIONS, makeSensitivityQuiz, makeSurvey, makeWellnessQuiz } from "./fixtures";

const scale: QuizQuestion = { key: "s", type: "scale", text: "", min: 0, max: 3, labels: [] };
const yesno: QuizQuestion = { key: "y", type: "yesno", text: "", yes_value: 3 };
const choice: QuizQuestion = { key: "c", type: "choice", text: "", options: ["a", "b"], required: true };
const short: QuizQuestion = { key: "t", type: "short", text: "", required: true };
const paragraph: QuizQuestion = { key: "p", type: "paragraph", text: "", required: false };

describe("answer helpers", () => {
  it("isYes accepts the usual spellings", () => {
    for (const v of [true, 1, "yes", "Yes", " Y ", "true", "1"]) expect(isYes(v)).toBe(true);
    for (const v of [false, 0, "no", "", null, undefined, "maybe", 3]) expect(isYes(v)).toBe(false);
  });

  it("isAnswered understands each type", () => {
    expect(isAnswered(scale, 2)).toBe(true);
    expect(isAnswered(scale, "2")).toBe(true);
    expect(isAnswered(scale, "")).toBe(false);
    expect(isAnswered(scale, "two")).toBe(false);
    expect(isAnswered(scale, null)).toBe(false);
    expect(isAnswered(yesno, "No")).toBe(true);
    expect(isAnswered(yesno, "yes")).toBe(true);
    expect(isAnswered(yesno, 0)).toBe(true);
    expect(isAnswered(yesno, "dunno")).toBe(false);
    expect(isAnswered(choice, "a")).toBe(true);
    expect(isAnswered(choice, "zzz")).toBe(false);
    expect(isAnswered(choice, "")).toBe(false);
    expect(isAnswered({ ...choice, options: [] }, "anything")).toBe(true);
    expect(isAnswered(short, "  ")).toBe(false);
    expect(isAnswered(short, "ok")).toBe(true);
    expect(isAnswered(paragraph, 5)).toBe(true);
  });

  it("isQuestionRequired treats scored types as required when the quiz is summed", () => {
    expect(isQuestionRequired(scale)).toBe(true);
    expect(isQuestionRequired(yesno, "sum")).toBe(true);
    expect(isQuestionRequired(scale, "none")).toBe(false);
    expect(isQuestionRequired(choice, "none")).toBe(true);
    expect(isQuestionRequired(paragraph)).toBe(false);
  });

  it("questionPoints clamps scales, applies yes = 3 and ignores text", () => {
    expect(questionPoints(scale, 2)).toBe(2);
    expect(questionPoints(scale, "3")).toBe(3);
    expect(questionPoints(scale, 9)).toBe(3);
    expect(questionPoints(scale, -4)).toBe(0);
    expect(questionPoints(scale, null)).toBe(0);
    expect(questionPoints(yesno, "yes")).toBe(3);
    expect(questionPoints(yesno, "no")).toBe(0);
    expect(questionPoints(yesno, null)).toBe(0);
    expect(questionPoints(choice, "a")).toBe(0);
    expect(questionPoints(short, "3")).toBe(0);
  });

  it("knows each question's maximum", () => {
    expect(questionMaxPoints(scale)).toBe(3);
    expect(questionMaxPoints(yesno)).toBe(3);
    expect(questionMaxPoints(choice)).toBe(0);
    expect(maxQuizScore(makeSensitivityQuiz())).toBe(36);
    expect(maxQuizScore(makeWellnessQuiz())).toBe(100);
    expect(maxQuizScore(makeSurvey())).toBeNull();
  });

  it("bandFor uses inclusive ranges", () => {
    const bands = makeSensitivityQuiz().scoring.bands!;
    expect(bandFor(bands, 0)?.label).toBe("low likelihood of a food driver");
    expect(bandFor(bands, 8)?.label).toBe("low likelihood of a food driver");
    expect(bandFor(bands, 9)?.label).toBe("keep the diary");
    expect(bandFor(bands, 18)?.label).toBe("keep the diary");
    expect(bandFor(bands, 19)?.label).toBe("see your doctor");
    expect(bandFor(bands, 36)?.label).toBe("see your doctor");
    expect(bandFor(bands, 37)).toBeNull();
    expect(bandFor(bands, null)).toBeNull();
    expect(bandFor(undefined, 5)).toBeNull();
  });
});

describe("scoreQuiz — Sensitivity Quiz (sum, top-level bands, yes = 3)", () => {
  const quiz = makeSensitivityQuiz();
  const allScales = (value: number) => Object.fromEntries(["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q12"].map((k) => [k, value]));

  it("sums the scales and adds 3 for a yes on the family-history item", () => {
    const no = scoreQuiz(quiz, { ...allScales(1), q11: "no", suspect_food: "dairy" });
    expect(no.score).toBe(11);
    expect(no.band?.label).toBe("keep the diary");
    expect(no.missing_required).toEqual([]);
    expect(no.max_score).toBe(36);

    const yes = scoreQuiz(quiz, { ...allScales(1), q11: "yes", suspect_food: "dairy" });
    expect(yes.score).toBe(14);
    expect(yes.section_scores).toEqual({ symptoms: 14 });
    expect(yes.section_bands).toEqual({});
  });

  it("picks the band at the boundaries", () => {
    expect(scoreQuiz(quiz, { ...allScales(0), q11: "no" }).band?.label).toBe("low likelihood of a food driver");
    expect(scoreQuiz(quiz, { ...allScales(0), q8: 3, q9: 3, q10: 2, q11: "no" }).score).toBe(8);
    expect(scoreQuiz(quiz, { ...allScales(0), q8: 3, q9: 3, q10: 2, q11: "no" }).band?.label).toBe("low likelihood of a food driver");
    expect(scoreQuiz(quiz, { ...allScales(0), q8: 3, q9: 3, q10: 2, q11: "yes" }).score).toBe(11);
    expect(scoreQuiz(quiz, { ...allScales(0), q8: 3, q9: 3, q10: 3, q11: "no" }).band?.label).toBe("keep the diary");
    const max = scoreQuiz(quiz, { ...allScales(3), q11: true });
    expect(max.score).toBe(36);
    expect(max.band?.label).toBe("see your doctor");
  });

  it("lists unanswered scored questions as missing, but not the optional choice", () => {
    const partial = scoreQuiz(quiz, { q1: 2, q11: "yes" });
    expect(partial.missing_required).toEqual(["q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q12"]);
    expect(partial.score).toBe(5);
    expect(partial.missing_required).not.toContain("suspect_food");
    expect(scoreQuiz(quiz, { ...allScales(1) }).missing_required).toEqual(["q11"]);
  });

  it("accepts numeric strings, clamps out-of-range values and ignores unknown keys", () => {
    const r = scoreQuiz(quiz, { ...allScales(0), q1: "3", q2: 99, q3: -1, q11: "No", bogus: 42 });
    expect(r.score).toBe(6);
    expect(r.missing_required).toEqual([]);
  });
});

describe("scoreQuiz — Family Wellness Quiz (sections)", () => {
  const quiz = makeWellnessQuiz();
  const answersWith = (perSection: Record<(typeof WELLNESS_SECTIONS)[number], number>) => {
    const answers: Record<string, number> = {};
    let n = 0;
    for (const section of WELLNESS_SECTIONS) for (let i = 0; i < 5; i++) answers[`q${++n}`] = perSection[section];
    return answers;
  };

  it("scores each section and assigns section bands", () => {
    const r = scoreQuiz(quiz, { ...answersWith({ nutrition: 1, movement: 2, stress: 3, toxins: 4, connection: 2 }), strongest: "toxins" });
    expect(r.score).toBe(5 + 10 + 15 + 20 + 10);
    expect(r.section_scores).toEqual({ nutrition: 5, movement: 10, stress: 15, toxins: 20, connection: 10 });
    expect(Object.fromEntries(Object.entries(r.section_bands).map(([k, b]) => [k, b?.label ?? null]))).toEqual({
      nutrition: "seedling",
      movement: "growing",
      stress: "rooted",
      toxins: "rooted",
      connection: "growing",
    });
    expect(r.band).toBeNull(); // no top-level bands on this quiz
    expect(r.missing_required).toEqual([]);
    expect(r.max_score).toBe(100);
  });

  it("marks sections without answers as missing and bands them null", () => {
    const r = scoreQuiz(quiz, { q1: 4, q2: 4, q3: 4, q4: 4, q5: 4 });
    expect(r.section_scores).toEqual({ nutrition: 20 });
    expect(r.section_bands.nutrition?.label).toBe("rooted");
    expect(r.section_bands.movement).toBeNull();
    expect(r.missing_required).toHaveLength(20);
    expect(r.missing_required[0]).toBe("q6");
  });

  it("does not require the optional short answers", () => {
    const r = scoreQuiz(quiz, answersWith({ nutrition: 2, movement: 2, stress: 2, toxins: 2, connection: 2 }));
    expect(r.missing_required).toEqual([]);
    expect(r.score).toBe(50);
  });
});

describe("scoreQuiz — Pre-Course Survey (unscored)", () => {
  const survey = makeSurvey();

  it("returns null scores and bands, and checks required answers", () => {
    const full = scoreQuiz(survey, { a: "why", b: "partner", c: "goals", d: "do", e: "", f: "Yes, together" });
    expect(full).toEqual({ score: null, section_scores: null, max_score: null, band: null, section_bands: {}, missing_required: [] });
  });

  it("lists missing required paragraphs and an off-list choice", () => {
    const partial = scoreQuiz(survey, { a: "why", b: "   ", f: "Something else" });
    expect(partial.missing_required).toEqual(["b", "c", "d", "f"]);
    expect(partial.score).toBeNull();
  });

  it("never requires scale questions in an unscored survey", () => {
    const def = { ...survey, questions: [...survey.questions, { key: "mood", type: "scale" as const, text: "", min: 1, max: 5, labels: [] }] };
    expect(scoreQuiz(def, { a: "1", b: "2", c: "3", d: "4", f: "Other" }).missing_required).toEqual([]);
  });
});
