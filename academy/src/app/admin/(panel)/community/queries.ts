import "server-only";
import { getServices } from "@/services";
import type { Course, ForumCategory, ForumPost, ForumReply, ForumReport, Profile } from "@/lib/types";
import { truncate } from "@/lib/utils";

export type ModerationTab = "reports" | "posts" | "replies";
export type StatusFilter = "all" | "visible" | "hidden" | "removed";

export interface ModerationFilters {
  tab: ModerationTab;
  courseId: string | null;
  status: StatusFilter;
  authorId: string | null;
}

export interface AuthorInfo {
  id: string;
  name: string;
  role: Profile["role"] | null;
  deleted: boolean;
}

export interface ReportRow extends ForumReport {
  reporter: AuthorInfo;
  target: { kind: "post" | "reply"; id: string; excerpt: string; title: string | null; author: AuthorInfo; status: ForumPost["status"]; course_id: string } | null;
}

export interface PostRow extends ForumPost {
  author: AuthorInfo;
  category_title: string;
  course_title: string;
  excerpt: string;
}

export interface ReplyRow extends ForumReply {
  author: AuthorInfo;
  post_title: string;
  course_id: string;
  course_title: string;
  excerpt: string;
}

export interface ModerationData {
  courses: Course[];
  categories: ForumCategory[];
  counts: { open_reports: number; posts: number; replies: number; hidden: number };
  reports: ReportRow[];
  posts: PostRow[];
  replies: ReplyRow[];
  total: number;
}

const PAGE = 100;

export async function getModerationData(filters: ModerationFilters): Promise<ModerationData> {
  const { db } = await getServices();
  const [courses, categories, profiles, openReports] = await Promise.all([
    db.from("courses").list({ orderBy: ["created_at", "asc"] }),
    db.from("forum_categories").list(),
    db.from("profiles").list(),
    db.from("forum_reports").list({ where: { status: "open" }, orderBy: ["created_at", "desc"] }),
  ]);
  const courseTitle = new Map(courses.map((c) => [c.id, c.title]));
  const categoryTitle = new Map(categories.map((c) => [c.id, c.title]));
  const profileById = new Map(profiles.map((p) => [p.id, p]));
  const author = (id: string): AuthorInfo => {
    const p = profileById.get(id);
    if (!p || p.deleted_at) return { id, name: "Deleted member", role: null, deleted: true };
    return { id, name: p.name, role: p.role, deleted: false };
  };
  const statusWhere = filters.status === "all" ? undefined : filters.status;

  const [postCount, replyCount, hidden] = await Promise.all([
    db.from("forum_posts").count(filters.courseId ? { course_id: filters.courseId } : undefined),
    db.from("forum_replies").count(),
    db.from("forum_posts").count({ status: "hidden" }),
  ]);
  const counts = { open_reports: openReports.length, posts: postCount, replies: replyCount, hidden };

  if (filters.tab === "reports") {
    const postIds = openReports.map((r) => r.post_id).filter((id): id is string => !!id);
    const replyIds = openReports.map((r) => r.reply_id).filter((id): id is string => !!id);
    const [posts, replies] = await Promise.all([
      postIds.length ? db.from("forum_posts").list({ where: { id: postIds } }) : Promise.resolve([]),
      replyIds.length ? db.from("forum_replies").list({ where: { id: replyIds } }) : Promise.resolve([]),
    ]);
    const parentIds = [...new Set(replies.map((r) => r.post_id))];
    const parents = parentIds.length ? await db.from("forum_posts").list({ where: { id: parentIds } }) : [];
    const parentById = new Map(parents.map((p) => [p.id, p]));
    const postById = new Map(posts.map((p) => [p.id, p]));
    const replyById = new Map(replies.map((r) => [r.id, r]));
    const reports: ReportRow[] = openReports.map((r) => {
      let target: ReportRow["target"] = null;
      if (r.post_id) {
        const p = postById.get(r.post_id);
        if (p) target = { kind: "post", id: p.id, excerpt: truncate(p.body, 200), title: p.title, author: author(p.user_id), status: p.status, course_id: p.course_id };
      } else if (r.reply_id) {
        const rep = replyById.get(r.reply_id);
        const parent = rep ? parentById.get(rep.post_id) : undefined;
        if (rep) target = { kind: "reply", id: rep.id, excerpt: truncate(rep.body, 200), title: parent ? `Reply on “${parent.title}”` : null, author: author(rep.user_id), status: rep.status, course_id: parent?.course_id ?? "" };
      }
      return { ...r, reporter: author(r.reporter_user_id), target };
    });
    return { courses, categories, counts, reports, posts: [], replies: [], total: reports.length };
  }

  if (filters.tab === "posts") {
    const where: Record<string, unknown> = {};
    if (filters.courseId) where.course_id = filters.courseId;
    if (statusWhere) where.status = statusWhere;
    if (filters.authorId) where.user_id = filters.authorId;
    const rows = await db.from("forum_posts").list({ where: where as Partial<ForumPost>, orderBy: ["created_at", "desc"], limit: PAGE });
    const total = await db.from("forum_posts").count(where as Partial<ForumPost>);
    const posts: PostRow[] = rows.map((p) => ({
      ...p,
      author: author(p.user_id),
      category_title: categoryTitle.get(p.category_id) ?? "—",
      course_title: courseTitle.get(p.course_id) ?? "—",
      excerpt: truncate(p.body, 160),
    }));
    return { courses, categories, counts, reports: [], posts, replies: [], total };
  }

  const where: Record<string, unknown> = {};
  if (statusWhere) where.status = statusWhere;
  if (filters.authorId) where.user_id = filters.authorId;
  const rows = await db.from("forum_replies").list({ where: where as Partial<ForumReply>, orderBy: ["created_at", "desc"], limit: PAGE * 2 });
  const parentIds = [...new Set(rows.map((r) => r.post_id))];
  const parents = parentIds.length ? await db.from("forum_posts").list({ where: { id: parentIds } }) : [];
  const parentById = new Map(parents.map((p) => [p.id, p]));
  const replies: ReplyRow[] = rows
    .map((r) => {
      const parent = parentById.get(r.post_id);
      return {
        ...r,
        author: author(r.user_id),
        post_title: parent?.title ?? "(deleted thread)",
        course_id: parent?.course_id ?? "",
        course_title: parent ? (courseTitle.get(parent.course_id) ?? "—") : "—",
        excerpt: truncate(r.body, 160),
      };
    })
    .filter((r) => !filters.courseId || r.course_id === filters.courseId)
    .slice(0, PAGE);
  return { courses, categories, counts, reports: [], posts: [], replies, total: replies.length };
}
