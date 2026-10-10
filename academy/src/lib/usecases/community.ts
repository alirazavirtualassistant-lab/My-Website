import "server-only";
import { getServices } from "@/services";
import type { ForumCategory, ForumPost, ForumReply, Profile } from "@/lib/types";
import { newId, nowIso } from "@/lib/utils";
import { getLearnerAccess } from "./access";

export interface PostAuthor {
  id: string | null;
  name: string;
  avatar_url: string | null;
  is_instructor: boolean;
  is_me: boolean;
}

export function presentAuthor(profile: Profile | null | undefined, anonymous: boolean, viewerId: string | null, viewerIsAdmin: boolean): PostAuthor {
  if (!profile || profile.deleted_at) return { id: null, name: "Deleted member", avatar_url: null, is_instructor: false, is_me: false };
  const isMe = profile.id === viewerId;
  if (anonymous && !isMe && !viewerIsAdmin) return { id: null, name: "Anonymous member", avatar_url: null, is_instructor: false, is_me: false };
  return {
    id: profile.id,
    name: anonymous ? `${profile.name} (posted anonymously)` : profile.name,
    avatar_url: anonymous ? null : profile.avatar_url,
    is_instructor: profile.role === "admin",
    is_me: isMe,
  };
}

export async function listCategories(courseId: string): Promise<ForumCategory[]> {
  const { db } = await getServices();
  return db.from("forum_categories").list({ where: { course_id: courseId }, orderBy: ["position", "asc"] });
}

export async function requireCommunityAccess(userId: string, courseId: string, role?: string) {
  const access = await getLearnerAccess(userId, courseId, role);
  if (!access.allowed) throw new Error("You need to be enrolled to take part in this community");
  return access;
}

export async function createPost(input: { userId: string; role?: string; courseId: string; categoryId: string; lessonId: string | null; title: string; body: string; anonymous: boolean; imagePath: string | null }): Promise<ForumPost> {
  const { db } = await getServices();
  await requireCommunityAccess(input.userId, input.courseId, input.role);
  const title = input.title.trim().slice(0, 160);
  const body = input.body.trim().slice(0, 10_000);
  if (title.length < 3) throw new Error("Please add a title");
  if (body.length < 1) throw new Error("Please write something");
  const now = nowIso();
  return db.from("forum_posts").insert({
    id: newId(),
    category_id: input.categoryId,
    course_id: input.courseId,
    lesson_id: input.lessonId,
    user_id: input.userId,
    title,
    body,
    image_path: input.imagePath,
    anonymous: input.anonymous,
    pinned: false,
    locked: false,
    like_count: 0,
    reply_count: 0,
    status: "visible",
    created_at: now,
    updated_at: now,
  });
}

export async function createReply(input: { userId: string; role?: string; postId: string; body: string; anonymous: boolean }): Promise<ForumReply> {
  const { db } = await getServices();
  const post = await db.from("forum_posts").get(input.postId);
  if (!post || post.status !== "visible") throw new Error("Post not found");
  if (post.locked) throw new Error("This thread is locked");
  await requireCommunityAccess(input.userId, post.course_id, input.role);
  const body = input.body.trim().slice(0, 5000);
  if (!body) throw new Error("Please write something");
  const now = nowIso();
  const reply = await db.from("forum_replies").insert({ id: newId(), post_id: post.id, user_id: input.userId, body, anonymous: input.anonymous, like_count: 0, status: "visible", created_at: now });
  await db.from("forum_posts").update(post.id, { reply_count: post.reply_count + 1, updated_at: now });
  return reply;
}

export async function toggleLike(userId: string, target: { postId?: string; replyId?: string }): Promise<{ liked: boolean; count: number }> {
  const { db } = await getServices();
  const likes = db.from("forum_likes");
  const where = target.postId ? { user_id: userId, post_id: target.postId } : { user_id: userId, reply_id: target.replyId! };
  const existing = await likes.findOne(where);
  if (existing) {
    await likes.delete(existing.id);
  } else {
    await likes.insert({ id: newId(), user_id: userId, post_id: target.postId ?? null, reply_id: target.replyId ?? null, created_at: nowIso() });
  }
  const count = await likes.count(target.postId ? { post_id: target.postId } : { reply_id: target.replyId! });
  if (target.postId) await db.from("forum_posts").update(target.postId, { like_count: count });
  if (target.replyId) await db.from("forum_replies").update(target.replyId, { like_count: count });
  return { liked: !existing, count };
}

export async function reportContent(userId: string, target: { postId?: string; replyId?: string }, reason: string) {
  const { db } = await getServices();
  await db.from("forum_reports").insert({ id: newId(), reporter_user_id: userId, post_id: target.postId ?? null, reply_id: target.replyId ?? null, reason: reason.trim().slice(0, 500), status: "open", created_at: nowIso(), resolved_at: null });
}

/** Resolves the right thread for an action step's "Share in Forum" link: the lesson's module category. */
export async function categoryForLesson(courseId: string, moduleId: string): Promise<ForumCategory | null> {
  const { db } = await getServices();
  const cats = await db.from("forum_categories").list({ where: { course_id: courseId } });
  return cats.find((c) => c.module_id === moduleId) ?? cats.find((c) => c.module_id === null) ?? null;
}
