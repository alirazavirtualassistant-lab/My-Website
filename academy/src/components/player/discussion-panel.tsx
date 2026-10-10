import * as React from "react";
import Link from "next/link";
import { Heart, MessageSquare, MessageSquarePlus, Pin } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import type { DiscussionPostView } from "./types";

export interface DiscussionPanelProps {
  posts: DiscussionPostView[];
  newPostHref: string;
  communityHref: string;
  className?: string;
}

/** Read-only list of the latest forum posts tied to this lesson (posting lives in /community). */
function DiscussionPanel({ posts, newPostHref, communityHref, className }: DiscussionPanelProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">Conversations other learners started from this lesson.</p>
        <Button asChild size="sm">
          <Link href={newPostHref}>
            <MessageSquarePlus aria-hidden="true" />
            Start a discussion
          </Link>
        </Button>
      </div>
      {posts.length === 0 ? (
        <EmptyState
          size="sm"
          icon={<MessageSquare />}
          title="No discussions yet"
          description="Be the first to share a thought, a question or a small win from this lesson."
          action={
            <Button asChild variant="outline" size="sm">
              <Link href={newPostHref}>Start a discussion</Link>
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-border">
          {posts.map((p) => (
            <li key={p.id} className="py-3">
              <Link href={p.href} className="group block rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none">
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground group-hover:text-rose-strong">
                  {p.title}
                  {p.isInstructor ? <Badge variant="rose">Cynthia</Badge> : null}
                </p>
                {p.excerpt ? <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p> : null}
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{p.authorName}</span>
                  <span>{formatDate(p.createdAt, { month: "short", day: "numeric" })}</span>
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="size-3" aria-hidden="true" />
                    {p.replyCount}
                    <span className="sr-only"> replies</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="size-3" aria-hidden="true" />
                    {p.likeCount}
                    <span className="sr-only"> likes</span>
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="text-sm">
        <Link href={communityHref} className="inline-flex items-center gap-1.5 font-semibold text-rose-strong underline-offset-4 hover:underline">
          <Pin className="size-4" aria-hidden="true" />
          Open the course community
        </Link>
      </p>
    </div>
  );
}

export { DiscussionPanel };
