import * as React from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { AuthorChip } from "./author-chip";
import { LikeButton } from "./like-button";
import { ReplyOwnerControls } from "./owner-controls";
import { PostBody } from "./post-body";
import { ReportDialog } from "./report-dialog";
import type { ReplyView } from "./types";

export interface ReplyListProps extends React.ComponentProps<"section"> {
  replies: ReplyView[];
  locked: boolean;
  /** Hide like/report/owner controls (no community access). */
  readOnly?: boolean;
}

/** Replies under a post, oldest first, with like/report and owner edit/remove. */
function ReplyList({ replies, locked, readOnly = false, className, ...props }: ReplyListProps) {
  const count = replies.length;
  return (
    <section aria-labelledby="replies-heading" className={cn("grid gap-4", className)} {...props}>
      <h2 id="replies-heading" className="font-serif text-2xl font-medium">
        {count === 0 ? "Replies" : `${count} ${count === 1 ? "reply" : "replies"}`}
      </h2>
      {count === 0 ? (
        <EmptyState size="sm" icon={<MessageSquare />} title="No replies yet" description={locked ? "This thread is locked, so it stays as it is." : "A kind word or a “me too” goes a long way."} />
      ) : (
        <ol className="grid gap-3">
          {replies.map((r) => (
            <li key={r.id} id={`reply-${r.id}`} className="card-soft grid gap-3 p-4 sm:p-5">
              <AuthorChip author={r.author} date={r.createdAt} size="sm" />
              <PostBody body={r.body} className="text-[15px]" />
              {readOnly ? null : (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <LikeButton target={{ replyId: r.id }} liked={r.liked} count={r.likeCount} size="sm" />
                  <div className="flex flex-wrap items-center gap-1">
                    {r.author.isMe ? <ReplyOwnerControls reply={{ id: r.id, body: r.body }} locked={locked} /> : <ReportDialog target={{ replyId: r.id }} size="sm" />}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export { ReplyList };
