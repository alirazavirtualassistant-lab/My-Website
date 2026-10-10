import "server-only";
import { notFound } from "next/navigation";
import { getServices } from "@/services";
import { isAdminRole, requireUser, type Session } from "@/lib/auth/session";
import { getCourseBySlug, lessonSlug } from "@/lib/usecases/catalog";
import { listCategories, presentAuthor, requireCommunityAccess, type PostAuthor } from "@/lib/usecases/community";
import { truncate } from "@/lib/utils";
import type { Course, ForumCategory, ForumPost, Lesson, Profile } from "@/lib/types";
import type { AuthorView, CategoryView, LessonChipView, PostRowView } from "@/components/community/types";
import { categoryHref, postHref } from "@/components/community/types";

export interface LoadedCommunity {
  session: Session;
  course: Course;
  /** False when the learner is not enrolled (pages render a locked state instead of throwing). */
  allowed: boolean;
  viewerIsAdmin: boolean;
}

/**
 * Session + course + community access for `/community/[course]/**`.
 * 404s for unknown, draft or archived courses. Access is reported, not thrown,
 * so pages can show a calm "enrol to join" state.
 */
export async function loadCommunity(slug: string, nextPath: string): Promise<LoadedCommunity> {
  const session = await requireUser(nextPath);
  const course = await getCourseBySlug(slug);
  if (!course || course.status === "archived" || course.status === "draft") notFound();
  let allowed = true;
  try {
    await requireCommunityAccess(session.user_id, course.id, session.role);
  } catch {
    allowed = false;
  }
  return { session, course, allowed, viewerIsAdmin: isAdminRole(session.role) };
}

export function toAuthorView(a: PostAuthor): AuthorView {
  return { id: a.id, name: a.name, avatarUrl: a.avatar_url, isInstructor: a.is_instructor, isMe: a.is_me };
}

/** Profiles for a set of user ids, as a map (missing/deleted ones fall through to "Deleted member"). */
export async function loadProfiles(userIds: string[]): Promise<Map<string, Profile>> {
  const ids = Array.from(new Set(userIds)).filter(Boolean);
  if (ids.length === 0) return new Map();
  const { db } = await getServices();
  const rows = await db.from("profiles").list({ where: { id: ids } });
  return new Map(rows.map((p) => [p.id, p]));
}

/** Lesson chips for a course keyed by lesson id. */
export async function loadLessonChips(course: Course): Promise<Map<string, LessonChipView>> {
  const { db } = await getServices();
  const lessons = await db.from("lessons").list({ where: { course_id: course.id } });
  return new Map(lessons.map((l) => [l.id, lessonChip(course.slug, l)]));
}

export function lessonChip(courseSlug: string, lesson: Pick<Lesson, "id" | "code" | "title">): LessonChipView {
  return { id: lesson.id, code: lesson.code, title: lesson.title, href: `/learn/${courseSlug}/${lessonSlug(lesson)}` };
}

/**
 * Resolves a `?lesson=` parameter (lesson code "M1T1", URL slug "bonus-t2a"
 * or a raw id) to a lesson of this course. Returns null when nothing matches.
 */
export async function resolveLessonParam(courseId: string, raw: string | undefined): Promise<Lesson | null> {
  const value = (raw ?? "").trim();
  if (!value || value.length > 80) return null;
  const { db } = await getServices();
  const lessons = await db.from("lessons").list({ where: { course_id: courseId } });
  const lower = value.toLowerCase();
  const asCode = lower.replace(/-/g, "_");
  return lessons.find((l) => l.id === value) ?? lessons.find((l) => l.code.toLowerCase() === lower || l.code.toLowerCase() === asCode) ?? null;
}

export interface PostRowInputs {
  courseSlug: string;
  viewerId: string;
  viewerIsAdmin: boolean;
  profiles: Map<string, Profile>;
  lessons: Map<string, LessonChipView>;
  categories: Map<string, ForumCategory>;
  /** Show the category chip (search results, pinned lists). */
  withCategory?: boolean;
}

export function toPostRow(post: ForumPost, input: PostRowInputs): PostRowView {
  const author = toAuthorView(presentAuthor(input.profiles.get(post.user_id), post.anonymous, input.viewerId, input.viewerIsAdmin));
  const category = input.withCategory ? input.categories.get(post.category_id) : undefined;
  return {
    id: post.id,
    title: post.title,
    excerpt: truncate(post.body.replace(/\s+/g, " ").trim(), 150),
    href: postHref(input.courseSlug, post.id),
    author,
    createdAt: post.created_at,
    replyCount: post.reply_count,
    likeCount: post.like_count,
    pinned: post.pinned,
    locked: post.locked,
    anonymous: post.anonymous,
    lesson: post.lesson_id ? (input.lessons.get(post.lesson_id) ?? null) : null,
    category: category ? { title: category.title, href: categoryHref(input.courseSlug, category.slug) } : null,
  };
}

/** Categories with visible-post counts and last activity, in position order. */
export async function loadCategoryViews(course: Course, posts: ForumPost[]): Promise<{ categories: ForumCategory[]; views: CategoryView[] }> {
  const categories = await listCategories(course.id);
  const views = categories.map((c) => {
    const mine = posts.filter((p) => p.category_id === c.id);
    const last = mine.reduce<string | null>((acc, p) => (!acc || p.updated_at > acc ? p.updated_at : acc), null);
    return { id: c.id, slug: c.slug, title: c.title, description: c.description, href: categoryHref(course.slug, c.slug), postCount: mine.length, lastActivityAt: last };
  });
  return { categories, views };
}

/** Every visible post of a course, newest first (forum scale: joined in code). */
export async function loadVisiblePosts(courseId: string): Promise<ForumPost[]> {
  const { db } = await getServices();
  return db.from("forum_posts").list({ where: { course_id: courseId, status: "visible" }, orderBy: ["created_at", "desc"] });
}

/** Sort helper shared by the category page: pinned first, then newest or most liked. */
export function sortPosts(posts: ForumPost[], sort: "new" | "top"): ForumPost[] {
  const byTime = (a: ForumPost, b: ForumPost) => (a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0);
  return [...posts].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (sort === "top" && a.like_count !== b.like_count) return b.like_count - a.like_count;
    return byTime(a, b);
  });
}

export function parsePage(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n >= 1 ? Math.min(n, 10_000) : 1;
}

export function parseSort(raw: string | undefined): "new" | "top" {
  return raw === "top" ? "top" : "new";
}

export function parseQuery(raw: string | undefined): string {
  return (raw ?? "").trim().slice(0, 120);
}
