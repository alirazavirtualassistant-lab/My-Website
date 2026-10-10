"use server";

/**
 * Server Actions for the course community. Every action re-checks the
 * session, validates input with zod and delegates to the community use cases.
 * Ownership checks for edit/remove live here (the use cases have no notion of
 * an editor yet); moderation screens are the admin panel's job.
 */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { getServices } from "@/services";
import { getCourseById } from "@/lib/usecases/catalog";
import { createPost, createReply, reportContent, requireCommunityAccess, toggleLike } from "@/lib/usecases/community";
import { storeLearnerUpload } from "@/lib/usecases/uploads";
import { nowIso } from "@/lib/utils";
import type { ForumPost, ForumReply } from "@/lib/types";
import type { CommunityFormState, LikeResult, RemoveResult, SimpleResult } from "@/components/community/types";
import { categoryHref, postHref } from "@/components/community/types";

const id = z.string().trim().min(1).max(80);
const checkbox = z.preprocess((v) => v === "on" || v === "true" || v === "1" || v === true, z.boolean());

const TITLE_MIN = 3;
const TITLE_MAX = 160;
const BODY_MAX = 10_000;
const REPLY_MAX = 5_000;

function message(err: unknown, fallback: string): string {
  const m = err instanceof Error ? err.message : "";
  return m || fallback;
}

function errorState(errors: Record<string, string>, summary?: string[]): CommunityFormState {
  return { status: "error", errors, summary: summary ?? Object.values(errors) };
}

function formError(msg: string): CommunityFormState {
  return errorState({ form: msg }, [msg]);
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function revalidateCommunity() {
  revalidatePath("/community", "layout");
  revalidatePath("/learn", "layout");
}

async function visiblePost(postId: string): Promise<ForumPost | null> {
  const { db } = await getServices();
  const post = await db.from("forum_posts").get(postId);
  return post && post.status === "visible" ? post : null;
}

async function visibleReply(replyId: string): Promise<{ reply: ForumReply; post: ForumPost } | null> {
  const { db } = await getServices();
  const reply = await db.from("forum_replies").get(replyId);
  if (!reply || reply.status !== "visible") return null;
  const post = await db.from("forum_posts").get(reply.post_id);
  if (!post || post.status !== "visible") return null;
  return { reply, post };
}

async function courseSlugFor(courseId: string): Promise<string | null> {
  const course = await getCourseById(courseId);
  return course?.slug ?? null;
}

// ---------------------------------------------------------------------------
// New post
// ---------------------------------------------------------------------------

const newPostSchema = z.object({
  courseId: id,
  categoryId: z.string({ message: "Please choose a category." }).trim().min(1, "Please choose a category."),
  lessonId: z.string().trim().max(80).optional().default(""),
  title: z
    .string({ message: "Please add a title." })
    .trim()
    .min(TITLE_MIN, "Please add a title (at least 3 characters).")
    .max(TITLE_MAX, `Please keep the title under ${TITLE_MAX} characters.`),
  body: z
    .string({ message: "Please write something." })
    .trim()
    .min(1, "Please write something — a sentence is plenty.")
    .max(BODY_MAX, `Please keep your post under ${BODY_MAX.toLocaleString("en-US")} characters.`),
  anonymous: checkbox,
});

export async function createPostAction(_prev: CommunityFormState, formData: FormData): Promise<CommunityFormState> {
  const session = await requireUser("/community");

  const parsed = newPostSchema.safeParse({
    courseId: formData.get("courseId"),
    categoryId: formData.get("categoryId"),
    lessonId: formData.get("lessonId") ?? "",
    title: formData.get("title"),
    body: formData.get("body"),
    anonymous: formData.get("anonymous"),
  });
  if (!parsed.success) return errorState(fieldErrors(parsed.error));
  const input = parsed.data;

  const { db } = await getServices();
  const course = await getCourseById(input.courseId);
  if (!course || course.status === "archived" || course.status === "draft") return formError("That course is not available.");
  try {
    await requireCommunityAccess(session.user_id, course.id, session.role);
  } catch (err) {
    return formError(message(err, "You need to be enrolled to post here."));
  }

  const category = await db.from("forum_categories").get(input.categoryId);
  if (!category || category.course_id !== course.id) return errorState({ categoryId: "Please choose a category from the list." });

  let lessonId: string | null = null;
  if (input.lessonId) {
    const lesson = await db.from("lessons").get(input.lessonId);
    if (!lesson || lesson.course_id !== course.id) return errorState({ lessonId: "That lesson could not be found. Remove the lesson tag and try again." });
    lessonId = lesson.id;
  }

  let imagePath: string | null = null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    try {
      imagePath = (await storeLearnerUpload(session.user_id, "forum", file, "image")).path;
    } catch (err) {
      return errorState({ image: message(err, "We couldn't save that image. Please try another one.") });
    }
  }

  let post: ForumPost;
  try {
    post = await createPost({
      userId: session.user_id,
      role: session.role,
      courseId: course.id,
      categoryId: category.id,
      lessonId,
      title: input.title,
      body: input.body,
      anonymous: input.anonymous,
      imagePath,
    });
  } catch (err) {
    return formError(message(err, "We couldn't publish your post just now. Please try again."));
  }
  revalidateCommunity();
  redirect(postHref(course.slug, post.id));
}

