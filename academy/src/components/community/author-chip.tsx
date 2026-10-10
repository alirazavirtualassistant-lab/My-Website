import * as React from "react";
import { Sparkles } from "lucide-react";
import { cn, formatDate, initials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { AuthorView } from "./types";

/** "Instructor" badge for posts by the admin (course owner). */
function InstructorBadge({ className }: { className?: string }) {
  return (
    <Badge variant="rose" className={cn("gap-1", className)}>
      <Sparkles aria-hidden="true" />
      Instructor
    </Badge>
  );
}

export interface AuthorChipProps extends React.ComponentProps<"div"> {
  author: AuthorView;
  /** ISO date shown after the name. */
  date?: string | null;
  size?: "sm" | "md";
}

/**
 * Avatar + display name + badges. Anonymous handling, "Instructor" and
 * "Deleted member" all come from presentAuthor(); this only renders.
 */
function AuthorChip({ author, date, size = "md", className, ...props }: AuthorChipProps) {
  const deleted = author.id === null && author.name === "Deleted member";
  const anonymous = author.id === null && !deleted;
  const fallback = anonymous ? "?" : deleted ? "–" : initials(author.name) || "?";
  return (
    <div data-slot="author-chip" className={cn("flex min-w-0 items-center gap-2.5", className)} {...props}>
      <Avatar className={cn(size === "sm" ? "size-7" : "size-9", (anonymous || deleted) && "bg-muted-bg")}>
        {author.avatarUrl ? <AvatarImage src={author.avatarUrl} alt="" /> : null}
        <AvatarFallback className={cn(size === "sm" && "text-xs", (anonymous || deleted) && "bg-muted-bg text-muted-foreground")}>{fallback}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className={cn("flex flex-wrap items-center gap-x-2 gap-y-0.5 leading-tight", size === "sm" ? "text-xs" : "text-sm")}>
          <span className={cn("truncate font-semibold", (anonymous || deleted) ? "text-muted-foreground" : "text-foreground")}>{author.name}</span>
          {author.isMe ? <span className="text-xs font-normal text-muted-foreground">(you)</span> : null}
          {author.isInstructor ? <InstructorBadge /> : null}
        </p>
        {date ? (
          <p className="text-xs text-muted-foreground">
            <time dateTime={date}>{formatDate(date, { month: "short", day: "numeric", year: "numeric" })}</time>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export { AuthorChip, InstructorBadge };
