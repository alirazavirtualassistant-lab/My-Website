import { describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "cyc-player-smoke-"));
process.env.DEMO_DATA_DIR = ROOT;
process.env.DEMO_MODE = "true";

const { ensureBootstrapped } = await import("@/lib/usecases/demo");
const { getServices } = await import("@/services");
const { getLearnerCourseState, getQuizResponses } = await import("@/lib/usecases/progress");
const { findLessonBySlug, getCourseBySlug, lessonSlug } = await import("@/lib/usecases/catalog");
const { categoryForLesson } = await import("@/lib/usecases/community");
const { signedUrlFor } = await import("@/lib/usecases/uploads");
const { adjacentLessons } = await import("@/lib/domain/progress");
const { buildCurriculum, moduleUnlock, completedLessonIds } = await import("@/app/(learner)/learn/[course]/_lib/load");

describe("player data flow against the demo seed", () => {
  it("boots, resolves lessons and builds the curriculum", async () => {
    await ensureBootstrapped();
    const { db, video } = await getServices();
    const course = await getCourseBySlug("baby-steps");
    expect(course).toBeTruthy();
    const learner = await db.from("profiles").findOne({ email: "learner@demo.cradleyourcravings.com" });
    expect(learner).toBeTruthy();
    const state = await getLearnerCourseState(learner!.id, course!.id, "learner");
    expect(state).toBeTruthy();
    expect(state!.access.allowed).toBe(true);
    expect(state!.summary.totalLessons).toBe(59);
    expect(state!.courseXp.total).toBe(4085);
    expect(state!.next?.lesson.code).toBe("M1T2");

    // Lesson slugs
    for (const slug of ["m1t1", "bonus-t2a", "m7t5", "replay-t1", "m0"]) {
      const found = findLessonBySlug(state!.tree, slug);
      expect(found, slug).toBeTruthy();
      expect(lessonSlug(found!.lesson)).toBe(slug);
    }

    // Drip: enrolled 10 days ago -> M1, M2 open; M3 opens in 4 days.
    const m3 = state!.tree.modules.find((m) => m.code === "M3")!;
    const m2 = state!.tree.modules.find((m) => m.code === "M2")!;
    expect(moduleUnlock(state!, m2).unlocked).toBe(true);
    const u3 = moduleUnlock(state!, m3);
    expect(u3.unlocked).toBe(false);
    expect(u3.unlocksAt).toBeTruthy();
    const m3t1 = findLessonBySlug(state!.tree, "m3t1")!;
    expect(state!.lessons[m3t1.lesson.id].unlocked).toBe(false);
    expect(state!.lessons[m3t1.lesson.id].unlocksAt).toBeTruthy();

    const curriculum = buildCurriculum(course!, state!);
    expect(curriculum.modules.length).toBe(10);
    expect(curriculum.totalLessons).toBe(59);
    expect(curriculum.modules.find((m) => m.code === "BONUS")!.unlocked).toBe(true);
    expect(completedLessonIds(state!).length).toBe(3);

    // Adjacency + playback + resources for M1T1
    const m1t1 = findLessonBySlug(state!.tree, "m1t1")!;
    const adj = adjacentLessons(state!.tree, m1t1.lesson.id);
    expect(adj.prev?.lesson.code).toBe("M1T0");
    expect(adj.next?.lesson.code).toBe("M1T2");
    const playback = await video.getPlayback({ provider: m1t1.lesson.video_provider, playback_id: m1t1.lesson.video_playback_id, video_url: m1t1.lesson.video_url, captions_path: m1t1.lesson.captions_path, thumbnail_path: m1t1.lesson.thumbnail_path, user_id: learner!.id });
    expect(playback.kind).toBe("none");
    const res = m1t1.lesson.resources[0];
    const url = await signedUrlFor("course-resources", res.file_path, res.file_name);
    expect(url).toMatch(/^\/api\/files\/course-resources\//);
    expect(url).toContain("download=");
    const cat = await categoryForLesson(course!.id, m1t1.module.id);
    expect(cat?.slug).toBe("foundations-of-family-wellness");
    expect(state!.lessons[m1t1.lesson.id].xpEarned).toBe(50);
    expect(state!.lessons[m1t1.lesson.id].xpTotal).toBe(100);

    // Quiz wiring: M0 survey sub-item, M7T5 review step
    const m0 = findLessonBySlug(state!.tree, "m0")!;
    const m0step = m0.lesson.action_steps[0];
    expect(m0step.link).toEqual({ type: "survey", quiz_key: "pre-course-survey" });
    expect(m0step.sub_items?.find((s) => s.key === "survey")).toBeTruthy();
    const m7t5 = findLessonBySlug(state!.tree, "m7t5")!;
    expect(m7t5.lesson.quiz_key).toBe("pre-course-survey");
    const review = m7t5.lesson.action_steps.find((s) => s.link.type === "none" && /survey|quiz/i.test(s.label));
    expect(review?.label).toBe("Review Survey & Adjust Goals");
    const defs = await db.from("quiz_definitions").list({ where: { key: ["wellness-quiz", "pre-course-survey"] } });
    expect(defs.map((d) => d.key).sort()).toEqual(["pre-course-survey", "wellness-quiz"]);
    expect(await getQuizResponses(learner!.id, "pre-course-survey")).toEqual([]);

    // Discussion query shape
    const posts = await db.from("forum_posts").list({ where: { lesson_id: m1t1.lesson.id, course_id: course!.id, status: "visible" }, orderBy: ["created_at", "desc"], limit: 6 });
    expect(Array.isArray(posts)).toBe(true);

    // Admin without enrolment sees everything unlocked; partner has access.
    const admin = await db.from("profiles").findOne({ email: "cynthia@demo.cradleyourcravings.com" });
    const adminState = await getLearnerCourseState(admin!.id, course!.id, "admin");
    expect(adminState!.access.via).toBe("admin");
    expect(moduleUnlock(adminState!, m3).unlocked).toBe(true);
    expect(adminState!.lessons[m3t1.lesson.id].unlocked).toBe(true);
    expect(adminState!.next).toBeNull();
  }, 60_000);
});
