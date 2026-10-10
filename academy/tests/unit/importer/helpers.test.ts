import { describe, expect, it } from "vitest";
import type { CoursePackage } from "@/lib/types";
import { diffPackages } from "@/lib/importer/diff";
import { rowsFromMatrix, xpSummaryFromMatrix, cellText } from "@/lib/importer/parse-sheet";
import {
  audioSlot,
  buildActionStep,
  expectedXpByModule,
  moduleCodeForFolder,
  moduleCodeForRow,
  parseActionStepCell,
  parseIllustration,
  parseRelease,
  parseResourceMentions,
  parseVideoCell,
  resourceKey,
  resourceLabel,
  transcriptDurationSec,
} from "@/lib/importer/parse-package";
import { stripCommonRoot } from "@/lib/importer/zip";

describe("parse-sheet helpers", () => {
  const header = [
    "MODULE #",
    "MODULE # TRAINING #",
    "MODULE NAME",
    "TRAINING NAME",
    "SHORT DESCRIPTION (1 sentence)",
    "TRAINING NOTES (optional)",
    "VIDEO & THUMBNAIL",
    "RELEASE",
    "RESOURCES (mp3, PDF)",
    "TRAINING ACTION STEP 1 (consumption), XPs",
    "TRAINING ACTION STEP 2 (implementation), XPs",
    "TRAINING ACTION STEP 3 (optional), XPs",
    "TRAINING ACTION STEP 4 (rare), XPs",
    "XP",
  ];

  it("maps columns by header, treats '/' as empty and skips note rows", () => {
    const rows = rowsFromMatrix([
      ["Title row", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      header,
      ["M1", "/", "Foundations", "/", "Desc", "Notes", "M1-header.jpg", "Immediately", "Overview.pdf", "/", "/", "/", "/", "10"],
      ["M1", "1", "/", "Intro", "Desc 1", "/", "M1T1.mp4 (10 min)", "Immediately", "A.pdf", "Read, 40 XP", "Do, 30 XP", "/", "/", "70"],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["Yellow rows were reconstructed", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ]);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ rowNumber: 3, moduleCode: "M1", trainingCode: "", moduleName: "Foundations", trainingName: "", xp: 10 });
    expect(rows[1]).toMatchObject({ rowNumber: 4, trainingCode: "1", notes: "", actionSteps: ["Read, 40 XP", "Do, 30 XP", "", ""], xp: 70 });
  });

  it("fails loudly when a column is missing", () => {
    expect(() => rowsFromMatrix([header.slice(0, 13)])).toThrow(/missing column/);
  });

  it("reads cell values of every shape", () => {
    expect(cellText(null)).toBe("");
    expect(cellText(" x ")).toBe("x");
    expect(cellText(12)).toBe("12");
    expect(cellText({ richText: [{ text: "a" }, { text: "b" }] })).toBe("ab");
    expect(cellText({ text: "link", hyperlink: "https://x" })).toBe("link");
    expect(cellText({ formula: "SUM(A1)", result: 5 })).toBe("5");
    expect(cellText({ formula: "SUM(A1)" })).toBe("");
    expect(cellText({ error: "#N/A" })).toBe("");
  });

  it("reads the XP summary and maps it onto module codes", () => {
    const summary = xpSummaryFromMatrix([
      ["XP summary", ""],
      ["Course Home", "5"],
      ["M1", "460"],
      ["Bonus", "50"],
      ["Replay", "50"],
      ["Pre-actions (Course Home)", "60"],
      ["Grand total", ""],
    ]);
    expect(summary).toHaveLength(5);
    expect(expectedXpByModule(summary)).toEqual({ M0: 65, M1: 460, BONUS: 50, REPLAY: 50 });
  });
});

