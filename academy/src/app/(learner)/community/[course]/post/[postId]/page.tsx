import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Lock, Pin } from "lucide-react";
import { getServices } from "@/services";
import { getCourseBySlug } from "@/lib/usecases/catalog";
import { listCategories, presentAuthor } from "@/lib/usecases/community";
import { signedUrlFor } from "@/lib/usecases/uploads";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AuthorChip } from "@/components/community/author-chip";
import { CommunityLocked } from "@/components/community/community-locked";
import { LikeButton } from "@/components/community/like-button";
import { PostOwnerControls } from "@/components/community/owner-controls";
import { PostBody } from "@/components/community/post-body";
import { ReplyForm } from "@/components/community/reply-form";
import { ReplyList } from "@/components/community/reply-list";
import { ReportDialog } from "@/components/community/report-dialog";
import { categoryHref, communityHref, postHref, type ReplyView } from "@/components/community/types";
import { PageHeader } from "@/components/ui/page-header";
import { lessonChip, loadCommunity, loadProfiles, toAuthorView } from "../../_lib/load";

export const dynamic = "force-dynamic";

type Params = Promise<{ course: string; postId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { course: slug, postId } = await params;
  const { db } = await getServices();
  const [course, post] = await Promise.all([getCourseBySlug(slug), db.from("forum_posts").get(postId)]);
  const ok = course && post && post.course_id === course.id && post.status === "visible";
  return { title: ok ? `${post.title} · ${course.title} community` : "Community", robots: { index: false, follow: false } };
}

/** /community/[course]/post/[postId] — the thread: post, image, likes, replies, reply form. */
export default async function PostPage({ params }: { params: Params }) {
  const { course: slug, postId } = await params;
  const { session, course, allowed, viewerIsAdmin } = await loadCommunity(slug, postHref(slug, postId));

  if (!allowed) {
    return (
      <div className="grid gap-8">
        <PageHeader eyebrow="Community" title={course.title} />
        <CommunityLocked courseSlug={course.slug} courseTitle={course.title} />
      </div>
    );
  }

  const { db } = await getServices();
  const post = await db.from("forum_posts").get(postId);
  if (!post || post.course_id !== course.id || post.status !== "visible") notFound();

  const [categories, replies, lesson, myPostLike] = await Promise.all([
    listCategories(course.id),
    db.from("forum_replies").list({ where: { post_id: post.id, status: "visible" }, orderBy: ["created_at", "asc"] }),
    post.lesson_id ? db.from("lessons").get(post.lesson_id) : Promise.resolve(null),
    db.from("forum_likes").findOne({ user_id: session.user_id, post_id: post.id }),
  ]);
  const category = categories.find((c) => c.id === post.category_id) ?? null;
  const [profiles, myReplyLikes, imageUrl] = await Promise.all([
    loadProfiles([post.user_id, ...replies.map((r) => r.user_id)]),
    replies.length ? db.from("forum_likes").list({ where: { user_id: session.user_id, reply_id: replies.map((r) => r.id) } }) : Promise.resolve([]),
    post.image_path ? signedUrlFor("learner-uploads", post.image_path).catch(() => null) : Promise.resolve(null),
  ]);
  const likedReplyIds = new Set(myReplyLikes.map((l) => l.reply_id));
  const author = toAuthorView(presentAuthor(profiles.get(post.user_id), post.anonymous, session.user_id, viewerIsAdmin));
  const replyViews: ReplyView[] = replies.map((r) => ({
    id: r.id,
    body: r.body,
    author: toAuthorView(presentAuthor(profiles.get(r.user_id), r.anonymous, session.user_id, viewerIsAdmin)),
    createdAt: r.created_at,
    likeCount: r.like_count,
    liked: likedReplyIds.has(r.id),
    anonymous: r.anonymous,
  }));
  const chip = lesson && lesson.course_id === course.id ? lessonChip(course.slug, lesson) : null;
  const backHref = category ? categoryHref(course.slug, category.slug) : communityHref(course.slug);

  return (
    <div className="grid gap-8">
      <Link href={backHref} className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-rose-strong underline-offset-4 hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {category ? category.title : course.title}
      </Link>

      <article aria-labelledby="post-title" className="card-soft grid gap-5 p-5 sm:p-7">
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center gap-2 empty:hidden">
            <p className="eyebrow">{category ? category.title : "Community"}</p>
            {post.pinned ? (
              <Badge variant="gold">
                <Pin aria-hidden="true" />
                Pinned
              </Badge>
            ) : null}
            {post.locked ? (
              <Badge variant="muted">
                <Lock aria-hidden="true" />
                Locked
              </Badge>
            ) : null}
          </div>
          <h1 id="post-title" className="text-balance text-3xl sm:text-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <AuthorChip author={author} date={post.created_at} />
            {chip ? (
              <Link href={chip.href} className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-sage/50 bg-sage-soft/60 px-3 py-1 text-xs font-semibold text-sage-strong hover:bg-sage-soft">
                <BookOpen className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {chip.code} · {chip.title}
                </span>
              </Link>
            ) : null}
          </div>
        </div>

        <PostBody body={post.body} />

        {imageUrl ? (
          <figure className="grid gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed URL from learner-uploads; dimensions unknown */}
            <img src={imageUrl} alt={`Photo shared with “${post.title}”`} loading="lazy" className="max-h-[32rem] w-auto max-w-full rounded-lg border border-border object-contain" />
            <figcaption className="text-xs text-muted-foreground">Photo shared by {author.name}.</figcaption>
          </figure>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <LikeButton target={{ postId: post.id }} liked={!!myPostLike} count={post.like_count} />
          <div className="flex flex-wrap items-center gap-1">
            {author.isMe ? <PostOwnerControls post={{ id: post.id, title: post.title, body: post.body, locked: post.locked }} /> : <ReportDialog target={{ postId: post.id }} />}
          </div>
        </div>
      </article>

      {post.locked ? (
        <Alert variant="info">
          <Lock aria-hidden="true" />
          <AlertTitle>This thread is locked</AlertTitle>
          <AlertDescription>You can still read it, but new replies are closed.</AlertDescription>
        </Alert>
      ) : null}

      <ReplyList replies={replyViews} locked={post.locked} />

      {!post.locked ? <ReplyForm postId={post.id} /> : null}
    </div>
  );
}
