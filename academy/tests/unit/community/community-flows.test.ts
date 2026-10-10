/**
 * End-to-end over the mock store: boots the demo seed (Baby Steps, demo
 * learner/partner/admin, the pinned welcome post), then drives the community
 * loader helpers and Server Actions the way the pages do. Only `next/*` and
 * the session helper are mocked.
 */
import { beforeAll, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Session } from "@/services/types";

const ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "cyc-community-"));
process.env.DEMO_DATA_DIR = ROOT;
process.env.DEMO_MODE = "1";
process.env.AUTH_SECRET = "test-secret-not-for-production";
process.env.NEXT_PUBLIC_SITE_URL = "https://academy.example.com";

let current: Session | null = null;
const session = (user_id: string, role: Session["role"], email = `${role}@example.com`): Session => ({ user_id, email, role, provider: "mock", remember: false });

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined, getAll: () => [], has: () => false, set() {}, delete() {} }),
  headers: async () => new Headers(),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw Object.assign(new Error("NEXT_REDIRECT"), { digest: `NEXT_REDIRECT;push;${url}` });
  },
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));
vi.mock("@/lib/auth/session", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/auth/session")>();
  return {
    ...real,
    getSession: async () => current,
    requireUser: async () => {
      if (!current) throw new Error("NEXT_REDIRECT");
      return current;
    },
  };
});

const { ensureBootstrapped } = await import("@/lib/usecases/demo");
const { getServices } = await import("@/services");
const { demoAccount } = await import("@/services/mock/seed");
const load = await import("@/app/(learner)/community/[course]/_lib/load");
const actions = await import("@/app/(learner)/community/[course]/actions");

let learnerId = "";
let partnerId = "";
let adminId = "";
let courseId = "";

function form(entries: Record<string, string | File>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) fd.append(k, v);
  return fd;
}

function redirectTarget(err: unknown): string | null {
  const digest = (err as { digest?: string })?.digest ?? "";
  return digest.startsWith("NEXT_REDIRECT") ? digest.split(";")[2] : null;
}

beforeAll(async () => {
  await ensureBootstrapped();
  const { db } = await getServices();
  const learner = await db.from("profiles").findOne({ email: demoAccount("learner").email });
  const partner = await db.from("profiles").findOne({ email: demoAccount("partner").email });
  const admin = await db.from("profiles").findOne({ email: demoAccount("admin").email });
  const course = await db.from("courses").findOne({ slug: "baby-steps" });
  if (!learner || !partner || !admin || !course) throw new Error("demo seed did not produce the expected rows");
  learnerId = learner.id;
  partnerId = partner.id;
  adminId = admin.id;
  courseId = course.id;
});

describe("loadCommunity + helpers", () => {
  it("allows the enrolled demo learner and reports the seeded categories", async () => {
    current = session(learnerId, "learner");
    const loaded = await load.loadCommunity("baby-steps", "/community/baby-steps");
    expect(loaded.allowed).toBe(true);
    expect(loaded.viewerIsAdmin).toBe(false);
    const posts = await load.loadVisiblePosts(courseId);
    const { categories, views } = await load.loadCategoryViews(loaded.course, posts);
    expect(categories).toHaveLength(12);
    expect(views.map((v) => v.slug).slice(0, 3)).toEqual(["general", "introductions", "foundations-of-family-wellness"]);
    const intro = views.find((v) => v.slug === "introductions")!;
    expect(intro.postCount).toBe(1);
    expect(intro.lastActivityAt).toBeTruthy();
    expect(intro.href).toBe("/community/baby-steps/introductions");
  });

  it("locks out a member without an enrolment (no throw)", async () => {
    current = session("not-enrolled-user", "learner");
    const loaded = await load.loadCommunity("baby-steps", "/community/baby-steps");
    expect(loaded.allowed).toBe(false);
  });

  it("lets the admin in without an enrolment", async () => {
    current = session(adminId, "admin");
    const loaded = await load.loadCommunity("baby-steps", "/community/baby-steps");
    expect(loaded.allowed).toBe(true);
    expect(loaded.viewerIsAdmin).toBe(true);
  });

  it("resolves ?lesson= by code, URL slug or id and ignores junk", async () => {
    const byCode = await load.resolveLessonParam(courseId, "M1T1");
    expect(byCode?.code).toBe("M1T1");
    expect((await load.resolveLessonParam(courseId, "m1t1"))?.id).toBe(byCode!.id);
    expect((await load.resolveLessonParam(courseId, "bonus-t2a"))?.code).toBe("BONUS_T2a");
    expect((await load.resolveLessonParam(courseId, byCode!.id))?.code).toBe("M1T1");
    expect(await load.resolveLessonParam(courseId, "nope")).toBeNull();
    expect(await load.resolveLessonParam(courseId, undefined)).toBeNull();
    expect(load.lessonChip("baby-steps", byCode!).href).toBe("/learn/baby-steps/m1t1");
  });

  it("sorts pinned first, then by likes or recency", () => {
    const base = { category_id: "c", course_id: courseId, lesson_id: null, user_id: "u", body: "", image_path: null, anonymous: false, locked: false, reply_count: 0, status: "visible" as const, updated_at: "" };
    const a = { ...base, id: "a", title: "a", pinned: false, like_count: 1, created_at: "2026-01-03" };
    const b = { ...base, id: "b", title: "b", pinned: false, like_count: 5, created_at: "2026-01-01" };
    const c = { ...base, id: "c", title: "c", pinned: true, like_count: 0, created_at: "2026-01-02" };
    expect(load.sortPosts([a, b, c], "new").map((p) => p.id)).toEqual(["c", "a", "b"]);
    expect(load.sortPosts([a, b, c], "top").map((p) => p.id)).toEqual(["c", "b", "a"]);
    expect(load.parsePage("3")).toBe(3);
    expect(load.parsePage("-1")).toBe(1);
    expect(load.parsePage(undefined)).toBe(1);
    expect(load.parseSort("top")).toBe("top");
    expect(load.parseSort("whatever")).toBe("new");
  });
});

