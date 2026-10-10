import * as React from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { PostCard } from "./post-card";
import type { PostRowView } from "./types";

export interface PostListProps extends React.ComponentProps<"div"> {
  posts: PostRowView[];
  compact?: boolean;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyAction?: React.ReactNode;
  /** Accessible name for the list. */
  label: string;
}

function PostList({ posts, compact, emptyTitle = "Nothing here yet", emptyDescription = "Be the first to say hello. A small share is enough.", emptyAction, label, className, ...props }: PostListProps) {
  if (posts.length === 0) {
    return <EmptyState size="sm" icon={<MessageSquare />} title={emptyTitle} description={emptyDescription} action={emptyAction} className={className} />;
  }
  return (
    <div data-slot="post-list" className={cn("grid gap-3", className)} {...props}>
      <ul aria-label={label} className="grid gap-3">
        {posts.map((p) => (
          <li key={p.id}>
            <PostCard post={p} compact={compact} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export { PostList };
