import { beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import type { CoursePackage } from "@/lib/types";
import { importFromDirectory, importFromZip, type ImportResult } from "@/lib/importer";
import { SUMMARIES_HEADING } from "@/lib/importer/parse-package";

const SOURCE_DIR = path.resolve(process.cwd(), "content/source/Baby_Steps_Course");
const SOURCE_ZIP = path.resolve(process.cwd(), "content/source/Baby_Steps_Course.zip");
const NOW = "2026-01-01T00:00:00.000Z";

/** XP Summary tab, as built. Course Home 5 + pre-actions 60 both belong to M0. */
const XP_SUMMARY: Record<string, number> = {
  M0: 65,
  M1: 460,
  M2: 690,
  M3: 510,
  M4: 600,
  M5: 600,
  M6: 530,
  M7: 530,
  BONUS: 50,
  REPLAY: 50,
};

const PLACEHOLDER = /forms\.gle|youtube\.com|facebook\.com\/groups/i;

let result: ImportResult;
let pkg: CoursePackage;

function lesson(code: string) {
  for (const m of pkg.modules) for (const l of m.lessons) if (l.code === code) return l;
  throw new Error(`lesson ${code} missing`);
}

function mod(code: string) {
  const m = pkg.modules.find((x) => x.code === code);
  if (!m) throw new Error(`module ${code} missing`);
  return m;
}

beforeAll(async () => {
  result = await importFromDirectory(SOURCE_DIR, { now: NOW });
  pkg = result.pkg;
});

describe("importFromDirectory (Baby Steps package)", () => {
  it("builds the ten modules in order", () => {
    expect(pkg.modules.map((m) => m.code)).toEqual(["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "BONUS", "REPLAY"]);
    expect(pkg.modules.map((m) => m.kind)).toEqual(["home", "core", "core", "core", "core", "core", "core", "core", "bonus", "replay"]);
    expect(pkg.modules.map((m) => m.position)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(pkg.modules.map((m) => m.drip_days)).toEqual([0, 0, 7, 14, 21, 28, 35, 42, 0, 0]);
    expect(pkg.modules.map((m) => m.completion_xp)).toEqual([5, 10, 10, 10, 10, 10, 10, 10, 0, 0]);
    expect(pkg.modules.map((m) => m.required_for_certificate)).toEqual([true, true, true, true, true, true, true, true, false, false]);
    expect(mod("M1").title).toBe("Foundations of Family Wellness");
    expect(mod("M1").description).toBe(
      "Learn the core principles of creating a healthy, connected foundation for pre-conception wellness with Cynthia's guidance.",
    );
    expect(mod("M1").notes).toBe('Reflect on your "why" for generational impact.');
    expect(mod("BONUS").title).toBe("Bonuses");
    expect(mod("REPLAY").title).toBe("Replays");
    expect(mod("M1").illustration).toBe("family-foundation");
  });

  it("has the expected lesson counts (59 lessons)", () => {
    const counts = Object.fromEntries(pkg.modules.map((m) => [m.code, m.lessons.length]));
    expect(counts).toEqual({ M0: 1, M1: 6, M2: 9, M3: 7, M4: 8, M5: 8, M6: 7, M7: 7, BONUS: 4, REPLAY: 2 });
    expect(pkg.stats.lesson_count).toBe(59);
    expect(mod("M1").lessons.map((l) => l.code)).toEqual(["M1T0", "M1T1", "M1T2", "M1T3", "M1T4", "M1T5"]);
    expect(mod("BONUS").lessons.map((l) => l.code)).toEqual(["BONUS_T1", "BONUS_T2a", "BONUS_T2b", "BONUS_T2c"]);
    expect(mod("REPLAY").lessons.map((l) => l.code)).toEqual(["REPLAY_T1", "REPLAY_T2"]);
  });

  it("models the Course Home, intro, bonus and replay lessons as specified", () => {
    const home = lesson("M0");
    expect(home.title).toBe("Welcome to Baby Steps");
    expect(home.notes).toBe("Start with pre-actions for full engagement.");
    expect(home.transcript_source_file).toBe("00_Course_Home/Scripts/M0_Welcome_Video_Script_teleprompter.txt");
    expect(home.duration_sec).toBe(300);
    expect(home.planned_video_filename).toBe("welcome-video.mp4");
    expect(home.is_preview).toBe(true);
    expect(home.quiz_key).toBe("pre-course-survey");
    expect(home.audio_slots).toEqual([{ key: "welcome-audio", label: "Welcome audio", file_path: null }]);

    const intro = lesson("M1T0");
    expect(intro.is_intro).toBe(true);
    expect(intro.title).toBe("Module introduction");
    expect(intro.description).toBe("");
    expect(intro.duration_sec).toBe(300);
    expect(intro.action_steps).toEqual([]);
    expect(intro.transcript_source_file).toMatch(/M1T0_Module_Intro_Script_teleprompter\.txt$/);

    expect(lesson("BONUS_T1")).toMatchObject({ title: "A Dozen Habits for a Healthy Life", series: null, duration_sec: 900 });
    expect(lesson("BONUS_T2a")).toMatchObject({ title: "Session 1: Understanding and Rewiring Cravings", series: "THE FIX for Cravings" });
    expect(lesson("BONUS_T2c")).toMatchObject({ title: "Session 3: Long-Term Craving Freedom", series: "THE FIX for Cravings" });
    expect(lesson("REPLAY_T1")).toMatchObject({ title: "Nutrition and Cravings Deep Dive", series: "Group Coaching Replay", duration_sec: 2100 });
    expect(lesson("REPLAY_T2")).toMatchObject({ title: "Emotional Wellness and Connection", series: "Group Coaching Replay", duration_sec: 2400 });
    expect(lesson("M1T1")).toMatchObject({ title: "Introduction to Pre-Conception Health", duration_sec: 600, is_preview: true, planned_video_filename: "M1T1-Intro.mp4" });
    expect(lesson("M1T1").notes).toBe("Cynthia shares her expertise on multi-generational health.");
    expect(lesson("M1T2").is_preview).toBe(false);
  });

  it("gives every lesson a verbatim, non-empty transcript and consumes all 60 scripts", () => {
    for (const m of pkg.modules) {
      for (const l of m.lessons) {
        expect(l.transcript.trim().length, l.code).toBeGreaterThan(200);
        expect(l.transcript_source_file, l.code).toMatch(/_teleprompter\.txt$/);
        expect(l.transcript_source_file, l.code).not.toMatch(/\.(docx|pdf)$/);
      }
    }
    const summaries = lesson("BONUS_T2c").transcript;
    expect(summaries).toContain(SUMMARIES_HEADING);
    expect(summaries.indexOf(SUMMARIES_HEADING)).toBeGreaterThan(1000);
    expect(summaries.slice(summaries.indexOf(SUMMARIES_HEADING))).toContain("THE FIX FOR CRAVINGS — SESSION SUMMARIES AUDIO — 4 MIN");
    expect(lesson("BONUS_T2b").transcript).not.toContain(SUMMARIES_HEADING);
    expect(pkg.stats.transcript_count).toBe(60);
    expect(result.warnings).toEqual([]);
  });

  it("attaches all 54 learner files at least once and never a script", () => {
    const attached = new Set<string>();
    for (const m of pkg.modules) {
      for (const r of m.resources) attached.add(r.file_path);
      for (const l of m.lessons) for (const r of l.resources) attached.add(r.file_path);
    }
    expect(attached.size).toBe(54);
    expect(pkg.stats.resource_count).toBe(54);
    expect(result.files.length).toBe(54);
    expect(new Set(result.files.map((f) => f.storage_path))).toEqual(attached);
    for (const p of attached) {
      expect(p).toMatch(/^baby-steps\/[^/]+\/Resources\/[^/]+$/);
      expect(p).not.toMatch(/Scripts/);
    }
    const types = result.files.map((f) => f.file_name.split(".").pop());
    expect(types.filter((t) => t === "pdf")).toHaveLength(48);
    expect(types.filter((t) => t === "xlsx")).toHaveLength(6);
    for (const f of result.files) expect(f.size_bytes).toBeGreaterThan(0);
  });

  it("attaches resources by sheet mention, code prefix and module row", () => {
    expect(lesson("M2T1").resources.map((r) => r.file_name)).toEqual(["Grocery_List.xlsx"]);
    expect(lesson("M2T1").resources[0]).toMatchObject({ label: "Grocery List", type: "xlsx" });
    expect(lesson("M1T3").resources.map((r) => r.file_name)).toEqual(["M1T3_Affirmations_and_Vision_Board_Guide.pdf"]);
    expect(lesson("M1T3").resources[0].label).toBe("Affirmations and Vision Board Guide");
    expect(lesson("M4T1").resources.map((r) => r.file_name)).toEqual(["M4T1_Meditation_Audio_Script_and_Log.pdf"]);
    expect(lesson("M7T2").resources.map((r) => r.file_name)).toEqual(["M7T2_Habit_Log.pdf"]);
    expect(lesson("M7T3").resources.map((r) => r.file_name)).toEqual(["Progress_Tracker.xlsx"]);
    expect(lesson("M6T3").resources[0]).toMatchObject({ file_name: "Connection_Workbook.pdf", label: "Connection Workbook (Visioning)" });
    expect(lesson("M6T4").resources[0].label).toBe("Connection Workbook (Intimacy)");
    expect(lesson("M6T5").resources[0].label).toBe("Connection Workbook (Legacy)");
    expect(lesson("M6T6").resources[0].label).toBe("Connection Workbook (Challenge)");
    expect(mod("M6").resources.map((r) => r.file_name)).toEqual(["Connection_Workbook.pdf"]);
    expect(lesson("REPLAY_T2").resources[0]).toMatchObject({ file_name: "Connection_QA_Notes.pdf" });
    expect(lesson("REPLAY_T1").resources[0]).toMatchObject({ file_name: "Cravings_FAQ.pdf", label: "Cravings FAQ" });
    for (const code of ["BONUS_T2a", "BONUS_T2b", "BONUS_T2c"]) {
      expect(lesson(code).resources.map((r) => r.file_name)).toEqual(["Cravings_Fix_Workbook.pdf"]);
    }
    expect(mod("M1").resources.map((r) => r.file_name)).toEqual(["Foundations_Overview.pdf"]);
    expect(mod("M2").resources.map((r) => r.file_name)).toEqual(["Nutrition_Starter_Guide.pdf"]);
    expect(lesson("M0").resources.map((r) => r.file_name)).toEqual(["Welcome_Guide.pdf", "Pre-Course_Survey_and_Welcome_Audio.pdf"]);
    expect(mod("M0").resources.map((r) => r.file_name)).toEqual(["Welcome_Guide.pdf"]);
    expect(lesson("M0").resources[0].file_path).toBe("baby-steps/00_Course_Home/Resources/Welcome_Guide.pdf");
  });

  it("computes XP per module equal to the XP Summary tab and 4085 in total", () => {
    expect(pkg.stats.xp_by_module).toEqual(XP_SUMMARY);
    expect(pkg.stats.total_xp).toBe(4085);
    const stepXp = pkg.modules.flatMap((m) => m.lessons.flatMap((l) => l.action_steps.map((s) => s.xp))).reduce((a, b) => a + b, 0);
    const moduleXp = pkg.modules.reduce((a, m) => a + m.completion_xp, 0);
    expect(stepXp + moduleXp).toBe(4085);
  });

  it("parses action steps with labels, kinds, links and uploads", () => {
    const [first, second, third] = lesson("M1T1").action_steps;
    expect(first).toMatchObject({
      label: "Complete Wellness Quiz",
      source_label: "Complete Wellness Quiz (link: forms.gle/wellness-quiz), 50 XP",
      xp: 50,
      kind: "consumption",
      link: { type: "quiz", quiz_key: "wellness-quiz" },
      requires_upload: false,
      position: 0,
    });
    expect(second).toMatchObject({ label: "Journal Your Baseline", xp: 30, kind: "implementation", link: { type: "none" } });
    expect(third).toMatchObject({ label: "Share in Forum", xp: 20, kind: "optional", link: { type: "forum" } });

    const home = lesson("M0").action_steps;
    expect(home).toHaveLength(1);
    expect(home[0]).toMatchObject({ label: "Complete Pre-Actions", xp: 60, link: { type: "survey", quiz_key: "pre-course-survey" } });
    expect(home[0].sub_items?.map((s) => [s.key, s.xp])).toEqual([
      ["introduce", 10],
      ["whitelist", 10],
      ["survey", 40],
    ]);

    expect(lesson("M1T3").action_steps[1]).toMatchObject({ label: "Create Vision Board (upload photo)", requires_upload: true, upload_type: "photo", link: { type: "upload", upload_type: "photo" } });
    expect(lesson("BONUS_T1").action_steps[0]).toMatchObject({ requires_upload: true, upload_type: "journal", link: { type: "upload", upload_type: "journal" } });
    expect(lesson("BONUS_T1").action_steps[1]).toMatchObject({ label: "Share Top Habit", link: { type: "forum" } });
    expect(lesson("BONUS_T2a").action_steps[0]).toMatchObject({ requires_upload: true, upload_type: "journal", link: { type: "upload", upload_type: "journal" } });
    expect(lesson("BONUS_T2b").action_steps[0]).toMatchObject({ requires_upload: true, upload_type: "photo", link: { type: "upload", upload_type: "photo" } });
    expect(lesson("BONUS_T2c").action_steps[0]).toMatchObject({ requires_upload: true, upload_type: "pdf", link: { type: "forum" } });
    expect(lesson("M2T6").action_steps[0]).toMatchObject({ label: "Take Sensitivity Quiz", link: { type: "quiz", quiz_key: "sensitivity-quiz" } });
    expect(lesson("M2T4").action_steps[0]).toMatchObject({ label: "Add 1 Probiotic Food", link: { type: "none" } });
    expect(lesson("M7T6").action_steps.map((s) => s.link.type)).toEqual(["none", "testimonial", "forum"]);
    expect(lesson("M6T2").action_steps[2]).toMatchObject({ label: "Share Anonymously", link: { type: "forum" } });
  });

  it("sets quiz keys, doctor callouts and audio slots", () => {
    expect(lesson("M1T1").quiz_key).toBe("wellness-quiz");
    expect(lesson("M2T4").quiz_key).toBe("gut-health-quiz");
    expect(lesson("M2T6").quiz_key).toBe("sensitivity-quiz");
    expect(lesson("M7T5").quiz_key).toBe("pre-course-survey");
    expect(lesson("M1T2").quiz_key).toBeNull();
    const callouts = pkg.modules.flatMap((m) => m.lessons.filter((l) => l.doctor_callout).map((l) => l.code));
    expect(callouts).toEqual(["M2T6", "M2T7", "M4T5", "M7T3"]);
    expect(lesson("M1T1").audio_slots).toEqual([{ key: "audio", label: "Training audio", file_path: null }]);
    expect(lesson("M1T3").audio_slots).toEqual([{ key: "affirmations-audio", label: "Affirmations audio", file_path: null }]);
    expect(lesson("M4T1").audio_slots).toEqual([{ key: "meditation-audio", label: "Meditation audio", file_path: null }]);
    expect(lesson("BONUS_T2c").audio_slots).toEqual([{ key: "session-summaries", label: "Session summaries audio", file_path: null }]);
    expect(lesson("M1T2").audio_slots).toEqual([]);
  });

  it("never carries placeholder URLs in labels, titles, descriptions or notes", () => {
    const texts: string[] = [pkg.course.title, pkg.course.subtitle, pkg.course.description, pkg.course.short_description, ...pkg.course.what_you_learn, ...pkg.course.faq.flatMap((f) => [f.q, f.a])];
    for (const m of pkg.modules) {
      texts.push(m.title, m.description, m.notes);
      for (const r of m.resources) texts.push(r.label);
      for (const l of m.lessons) {
        texts.push(l.title, l.description, l.notes, l.series ?? "");
        for (const r of l.resources) texts.push(r.label);
        for (const s of l.action_steps) {
          texts.push(s.label);
          for (const sub of s.sub_items ?? []) texts.push(sub.label);
        }
      }
    }
    for (const q of pkg.quizzes) texts.push(q.title, q.intro, q.confirmation, ...q.questions.map((qq) => qq.text));
    for (const c of pkg.forum_categories) texts.push(c.title, c.description);
    for (const t of texts) expect(t).not.toMatch(PLACEHOLDER);
    expect(lesson("M1T3").planned_video_filename).toBe("M1T3-Mindset.mp4");
    expect(JSON.stringify({ ...lesson("M1T3"), transcript: "" })).not.toMatch(PLACEHOLDER);
  });

  it("records durations from the sheet, then the transcript header", () => {
    expect(lesson("M1T1").duration_sec).toBe(600);
    expect(lesson("M3T1").duration_sec).toBe(900);
    expect(lesson("M7T6").duration_sec).toBe(780);
    expect(lesson("REPLAY_T2").duration_sec).toBe(2400);
    expect(pkg.stats.total_video_sec).toBe(661 * 60);
  });

  it("ships the four native quizzes transcribed from the PDFs", () => {
    expect(pkg.quizzes.map((q) => q.key)).toEqual(["wellness-quiz", "gut-health-quiz", "sensitivity-quiz", "pre-course-survey"]);
    const [wellness, gut, sensitivity, survey] = pkg.quizzes;
    expect(wellness.questions.filter((q) => q.type === "scale")).toHaveLength(25);
    expect(wellness.questions).toHaveLength(27);
    expect(wellness.scoring.sections?.map((s) => s.label)).toEqual(["Nutrition", "Movement", "Stress and sleep", "Toxins and environment", "Connection"]);
    expect(wellness.source_file).toBe("baby-steps/01_Module_1_Foundations_of_Family_Wellness/Resources/M1T1_Self-Assessment.pdf");
    expect(gut.questions).toHaveLength(12);
    expect(gut.scoring.bands?.map((b) => b.label)).toEqual(["settled", "unsettled", "strained"]);
    expect(gut.intro).toContain("Not a diagnosis.");
    expect(sensitivity.questions.filter((q) => q.type === "scale" || q.type === "yesno")).toHaveLength(12);
    expect(sensitivity.questions.find((q) => q.key === "q11")).toMatchObject({ type: "yesno", yes_value: 3 });
    expect(sensitivity.questions.find((q) => q.type === "choice")).toMatchObject({ text: "My suspect food (one only)" });
    expect(survey.questions).toHaveLength(6);
    expect(survey.questions.map((q) => q.type)).toEqual(["paragraph", "paragraph", "paragraph", "paragraph", "paragraph", "choice"]);
    expect(survey.scoring.kind).toBe("none");
    for (const q of pkg.quizzes) expect(q.source_file).toMatch(/^baby-steps\/.+\.pdf$/);
  });

  it("builds the course record, forum categories and stats", () => {
    expect(pkg.course.slug).toBe("baby-steps");
    expect(pkg.course.title).toBe("Baby Steps: Your Health Journey Toward Conception");
    expect(pkg.course.short_description).toBe(
      "Welcome to Baby Steps: Your Health Journey Toward Conception—empower your family wellness with Cynthia Myers Morrison.",
    );
    expect(pkg.course.description.startsWith("Welcome. Whether you arrived here full of hope")).toBe(true);
    expect(pkg.course.description).toContain("Integration and Long-Term Wellness");
    expect(pkg.course.what_you_learn).toHaveLength(7);
    expect(pkg.course.what_you_learn[0]).toBe(mod("M1").description);
    expect(pkg.course.faq.length).toBe(6);
    expect(pkg.course.duration_weeks).toBe(12);
    expect(pkg.course.status).toBe("published");
    expect(pkg.forum_categories.map((c) => c.slug)).toEqual([
      "general",
      "introductions",
      "foundations-of-family-wellness",
      "nutrition-for-optimal-fertility",
      "exercise-and-movement",
      "stress-management-and-emotional-wellness",
      "toxin-elimination-and-detox",
      "family-connection-and-communication",
      "integration-and-long-term-wellness",
      "bonuses",
      "replays",
      "alumni-group",
    ]);
    expect(pkg.forum_categories.map((c) => c.module_code)).toEqual([null, "M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "BONUS", "REPLAY", null]);
    expect(pkg.source).toEqual({ zip: null, sheet: "Baby_Steps_Course_Sheet_COMPLETE.xlsx" });
    expect(pkg.generated_at).toBe(NOW);
    expect(pkg.version).toBe(1);
  });
});

describe("importFromZip", () => {
  it("produces an identical package from the original zip", async () => {
    const zip = await importFromZip(await fs.readFile(SOURCE_ZIP), { now: NOW, zipName: "Baby_Steps_Course.zip" });
    expect(zip.pkg.source).toEqual({ zip: "Baby_Steps_Course.zip", sheet: "Baby_Steps_Course_Sheet_COMPLETE.xlsx" });
    const strip = (p: CoursePackage) => ({ ...p, generated_at: null, source: null });
    expect(strip(zip.pkg)).toEqual(strip(pkg));
    expect(zip.files.map((f) => [f.storage_path, f.size_bytes])).toEqual(result.files.map((f) => [f.storage_path, f.size_bytes]));
    expect(zip.files[0].data.equals(result.files[0].data)).toBe(true);
    expect(zip.warnings).toEqual([]);
  });
});