describe("community actions (demo learner)", () => {
  let postId = "";
  let replyId = "";

  it("rejects a post from a member who is not enrolled", async () => {
    current = session("not-enrolled-user", "learner");
    const { db } = await getServices();
    const cat = (await db.from("forum_categories").findOne({ course_id: courseId, slug: "general" }))!;
    const state = await actions.createPostAction({ status: "idle" }, form({ courseId, categoryId: cat.id, title: "Hello there", body: "Hi" }));
    expect(state.status).toBe("error");
    expect(state.summary?.[0]).toMatch(/enrolled/i);
  });

  it("validates title/body/category inline", async () => {
    current = session(learnerId, "learner");
    const state = await actions.createPostAction({ status: "idle" }, form({ courseId, categoryId: "", title: "Hi", body: "" }));
    expect(state.status).toBe("error");
    expect(state.errors).toMatchObject({ categoryId: expect.any(String), title: expect.any(String), body: expect.any(String) });
  });

  it("creates an anonymous post with a lesson tag and an image, then redirects to it", async () => {
    current = session(learnerId, "learner");
    const { db } = await getServices();
    const cat = (await db.from("forum_categories").findOne({ course_id: courseId, slug: "foundations-of-family-wellness" }))!;
    const lesson = (await load.resolveLessonParam(courseId, "M1T1"))!;
    const png = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])], "my-plate.png", { type: "image/png" });
    let target: string | null = null;
    try {
      await actions.createPostAction({ status: "idle" }, form({ courseId, categoryId: cat.id, lessonId: lesson.id, title: "My first week", body: "This week was hard.\n\nBut I showed up.", anonymous: "on", image: png }));
    } catch (err) {
      target = redirectTarget(err);
    }
    expect(target).toMatch(/^\/community\/baby-steps\/post\//);
    postId = target!.split("/").pop()!;
    const post = (await db.from("forum_posts").get(postId))!;
    expect(post).toMatchObject({ user_id: learnerId, category_id: cat.id, lesson_id: lesson.id, anonymous: true, status: "visible", title: "My first week" });
    expect(post.image_path).toMatch(new RegExp(`^${learnerId}/forum/`));
    const { storage } = await getServices();
    expect(await storage.exists({ bucket: "learner-uploads", path: post.image_path! })).toBe(true);
  });

  it("presents the anonymous author differently to a peer, the author and an admin", async () => {
    const { db } = await getServices();
    const post = (await db.from("forum_posts").get(postId))!;
    const course = (await db.from("courses").get(courseId))!;
    const profiles = await load.loadProfiles([post.user_id]);
    const lessons = await load.loadLessonChips(course);
    const categories = new Map((await db.from("forum_categories").list({ where: { course_id: courseId } })).map((c) => [c.id, c]));
    const peer = load.toPostRow(post, { courseSlug: "baby-steps", viewerId: partnerId, viewerIsAdmin: false, profiles, lessons, categories, withCategory: true });
    expect(peer.author).toMatchObject({ id: null, name: "Anonymous member", isMe: false, avatarUrl: null });
    expect(peer.lesson).toMatchObject({ code: "M1T1", href: "/learn/baby-steps/m1t1" });
    expect(peer.category?.href).toBe("/community/baby-steps/foundations-of-family-wellness");
    expect(peer.excerpt).toBe("This week was hard. But I showed up.");
    const me = load.toPostRow(post, { courseSlug: "baby-steps", viewerId: learnerId, viewerIsAdmin: false, profiles, lessons, categories });
    expect(me.author.isMe).toBe(true);
    expect(me.author.name).toMatch(/\(posted anonymously\)$/);
    const admin = load.toPostRow(post, { courseSlug: "baby-steps", viewerId: adminId, viewerIsAdmin: true, profiles, lessons, categories });
    expect(admin.author.id).toBe(learnerId);
    expect(admin.category).toBeNull();
  });

  it("replies (partner), bumps the reply count and toggles likes both ways", async () => {
    current = session(partnerId, "learner");
    const reply = await actions.createReplyAction({ status: "idle" }, form({ postId, body: "Me too. Proud of you.", anonymous: "" }));
    expect(reply.status).toBe("success");
    const { db } = await getServices();
    expect((await db.from("forum_posts").get(postId))!.reply_count).toBe(1);
    replyId = (await db.from("forum_replies").findOne({ post_id: postId }))!.id;

    const liked = await actions.toggleLikeAction({ postId });
    expect(liked).toEqual({ ok: true, liked: true, count: 1 });
    expect((await db.from("forum_posts").get(postId))!.like_count).toBe(1);
    const unliked = await actions.toggleLikeAction({ postId });
    expect(unliked).toEqual({ ok: true, liked: false, count: 0 });
    const replyLike = await actions.toggleLikeAction({ replyId });
    expect(replyLike).toEqual({ ok: true, liked: true, count: 1 });
    expect(await actions.toggleLikeAction({})).toEqual({ ok: false, error: "Bad input" });
  });

  it("files a report for moderation", async () => {
    current = session(partnerId, "learner");
    expect(await actions.reportContentAction({ postId, reason: "x" })).toMatchObject({ ok: false });
    expect(await actions.reportContentAction({ postId, reason: "This feels like medical advice." })).toEqual({ ok: true });
    const { db } = await getServices();
    const reports = await db.from("forum_reports").list({ where: { post_id: postId } });
    expect(reports).toHaveLength(1);
    expect(reports[0]).toMatchObject({ reporter_user_id: partnerId, status: "open", reason: "This feels like medical advice." });
  });

  it("only lets the owner edit or remove, and keeps counts honest", async () => {
    current = session(partnerId, "learner");
    const notMine = await actions.updatePostAction({ status: "idle" }, form({ postId, title: "Hijacked", body: "nope" }));
    expect(notMine.status).toBe("error");
    expect(notMine.summary?.[0]).toMatch(/your own/i);
    expect(await actions.removePostAction({ postId })).toMatchObject({ ok: false });

    current = session(learnerId, "learner");
    const edited = await actions.updatePostAction({ status: "idle" }, form({ postId, title: "My first week, revisited", body: "Still showing up." }));
    expect(edited.status).toBe("success");
    const { db } = await getServices();
    expect((await db.from("forum_posts").get(postId))!.title).toBe("My first week, revisited");

    expect(await actions.removeReplyAction({ replyId })).toMatchObject({ ok: false }); // not the learner's reply
    current = session(partnerId, "learner");
    expect(await actions.removeReplyAction({ replyId })).toEqual({ ok: true, href: null });
    expect((await db.from("forum_replies").get(replyId))!.status).toBe("removed");
    expect((await db.from("forum_posts").get(postId))!.reply_count).toBe(0);

    current = session(learnerId, "learner");
    const removed = await actions.removePostAction({ postId });
    expect(removed).toEqual({ ok: true, href: "/community/baby-steps/foundations-of-family-wellness" });
    expect((await db.from("forum_posts").get(postId))!.status).toBe("removed");
    expect(await actions.toggleLikeAction({ postId })).toMatchObject({ ok: false });
  });

  it("refuses replies on a locked thread", async () => {
    current = session(learnerId, "learner");
    const { db } = await getServices();
    const welcome = (await db.from("forum_posts").findOne({ course_id: courseId, pinned: true }))!;
    await db.from("forum_posts").update(welcome.id, { locked: true });
    const state = await actions.createReplyAction({ status: "idle" }, form({ postId: welcome.id, body: "Hello!" }));
    expect(state.status).toBe("error");
    expect(state.summary?.[0]).toMatch(/locked/i);
    await db.from("forum_posts").update(welcome.id, { locked: false });
  });
});
