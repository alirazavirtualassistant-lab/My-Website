import { describe, expect, it } from "vitest";
import { isStageDirection, parseTranscript, readingMinutes } from "@/components/marketing/transcript";

const SAMPLE = `M1T1: INTRODUCTION TO PRE-CONCEPTION HEALTH — 10 MIN

— 0:00–0:30  HOOK —

A woman I worked with once told me something.
It changed everything.

— 0:30–2:00  INTRO: WHO I AM AND WHY I CARE —

Let me tell you a little about me.

[PAUSE — let this land]

Second paragraph.`;

describe("parseTranscript", () => {
  it("keeps the title line and splits sections and paragraphs verbatim", () => {
    const t = parseTranscript(SAMPLE);
    expect(t.title).toBe("M1T1: INTRODUCTION TO PRE-CONCEPTION HEALTH — 10 MIN");
    expect(t.sections.map((s) => s.heading)).toEqual(["0:00–0:30  HOOK", "0:30–2:00  INTRO: WHO I AM AND WHY I CARE"]);
    expect(t.sections[0].paragraphs).toEqual(["A woman I worked with once told me something. It changed everything."]);
    expect(t.sections[1].paragraphs).toEqual(["Let me tell you a little about me.", "[PAUSE — let this land]", "Second paragraph."]);
  });
  it("handles text without markers", () => {
    const t = parseTranscript("Just one paragraph.\n\nAnd another.");
    expect(t.title).toBeNull();
    expect(t.sections).toEqual([{ heading: null, paragraphs: ["Just one paragraph.", "And another."] }]);
    expect(parseTranscript("")).toEqual({ title: null, sections: [] });
  });
  it("recognises stage directions and estimates reading time", () => {
    expect(isStageDirection("[PAUSE — let this land]")).toBe(true);
    expect(isStageDirection("Not a direction")).toBe(false);
    expect(readingMinutes("word ".repeat(360))).toBe(2);
    expect(readingMinutes("")).toBe(1);
  });
});
