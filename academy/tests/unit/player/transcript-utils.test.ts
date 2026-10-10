import { describe, expect, it } from "vitest";
import {
  PLAYBACK_SPEEDS,
  findMatches,
  formatBytes,
  formatClock,
  isCueLine,
  isTypingTarget,
  parseClock,
  parseSectionHeading,
  parseTranscript,
  positionLabel,
  readingMinutes,
  sectionAtTime,
  shortcutAction,
  splitMatches,
  stepSpeed,
} from "@/components/player/transcript-utils";

const SAMPLE = `M1T1: INTRODUCTION TO PRE-CONCEPTION HEALTH — 10 MIN

— 0:00–0:30  HOOK —

A woman I worked with once told me something.
It changed everything.

— 0:30–2:00  WHY THIS MATTERS —

Let me tell you a little about me.

[PAUSE — let this land]

[VISUAL: show the five pillars]

Second paragraph here.

— 9:30–10:00  ACTION HANDOFF —

Go do the thing.`;

describe("parseTranscript", () => {
  it("keeps the title line and splits sections verbatim", () => {
    const t = parseTranscript(SAMPLE);
    expect(t.title).toBe("M1T1: INTRODUCTION TO PRE-CONCEPTION HEALTH — 10 MIN");
    expect(t.sections.map((s) => s.heading)).toEqual(["0:00–0:30  HOOK", "0:30–2:00  WHY THIS MATTERS", "9:30–10:00  ACTION HANDOFF"]);
    expect(t.sections.map((s) => s.label)).toEqual(["HOOK", "WHY THIS MATTERS", "ACTION HANDOFF"]);
    expect(t.sections.map((s) => s.id)).toEqual(["section-0", "section-1", "section-2"]);
  });

  it("parses timecodes into seconds", () => {
    const t = parseTranscript(SAMPLE);
    expect(t.sections[0].time).toEqual({ start: "0:00", end: "0:30", startSec: 0, endSec: 30 });
    expect(t.sections[1].time).toEqual({ start: "0:30", end: "2:00", startSec: 30, endSec: 120 });
    expect(t.sections[2].time?.startSec).toBe(570);
  });

  it("joins wrapped lines into paragraphs and keeps cue lines separate", () => {
    const t = parseTranscript(SAMPLE);
    expect(t.sections[0].blocks).toEqual([{ kind: "paragraph", text: "A woman I worked with once told me something. It changed everything." }]);
    expect(t.sections[1].blocks).toEqual([
      { kind: "paragraph", text: "Let me tell you a little about me." },
      { kind: "cue", text: "[PAUSE — let this land]" },
      { kind: "cue", text: "[VISUAL: show the five pillars]" },
      { kind: "paragraph", text: "Second paragraph here." },
    ]);
  });

  it("handles text without any markers, and empty text", () => {
    const t = parseTranscript("Just one paragraph.\n\nAnd another.");
    expect(t.title).toBeNull();
    expect(t.sections).toHaveLength(1);
    expect(t.sections[0].heading).toBeNull();
    expect(t.sections[0].blocks.map((b) => b.text)).toEqual(["Just one paragraph.", "And another."]);
    expect(parseTranscript("")).toEqual({ title: null, sections: [], wordCount: 0 });
    expect(parseTranscript(null)).toEqual({ title: null, sections: [], wordCount: 0 });
  });

  it("does not treat a body line as a title once content has started", () => {
    const t = parseTranscript("Intro line.\n\nWe meet for — 5 MIN\n");
    expect(t.title).toBeNull();
    expect(t.sections[0].blocks).toHaveLength(2);
  });

  it("counts words and estimates reading time", () => {
    const t = parseTranscript(SAMPLE);
    expect(t.wordCount).toBeGreaterThan(20);
    expect(readingMinutes(t.wordCount)).toBe(1);
    expect(readingMinutes(360)).toBe(2);
    expect(readingMinutes(0)).toBe(1);
  });

  it("finds the section at a playback time", () => {
    const t = parseTranscript(SAMPLE);
    expect(sectionAtTime(t, 0)?.label).toBe("HOOK");
    expect(sectionAtTime(t, 45)?.label).toBe("WHY THIS MATTERS");
    expect(sectionAtTime(t, 599)?.label).toBe("ACTION HANDOFF");
    expect(sectionAtTime(parseTranscript("plain"), 10)).toBeNull();
  });
});

describe("timecodes and cues", () => {
  it("parses m:ss and h:mm:ss clocks", () => {
    expect(parseClock("0:30")).toBe(30);
    expect(parseClock("10:00")).toBe(600);
    expect(parseClock("1:02:03")).toBe(3723);
    expect(parseClock("1:75")).toBeNull();
    expect(parseClock("abc")).toBeNull();
  });
  it("formats clocks", () => {
    expect(formatClock(0)).toBe("0:00");
    expect(formatClock(75)).toBe("1:15");
    expect(formatClock(3723)).toBe("1:02:03");
    expect(formatClock(-5)).toBe("0:00");
  });
  it("parses a heading with and without timecodes", () => {
    expect(parseSectionHeading("2:00–4:00  HOW THE JOURNEY WORKS")).toEqual({
      label: "HOW THE JOURNEY WORKS",
      time: { start: "2:00", end: "4:00", startSec: 120, endSec: 240 },
    });
    expect(parseSectionHeading("CLOSING THOUGHTS")).toEqual({ label: "CLOSING THOUGHTS", time: null });
    expect(parseSectionHeading("5:00 ONE TIME ONLY").time).toEqual({ start: "5:00", end: null, startSec: 300, endSec: null });
  });
  it("recognises cue lines", () => {
    expect(isCueLine("[PAUSE — 3 seconds]")).toBe(true);
    expect(isCueLine("[VISUAL: slide]")).toBe(true);
    expect(isCueLine("Not a cue")).toBe(false);
    expect(isCueLine("[half open")).toBe(false);
  });
});