describe("parse-package helpers", () => {
  it("identifies module folders and sheet codes", () => {
    expect(moduleCodeForFolder("00_Course_Home")).toBe("M0");
    expect(moduleCodeForFolder("03_Module_3_Exercise_and_Movement")).toBe("M3");
    expect(moduleCodeForFolder("08_Bonuses")).toBe("BONUS");
    expect(moduleCodeForFolder("09_Replays")).toBe("REPLAY");
    expect(moduleCodeForFolder("_production")).toBeNull();
    expect(moduleCodeForRow("Course Home")).toBe("M0");
    expect(moduleCodeForRow("M7")).toBe("M7");
    expect(moduleCodeForRow("Bonus")).toBe("BONUS");
    expect(moduleCodeForRow("Replay")).toBe("REPLAY");
    expect(moduleCodeForRow("Something")).toBeNull();
  });

  it("parses release, video, illustration and transcript runtimes", () => {
    expect(parseRelease("Immediately")).toBe(0);
    expect(parseRelease("Immediate")).toBe(0);
    expect(parseRelease("After 42 Days")).toBe(42);
    expect(parseRelease("After 2 weeks")).toBe(14);
    expect(parseRelease("whenever")).toBeNull();
    expect(parseVideoCell("M1T3-Mindset.mp4 (8 min, YouTube: youtube.com/mindset-intro)")).toEqual({ filename: "M1T3-Mindset.mp4", duration_sec: 480 });
    expect(parseVideoCell("M3T1-Yoga.mp4 (15 min guided, upload)")).toEqual({ filename: "M3T1-Yoga.mp4", duration_sec: 900 });
    expect(parseVideoCell("Default cartoon (welcoming family); Intro Video: welcome-video.mp4 (upload)")).toEqual({ filename: "welcome-video.mp4", duration_sec: null });
    expect(parseIllustration("Default cartoon (family on a path); M7-header.jpg (upload optional)")).toBe("family-on-a-path");
    expect(transcriptDurationSec("M1T1: INTRODUCTION — 10 MIN\n\n— 0:00–0:30 HOOK —")).toBe(600);
    expect(transcriptDurationSec("REPLAY 2: GROUP COACHING — 40 MIN (LIVE-CALL FACILITATION SCRIPT)")).toBe(2400);
    expect(transcriptDurationSec("No runtime here")).toBeNull();
  });

  it("normalises resource names the way the sheet writes them", () => {
    expect(resourceKey("Grocery List.xls")).toBe(resourceKey("Grocery_List.xlsx"));
    expect(resourceKey("Connection Q&A Notes.pdf")).toBe(resourceKey("Connection_QA_Notes.pdf"));
    expect(resourceKey("Self-Assessment.pdf")).toBe(resourceKey("M1T1_Self-Assessment.pdf"));
    expect(resourceKey("Cravings FAQ.pdf")).toBe("cravingsfaq.pdf");
    expect(resourceLabel("M1T3_Affirmations_and_Vision_Board_Guide.pdf")).toBe("Affirmations and Vision Board Guide");
    expect(resourceLabel("Connection_Workbook.pdf", "Visioning")).toBe("Connection Workbook (Visioning)");
    expect(parseResourceMentions("Connection Workbook.pdf (Visioning)")).toEqual([
      { raw: "Connection Workbook.pdf (Visioning)", fileName: "Connection Workbook.pdf", ext: "pdf", parenthetical: "Visioning", embed: false },
    ]);
    expect(parseResourceMentions("Welcome Guide.pdf; Embed welcome-audio.mp3")).toMatchObject([
      { fileName: "Welcome Guide.pdf", ext: "pdf", embed: false },
      { fileName: "welcome-audio.mp3", ext: "mp3", embed: true },
    ]);
    expect(parseResourceMentions("Affirmations Audio.mp3 (embed)")[0]).toMatchObject({ fileName: "Affirmations Audio.mp3", embed: true, parenthetical: null });
    expect(audioSlot("audio.mp3")).toEqual({ key: "audio", label: "Training audio", file_path: null });
    expect(audioSlot("session summaries.mp3")).toEqual({ key: "session-summaries", label: "Session summaries audio", file_path: null });
  });

  it("parses action-step cells and strips placeholder links", () => {
    expect(parseActionStepCell("Complete Wellness Quiz (link: forms.gle/wellness-quiz), 50 XP")).toEqual({
      source_label: "Complete Wellness Quiz (link: forms.gle/wellness-quiz), 50 XP",
      label: "Complete Wellness Quiz",
      xp: 50,
    });
    expect(parseActionStepCell("Complete Pre-Actions (from Step 1), 60 XP")?.label).toBe("Complete Pre-Actions");
    expect(parseActionStepCell("")).toBeNull();
    expect(() => parseActionStepCell("No points here")).toThrow(/Label, NN XP/);
    expect(buildActionStep("Create Relapse Plan (PDF upload) & Share Success, 10 XP", 0, 0)).toMatchObject({
      kind: "consumption",
      requires_upload: true,
      upload_type: "pdf",
      link: { type: "forum" },
    });
    expect(buildActionStep("Post Testimonial, 30 XP", 1, 1)).toMatchObject({ kind: "implementation", link: { type: "testimonial" } });
    expect(buildActionStep("Reflect, 30 XP", 3, 0)).toMatchObject({ kind: "rare", link: { type: "none" }, sub_items: null });
  });
});

