import { describe, expect, it } from "vitest";
import { assignMatch, codePrefixOf, isVideoFile, matchVideos, normaliseCode, normaliseFilename, type MatchableLesson } from "@/components/admin/media/match-videos";

const lessons: MatchableLesson[] = [
  { id: "l-m0", code: "M0", title: "Welcome to Baby Steps", planned_video_filename: "M0-Welcome.mp4" },
  { id: "l-m1t0", code: "M1T0", title: "Module introduction", planned_video_filename: "M1T0-Intro.mp4" },
  { id: "l-m1t1", code: "M1T1", title: "Introduction to Pre-Conception Health", planned_video_filename: "M1T1-Intro.mp4" },
  { id: "l-m1t2", code: "M1T2", title: "Family Health History", planned_video_filename: "M1T2-FamilyHistory.mp4" },
  { id: "l-bonus", code: "BONUS_T2a", title: "THE FIX for Cravings, part 1", planned_video_filename: "BONUS_T2a-Fix.mp4" },
  { id: "l-replay", code: "REPLAY_T1", title: "Group Coaching Replay 1", planned_video_filename: null },
];

const f = (name: string) => ({ name });

describe("normalisers", () => {
  it("normalises filenames case/extension/separator-insensitively", () => {
    expect(normaliseFilename("M1T1-Intro.mp4")).toBe("m1t1-intro");
    expect(normaliseFilename("  m1t1_INTRO.MOV")).toBe("m1t1-intro");
    expect(normaliseFilename("folder/M1T1 Intro.mp4")).toBe("m1t1-intro");
  });

  it("normalises codes without underscores", () => {
    expect(normaliseCode("BONUS_T2a")).toBe("bonust2a");
    expect(normaliseCode("m1t1")).toBe("m1t1");
  });

  it("extracts a leading lesson code", () => {
    expect(codePrefixOf("M1T1-Intro.mp4")).toBe("m1t1");
    expect(codePrefixOf("m1t2_family_history.mov")).toBe("m1t2");
    expect(codePrefixOf("BONUS_T2a Final.mp4")).toBe("bonust2a");
    expect(codePrefixOf("REPLAY_T1.mp4")).toBe("replayt1");
    expect(codePrefixOf("Welcome video.mp4")).toBeNull();
  });

  it("recognises video extensions only", () => {
    expect(isVideoFile("a.MP4")).toBe(true);
    expect(isVideoFile("a.webm")).toBe(true);
    expect(isVideoFile("a.pdf")).toBe(false);
  });
});

describe("matchVideos", () => {
  it("matches by planned filename first, then by code prefix", () => {
    const out = matchVideos([f("m1t1-intro.MP4"), f("M1T2-anything-else.mov"), f("bonus_t2a.mp4"), f("REPLAY_T1-Session.mp4"), f("random.mp4")], lessons);
    expect(out.map((m) => [m.lesson_id, m.reason])).toEqual([
      ["l-m1t1", "filename"],
      ["l-m1t2", "code"],
      ["l-bonus", "code"],
      ["l-replay", "code"],
      [null, "none"],
    ]);
  });

  it("does not let M1T1 claim M1T10 and never matches a lesson twice", () => {
    const more = [...lessons, { id: "l-m1t10", code: "M1T10", title: "Ten", planned_video_filename: "M1T10-Ten.mp4" }];
    const out = matchVideos([f("M1T10-take2.mp4"), f("M1T1-take2.mp4"), f("M1T1-take3.mp4")], more);
    expect(out[0]).toMatchObject({ lesson_id: "l-m1t10", reason: "code" });
    expect(out[1]).toMatchObject({ lesson_id: "l-m1t1", reason: "code" });
    expect(out[2]).toMatchObject({ lesson_id: null, reason: "none" });
  });

  it("ignores non-video planned names gracefully and keeps file order", () => {
    const out = matchVideos([f("M0-Welcome.mp4")], lessons);
    expect(out).toHaveLength(1);
    expect(out[0].lesson_id).toBe("l-m0");
  });
});

describe("assignMatch", () => {
  it("assigns by hand and releases the previous holder of that lesson", () => {
    const base = matchVideos([f("M1T1-a.mp4"), f("other.mp4")], lessons);
    const next = assignMatch(base, 1, "l-m1t1");
    expect(next[1]).toMatchObject({ lesson_id: "l-m1t1", reason: "manual" });
    expect(next[0]).toMatchObject({ lesson_id: null, reason: "none" });
    const cleared = assignMatch(next, 1, null);
    expect(cleared[1]).toMatchObject({ lesson_id: null, reason: "none" });
  });
});
