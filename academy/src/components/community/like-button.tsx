"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";
import { toggleLikeAction } from "@/app/(learner)/community/[course]/actions";

export interface LikeButtonProps {
  target: { postId: string } | { replyId: string };
  liked: boolean;
  count: number;
  size?: "sm" | "md";
  className?: string;
}

/** Optimistic heart toggle: flips immediately, rolls back if the action fails. */
function LikeButton({ target, liked, count, size = "md", className }: LikeButtonProps) {
  const [state, setState] = React.useState({ liked, count });
  const [prev, setPrev] = React.useState({ liked, count });
  if (prev.liked !== liked || prev.count !== count) {
    setPrev({ liked, count });
    setState({ liked, count });
  }
  const [pending, startTransition] = React.useTransition();

  function toggle() {
    const before = state;
    const optimistic = { liked: !before.liked, count: Math.max(0, before.count + (before.liked ? -1 : 1)) };
    setState(optimistic);
    startTransition(async () => {
      const res = await toggleLikeAction(target);
      if (!res.ok) {
        setState(before);
        toast.error(res.error ?? "We couldn't save that just now.");
        return;
      }
      setState({ liked: res.liked, count: res.count });
    });
  }

  const label = state.liked ? "Unlike" : "Like";
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={state.liked}
      aria-label={`${label}, ${state.count} ${state.count === 1 ? "like" : "likes"}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:opacity-70",
        size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-sm",
        state.liked ? "border-rose/60 bg-rose-soft text-rose-strong" : "border-border bg-card text-muted-foreground hover:border-rose/50 hover:text-rose-strong",
        className,
      )}
    >
      <Heart className={cn(size === "sm" ? "size-3.5" : "size-4", state.liked && "fill-current")} aria-hidden="true" />
      <span aria-hidden="true">{state.count}</span>
    </button>
  );
}

export { LikeButton };
