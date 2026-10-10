import * as React from "react";
import Link from "next/link";
import { BookOpen, Heart, Lock, MessageSquare, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AuthorChip } from "./author-chip";
import type { PostRowView } from "./types";

export interface PostCardProps extends React.ComponentProps<"article"> {
  post: PostRowView;
  /** Hide the excerpt for denser lists. */
  compact?: boolean;
}

/** One row in a post list: title, author, counts, lesson chip and status badges. */
function PostCard({ post, compact = false, className, ...props }: PostCardProps) {
  const titleId = `post-${post.id}-title`;
  return (
    <article
      aria-labelledby={titleId}
      data-slot="post-card"
      className={cn("card-soft relative flex flex-col gap-3 p-4 transition-colors hover:border-rose/50 focus-within:border-rose/60 sm:p-5", post.pinned && "border-gold/60 bg-gold-soft/30", className)}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-2 empty:hidden">
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
        {post.category ? (
          <Link href={post.category.href} className="relative z-10 text-xs font-semibold text-rose-strong underline-offset-4 hover:underline">
            {post.category.title}
          </Link>
        ) : null}
      </div>
      <h3 id={titleId} className="font-serif text-xl leading-snug font-medium">
        <Link href={post.href} className="after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-offset-2">
          {post.title}
        </Link>
      </h3>
      {!compact && post.excerpt ? <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p> : null}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <AuthorChip author={post.author} date={post.createdAt} size="sm" />
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {post.lesson ? (
            <Link href={post.lesson.href} className="relative z-10 inline-flex max-w-56 items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 font-semibold text-sage-strong hover:border-sage/60 hover:bg-sage-soft/50">
              <BookOpen className="size-3 shrink-0" aria-hidden="true" />
              <span className="truncate">
                {post.lesson.code} · {post.lesson.title}
              </span>
            </Link>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="size-3.5" aria-hidden="true" />
            {post.replyCount}
            <span className="sr-only"> {post.replyCount === 1 ? "reply" : "replies"}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart className="size-3.5" aria-hidden="true" />
            {post.likeCount}
            <span className="sr-only"> {post.likeCount === 1 ? "like" : "likes"}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

export { PostCard };