describe("zip helpers", () => {
  it("strips a single wrapper folder but keeps mixed roots", () => {
    const wrapped = new Map([
      ["Baby_Steps_Course/sheet.xlsx", Buffer.from("a")],
      ["Baby_Steps_Course/00_Course_Home/x.txt", Buffer.from("b")],
    ]);
    expect([...stripCommonRoot(wrapped).keys()]).toEqual(["sheet.xlsx", "00_Course_Home/x.txt"]);
    const flat = new Map([
      ["sheet.xlsx", Buffer.from("a")],
      ["00_Course_Home/x.txt", Buffer.from("b")],
    ]);
    expect([...stripCommonRoot(flat).keys()]).toEqual(["sheet.xlsx", "00_Course_Home/x.txt"]);
  });
});

describe("diffPackages", () => {
  function basePackage(): CoursePackage {
    const lesson = (code: string, title: string): CoursePackage["modules"][number]["lessons"][number] => ({
      code,
      title,
      series: null,
      description: "d",
      notes: "",
      planned_video_filename: null,
      video_provider: "none",
      video_asset_id: null,
      video_playback_id: null,
      video_url: null,
      captions_path: null,
      thumbnail_path: null,
      duration_sec: 300,
      transcript: "words",
      transcript_source_file: null,
      audio_slots: [],
      is_preview: false,
      is_intro: false,
      position: 0,
      drip_days_override: null,
      status: "published",
      publish_at: null,
      doctor_callout: false,
      quiz_key: null,
      resources: [{ file_path: "c/a.pdf", label: "A", file_name: "a.pdf", type: "pdf", size_bytes: 1, position: 0 }],
      action_steps: [
        { label: "Read", source_label: "Read, 10 XP", kind: "consumption", xp: 10, requires_upload: false, upload_type: null, link: { type: "none" }, position: 0, sub_items: null },
      ],
    });
    return {
      version: 1,
      generated_at: "2026-01-01T00:00:00.000Z",
      source: { zip: null, sheet: "s.xlsx" },
      course: {
        slug: "c",
        title: "Course",
        subtitle: "",
        description: "",
        short_description: "",
        thumbnail_path: null,
        illustration: null,
        status: "published",
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
        duration_weeks: 1,
      },
      modules: [
        {
          code: "M1",
          kind: "core",
          title: "One",
          description: "",
          notes: "",
          position: 0,
          drip_days: 0,
          completion_xp: 10,
          header_image_path: null,
          illustration: null,
          required_for_certificate: true,
          resources: [],
          lessons: [lesson("M1T1", "First"), lesson("M1T2", "Second")],
        },
      ],
      quizzes: [],
      forum_categories: [{ slug: "general", title: "General", description: "", position: 0, module_code: null }],
      stats: { lesson_count: 2, resource_count: 1, transcript_count: 0, total_video_sec: 600, total_xp: 30, xp_by_module: { M1: 30 } },
    };
  }

  it("reports no changes for identical packages", () => {
    const diff = diffPackages(basePackage(), basePackage());
    expect(diff.unchanged).toBe(true);
    expect(diff.changes).toEqual([]);
    expect(diff.summary).toMatch(/No changes/);
  });

  it("describes added, removed and changed items in plain words", () => {
    const next = basePackage();
    next.course.title = "Course, renamed";
    next.modules[0].lessons[0].title = "First (edited)";
    next.modules[0].lessons[0].action_steps[0].xp = 20;
    next.modules[0].lessons[0].resources.push({ file_path: "c/b.pdf", label: "B", file_name: "b.pdf", type: "pdf", size_bytes: 2, position: 1 });
    next.modules[0].lessons.splice(1, 1);
    next.modules.push({ ...basePackage().modules[0], code: "M2", title: "Two", position: 1, lessons: [] });
    next.stats.total_xp = 40;
    next.stats.xp_by_module = { M1: 30, M2: 10 };
    const diff = diffPackages(basePackage(), next);
    expect(diff.unchanged).toBe(false);
    expect(diff.counts).toEqual({ added: 1, removed: 1, changed: 3 });
    const byCode = Object.fromEntries(diff.changes.map((c) => [`${c.level}:${c.code}`, c]));
    expect(byCode["course:course"].details).toEqual(['title: "Course" → "Course, renamed"']);
    expect(byCode["module:M2"].kind).toBe("added");
    expect(byCode["lesson:M1T2"].kind).toBe("removed");
    expect(byCode["lesson:M1T1"].details).toEqual([
      'title: "First" → "First (edited)"',
      "resource added: B (b.pdf)",
      'action step "Read": xp 10 → 20',
    ]);
    expect(byCode["stats:stats"].details).toEqual(["total xp: 30 → 40", "XP M2: 0 → 10"]);
    expect(diff.summary).toBe("course details changed, 1 module added, 1 lesson removed, 1 lesson changed; total XP 30 → 40.");
  });
});
