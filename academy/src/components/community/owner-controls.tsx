"use client";

/**
 * Edit / remove controls a member sees on their own post or reply. Edits open
 * a dialog with a form (useActionState); removal asks for confirmation and
 * marks the row `removed` (never a hard delete).
 */
import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { FormErrorSummary } from "@/components/auth/form-error-summary";
import { SubmitButton } from "@/components/auth/submit-button";
import { removePostAction, removeReplyAction, updatePostAction, updateReplyAction } from "@/app/(learner)/community/[course]/actions";
import { idleFormState, type CommunityFormState, type RemoveResult } from "./types";

type EditAction = (prev: CommunityFormState, formData: FormData) => Promise<CommunityFormState>;

function EditDialog({ title, description, action, children, size }: { title: string; description: string; action: EditAction; children: (errors: Record<string, string>) => React.ReactNode; size: "sm" | "md" }) {
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useActionState(action, idleFormState);
  const router = useRouter();
  const lastStamp = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    if (state.status === "success" && state.stamp && state.stamp !== lastStamp.current) {
      lastStamp.current = state.stamp;
      setOpen(false);
      toast.success(state.message ?? "Saved.");
      router.refresh();
    }
  }, [state.status, state.stamp, state.message, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className={cn("text-muted-foreground", size === "sm" && "h-8 px-2 text-xs")}>
          <Pencil aria-hidden="true" className={size === "sm" ? "size-3.5" : undefined} />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={formAction} noValidate className="grid gap-5">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <FormErrorSummary summary={state.summary} />
          <FormStack>{children(state.errors ?? {})}</FormStack>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton pendingLabel="Saving">Save changes</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RemoveDialog({ what, onRemove, size }: { what: "post" | "reply"; onRemove: () => Promise<RemoveResult>; size: "sm" | "md" }) {
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const router = useRouter();

  function confirm() {
    startTransition(async () => {
      const res = await onRemove();
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setOpen(false);
      toast.success(what === "post" ? "Your post was removed." : "Your reply was removed.");
      if (res.href) router.push(res.href);
      else router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className={cn("text-muted-foreground hover:text-danger", size === "sm" && "h-8 px-2 text-xs")}>
          <Trash2 aria-hidden="true" className={size === "sm" ? "size-3.5" : undefined} />
          Remove
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove this {what}?</DialogTitle>
          <DialogDescription>
            {what === "post" ? "It disappears for everyone, replies included. This can't be undone." : "It disappears for everyone. This can't be undone."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Keep it
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" loading={pending} onClick={confirm}>
            Remove {what}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export interface PostOwnerControlsProps {
  post: { id: string; title: string; body: string; locked: boolean };
  className?: string;
}

function PostOwnerControls({ post, className }: PostOwnerControlsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {!post.locked ? (
        <EditDialog title="Edit your post" description="Changes show for everyone straight away." action={updatePostAction} size="md">
          {(errors) => (
            <>
              <input type="hidden" name="postId" value={post.id} />
              <FormField id={`edit-post-${post.id}-title`} label="Title" required error={errors.title}>
                <Input name="title" defaultValue={post.title} maxLength={160} />
              </FormField>
              <FormField id={`edit-post-${post.id}-body`} label="Your post" required error={errors.body}>
                <Textarea name="body" defaultValue={post.body} rows={8} maxLength={10_000} />
              </FormField>
            </>
          )}
        </EditDialog>
      ) : null}
      <RemoveDialog what="post" onRemove={() => removePostAction({ postId: post.id })} size="md" />
    </div>
  );
}

export interface ReplyOwnerControlsProps {
  reply: { id: string; body: string };
  locked: boolean;
  className?: string;
}

function ReplyOwnerControls({ reply, locked, className }: ReplyOwnerControlsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {!locked ? (
        <EditDialog title="Edit your reply" description="Changes show for everyone straight away." action={updateReplyAction} size="sm">
          {(errors) => (
            <>
              <input type="hidden" name="replyId" value={reply.id} />
              <FormField id={`edit-reply-${reply.id}-body`} label="Your reply" required error={errors.body}>
                <Textarea name="body" defaultValue={reply.body} rows={5} maxLength={5000} />
              </FormField>
            </>
          )}
        </EditDialog>
      ) : null}
      <RemoveDialog what="reply" onRemove={() => removeReplyAction({ replyId: reply.id })} size="sm" />
    </div>
  );
}

export { PostOwnerControls, ReplyOwnerControls };