// ---------------------------------------------------------------------------
// Replies
// ---------------------------------------------------------------------------

const replySchema = z.object({
  postId: id,
  body: z
    .string({ message: "Please write something." })
    .trim()
    .min(1, "Please write something — a sentence is plenty.")
    .max(REPLY_MAX, `Please keep your reply under ${REPLY_MAX.toLocaleString("en-US")} characters.`),
  anonymous: checkbox,
});

export async function createReplyAction(_prev: CommunityFormState, formData: FormData): Promise<CommunityFormState> {
  const session = await requireUser("/community");
  const parsed = replySchema.safeParse({ postId: formData.get("postId"), body: formData.get("body"), anonymous: formData.get("anonymous") });
  if (!parsed.success) return errorState(fieldErrors(parsed.error));
  try {
    await createReply({ userId: session.user_id, role: session.role, postId: parsed.data.postId, body: parsed.data.body, anonymous: parsed.data.anonymous });
  } catch (err) {
    return formError(message(err, "We couldn't post your reply just now. Please try again."));
  }
  revalidateCommunity();
  return { status: "success", message: "Reply posted. Thank you for showing up.", stamp: Date.now() };
}

const editReplySchema = z.object({ replyId: id, body: replySchema.shape.body });

export async function updateReplyAction(_prev: CommunityFormState, formData: FormData): Promise<CommunityFormState> {
  const session = await requireUser("/community");
  const parsed = editReplySchema.safeParse({ replyId: formData.get("replyId"), body: formData.get("body") });
  if (!parsed.success) return errorState(fieldErrors(parsed.error));
  const found = await visibleReply(parsed.data.replyId);
  if (!found) return formError("That reply is no longer available.");
  if (found.reply.user_id !== session.user_id) return formError("You can only edit your own replies.");
  if (found.post.locked) return formError("This thread is locked, so replies can't be edited.");
  const { db } = await getServices();
  await db.from("forum_replies").update(found.reply.id, { body: parsed.data.body });
  revalidateCommunity();
  return { status: "success", message: "Reply updated.", stamp: Date.now() };
}

export async function removeReplyAction(input: { replyId: string }): Promise<RemoveResult> {
  const session = await requireUser("/community");
  const parsed = z.object({ replyId: id }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "Bad input" };
  const found = await visibleReply(parsed.data.replyId);
  if (!found) return { ok: false, error: "That reply is no longer available." };
  if (found.reply.user_id !== session.user_id) return { ok: false, error: "You can only remove your own replies." };
  const { db } = await getServices();
  await db.from("forum_replies").update(found.reply.id, { status: "removed" });
  await db.from("forum_posts").update(found.post.id, { reply_count: Math.max(0, found.post.reply_count - 1), updated_at: nowIso() });
  revalidateCommunity();
  return { ok: true, href: null };
}

// ---------------------------------------------------------------------------
// Edit / remove own post
// ---------------------------------------------------------------------------