describe("search", () => {
  const t = parseTranscript(SAMPLE);
  it("finds matches in document order, case-insensitively", () => {
    const matches = findMatches(t, "me");
    expect(matches.length).toBeGreaterThanOrEqual(2);
    expect(matches[0]).toEqual({ sectionIndex: 0, blockIndex: 0, occurrence: 0 });
    expect(findMatches(t, "")).toEqual([]);
    expect(findMatches(t, "   ")).toEqual([]);
  });
  it("splits text into highlightable segments with global indices", () => {
    const segs = splitMatches("the cat and the hat", "the", 4);
    expect(segs).toEqual([
      { text: "the", match: true, matchIndex: 4 },
      { text: " cat and ", match: false },
      { text: "the", match: true, matchIndex: 5 },
      { text: " hat", match: false },
    ]);
    expect(splitMatches("no hits", "zzz")).toEqual([{ text: "no hits", match: false }]);
    expect(splitMatches("regex (chars) ok", "(chars)")).toEqual([
      { text: "regex ", match: false },
      { text: "(chars)", match: true, matchIndex: 0 },
      { text: " ok", match: false },
    ]);
  });
});

describe("keyboard shortcuts", () => {
  it("maps keys to actions", () => {
    expect(shortcutAction({ key: " " })).toEqual({ type: "togglePlay" });
    expect(shortcutAction({ key: "k" })).toEqual({ type: "togglePlay" });
    expect(shortcutAction({ key: "j" })).toEqual({ type: "seek", deltaSec: -10 });
    expect(shortcutAction({ key: "l" })).toEqual({ type: "seek", deltaSec: 10 });
    expect(shortcutAction({ key: "ArrowLeft" })).toEqual({ type: "seek", deltaSec: -5 });
    expect(shortcutAction({ key: "ArrowRight" })).toEqual({ type: "seek", deltaSec: 5 });
    expect(shortcutAction({ key: "m" })).toEqual({ type: "toggleMute" });
    expect(shortcutAction({ key: "f" })).toEqual({ type: "toggleFullscreen" });
    expect(shortcutAction({ key: "c" })).toEqual({ type: "toggleCaptions" });
    expect(shortcutAction({ key: "<", shiftKey: true })).toEqual({ type: "speed", direction: -1 });
    expect(shortcutAction({ key: ">", shiftKey: true })).toEqual({ type: "speed", direction: 1 });
    expect(shortcutAction({ key: ",", shiftKey: true })).toEqual({ type: "speed", direction: -1 });
    expect(shortcutAction({ key: "." })).toBeNull();
    expect(shortcutAction({ key: "x" })).toBeNull();
  });
  it("ignores modifier combinations so browser shortcuts keep working", () => {
    expect(shortcutAction({ key: "k", ctrlKey: true })).toBeNull();
    expect(shortcutAction({ key: "f", metaKey: true })).toBeNull();
    expect(shortcutAction({ key: "m", altKey: true })).toBeNull();
  });
  it("steps through the speed ladder and clamps", () => {
    expect(PLAYBACK_SPEEDS).toEqual([0.75, 1, 1.25, 1.5, 1.75, 2]);
    expect(stepSpeed(1, 1)).toBe(1.25);
    expect(stepSpeed(1, -1)).toBe(0.75);
    expect(stepSpeed(0.75, -1)).toBe(0.75);
    expect(stepSpeed(2, 1)).toBe(2);
    expect(stepSpeed(1.1, 1)).toBe(1.25);
  });
  it("knows when the user is typing", () => {
    expect(isTypingTarget({ tagName: "INPUT" })).toBe(true);
    expect(isTypingTarget({ tagName: "textarea" })).toBe(true);
    expect(isTypingTarget({ tagName: "DIV", isContentEditable: true })).toBe(true);
    expect(isTypingTarget({ tagName: "DIV", getAttribute: () => "textbox" })).toBe(true);
    expect(isTypingTarget({ tagName: "DIV", getAttribute: () => null })).toBe(false);
    expect(isTypingTarget(null)).toBe(false);
  });
});

describe("formatting", () => {
  it("formats bytes and positions", () => {
    expect(formatBytes(0)).toBe("");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(45283)).toBe("44 KB");
    expect(formatBytes(2.5 * 1024 * 1024)).toBe("2.5 MB");
    expect(positionLabel(201)).toBe("at 3:21");
    expect(positionLabel(null)).toBeNull();
  });
});
