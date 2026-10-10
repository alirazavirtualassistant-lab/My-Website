/**
 * Serialisable view types shared by the community pages (Server Components)
 * and the small client islands (like button, reply form, dialogs). Plain data
 * only: no Dates, no class instances, so they cross the RSC boundary cleanly.
 */

export interface AuthorView {
  /** null for anonymous (to other members) and deleted members */
  id: string | null;
  name: string;
  avatarUrl: string | null;
  isInstructor: boolean;
  isMe: boolean;
}

export interface LessonChipView {
  id: string;
  code: string;
  title: string;
  href: string;
}

export interface PostRowView {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  author: AuthorView;
  createdAt: string;
  replyCount: number;
  likeCount: number;
  pinned: boolean;
  locked: boolean;
  anonymous: boolean;
  lesson: LessonChipView | null;
  /** Category title + href, shown on cross-category lists (search, pinned). */
  category: { title: string; href: string } | null;
}

export interface CategoryView {
  id: string;
  slug: string;
  title: string;
  description: string;
  href: string;
  postCount: number;
  lastActivityAt: string | null;
}

export interface ReplyView {
  id: string;
  body: string;
  author: AuthorView;
  createdAt: string;
  likeCount: number;
  liked: boolean;
  anonymous: boolean;
}

export interface CommunityFormState {
  status: "idle" | "error" | "success";
  /** Per-field messages keyed by input name; "form" for general errors. */
  errors?: Record<string, string>;
  /** Flat list for the error summary. */
  summary?: string[];
  message?: string;
  /** Changes on every successful submit so effects (toasts, resets) re-fire. */
  stamp?: number;
}

export const idleFormState: CommunityFormState = { status: "idle" };

export type LikeResult = { ok: true; liked: boolean; count: number } | { ok: false; error: string };
export type SimpleResult = { ok: true } | { ok: false; error: string };
export type RemoveResult = { ok: true; href: string | null } | { ok: false; error: string };

/** Community guidelines, quoted verbatim from the Welcome Guide. */
export const COMMUNITY_GUIDELINES = [
  "Grace over guilt: no shaming, of yourself or anyone else.",
  "Privacy: what is shared in the forum and the group stays there.",
  "Ask, don't diagnose: share what worked for you; leave medical advice to clinicians.",
  "Show up honestly: \"This week was hard\" is a valid post and often the most helpful one.",
] as const;

export const ANONYMOUS_EXPLANATION = "Your name is hidden from other members; moderators can still see it";

export const POSTS_PER_PAGE = 20;

export function communityHref(courseSlug: string): string {
  return `/community/${courseSlug}`;
}
export function categoryHref(courseSlug: string, categorySlug: string): string {
  return `/community/${courseSlug}/${categorySlug}`;
}
export function postHref(courseSlug: string, postId: string): string {
  return `/community/${courseSlug}/post/${postId}`;
}
export function newPostHref(courseSlug: string, opts: { category?: string | null; lesson?: string | null } = {}): string {
  const params = new URLSearchParams();
  if (opts.category) params.set("category", opts.category);
  if (opts.lesson) params.set("lesson", opts.lesson);
  const qs = params.toString();
  return `/community/${courseSlug}/new${qs ? `?${qs}` : ""}`;
}