const editPostSchema = z.object({ postId: id, title: newPostSchema.shape.title, body: newPostSchema.shape.body });

export async function updatePostAction(_prev: CommunityFormState, formData: FormData): Promise<CommunityFormState> {
  const session = await requireUser("/community");
  const parsed = editPostSchema.safeParse({ postId: formData.get("postId"), title: formData.get("title"), body: formData.get("body") });
  if (!parsed.success) return errorState(fieldErrors(parsed.error));
  const post = await visiblePost(parsed.data.postId);
  if (!post) return formError("That post is no longer available.");
  if (post.user_id !== session.user_id) return formError("You can only edit your own posts.");
  if (post.locked) return formError("This thread is locked, so it can't be edited.");
  const { db } = await getServices();
  await db.from("forum_posts").update(post.id, { title: parsed.data.title, body: parsed.data.body, updated_at: nowIso() });
  revalidateCommunity();
  return { status: "success", message: "Post updated.", stamp: Date.now() };
}

export async function removePostAction(input: { postId: string }): Promise<RemoveResult> {
  const session = await requireUser("/community");
  const parsed = z.object({ postId: id }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "Bad input" };
  const post = await visiblePost(parsed.data.postId);
  if (!post) return { ok: false, error: "That post is no longer available." };
  if (post.user_id !== session.user_id) return { ok: false, error: "You can only remove your own posts." };
  const { db } = await getServices();
  await db.from("forum_posts").update(post.id, { status: "removed", updated_at: nowIso() });
  const [slug, category] = await Promise.all([courseSlugFor(post.course_id), db.from("forum_categories").get(post.category_id)]);
  revalidateCommunity();
  const href = slug ? (category ? categoryHref(slug, category.slug) : `/community/${slug}`) : "/community";
  return { ok: true, href };
}

// ---------------------------------------------------------------------------
// Likes + reports
// ---------------------------------------------------------------------------

const targetSchema = z
  .object({ postId: id.optional(), replyId: id.optional() })
  .refine((t) => Boolean(t.postId) !== Boolean(t.replyId), { message: "Pick one target" });

async function resolveTarget(target: { postId?: string; replyId?: string }): Promise<{ courseId: string; locked: boolean } | null> {
  if (target.postId) {
    const post = await visiblePost(target.postId);
    return post ? { courseId: post.course_id, locked: post.locked } : null;
  }
  const found = await visibleReply(target.replyId!);
  return found ? { courseId: found.post.course_id, locked: found.post.locked } : null;
}

export async function toggleLikeAction(input: { postId?: string; replyId?: string }): Promise<LikeResult> {
  const session = await requireUser("/community");
  const parsed = targetSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Bad input" };
  const target = await resolveTarget(parsed.data);
  if (!target) return { ok: false, error: "That post is no longer available." };
  try {
    await requireCommunityAccess(session.user_id, target.courseId, session.role);
    const res = await toggleLike(session.user_id, parsed.data);
    revalidateCommunity();
    return { ok: true, liked: res.liked, count: res.count };
  } catch (err) {
    return { ok: false, error: message(err, "We couldn't save that just now.") };
  }
}

const reportSchema = z.object({
  reason: z
    .string({ message: "Please tell us what's wrong." })
    .trim()
    .min(3, "Please tell us what's wrong in a few words.")
    .max(500, "Please keep the reason under 500 characters."),
});

export async function reportContentAction(input: { postId?: string; replyId?: string; reason: string }): Promise<SimpleResult> {
  const session = await requireUser("/community");
  const target = targetSchema.safeParse({ postId: input.postId, replyId: input.replyId });
  if (!target.success) return { ok: false, error: "Bad input" };
  const parsed = reportSchema.safeParse({ reason: input.reason });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please tell us what's wrong." };
  const resolved = await resolveTarget(target.data);
  if (!resolved) return { ok: false, error: "That post is no longer available." };
  try {
    await requireCommunityAccess(session.user_id, resolved.courseId, session.role);
    await reportContent(session.user_id, target.data, parsed.data.reason);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: message(err, "We couldn't send that report just now.") };
  }
}
