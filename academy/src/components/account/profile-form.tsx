"use client";

import * as React from "react";
import { useActionState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormField, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";
import { removeAvatarAction, updateProfileAction } from "@/app/(learner)/account/actions";
import { FormErrorSummary } from "@/components/auth/form-error-summary";
import { SubmitButton } from "@/components/auth/submit-button";
import { timeZoneLabel } from "@/components/auth/logic";
import { idleState } from "@/components/auth/types";

export interface ProfileFormProps {
  profile: { name: string; email: string; avatar_url: string | null; role: string; timezone: string | null };
  timeZones: Array<{ region: string; zones: string[] }>;
}

const AVATAR_MAX_BYTES = 3 * 1024 * 1024;
const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

const selectClass =
  "flex h-10 w-full min-w-0 rounded-lg border border-input bg-card px-3 py-2 text-base text-foreground shadow-xs outline-none transition-[color,box-shadow,border-color] focus-visible:border-rose focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-danger md:text-sm";

function useToastOnSuccess(stamp: number | undefined, message: string | undefined) {
  React.useEffect(() => {
    if (stamp && message) toast.success(message);
  }, [stamp, message]);
}

function ProfileForm({ profile, timeZones }: ProfileFormProps) {
  const [state, action] = useActionState(updateProfileAction, idleState);
  const errors = state.errors ?? {};
  useToastOnSuccess(state.stamp, state.message);

  const [preview, setPreview] = React.useState<string | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [detected, setDetected] = React.useState<string>("");
  const selectRef = React.useRef<HTMLSelectElement>(null);

  React.useEffect(() => {
    try {
      setDetected(Intl.DateTimeFormat().resolvedOptions().timeZone ?? "");
    } catch {
      setDetected("");
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileError(null);
    if (!file) return;
    if (!AVATAR_TYPES.includes(file.type)) {
      setFileError("Please choose a JPG, PNG or WebP image.");
      e.target.value = "";
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setFileError("That image is over 3 MB. A smaller one will look just as lovely.");
      e.target.value = "";
      return;
    }
    setPreview(URL.createObjectURL(file));
  }

  const avatarSrc = preview ?? profile.avatar_url ?? undefined;
  const avatarError = errors.avatar ?? fileError ?? undefined;

  return (
    <div className="grid gap-8">
      <form action={action} noValidate encType="multipart/form-data" className="grid gap-6">
        <FormErrorSummary summary={state.summary} />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-20 border border-border sm:size-24">
            {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
            <AvatarFallback className="text-2xl">{initials(profile.name) || "?"}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1.5">
            <Label htmlFor="pf-avatar" className="font-semibold">
              Profile photo
            </Label>
            <input
              id="pf-avatar"
              name="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFileChange}
              aria-describedby={avatarError ? "pf-avatar-error" : "pf-avatar-hint"}
              aria-invalid={avatarError ? true : undefined}
              className={cn(
                "block w-full max-w-xs text-sm text-muted-foreground file:mr-3 file:inline-flex file:h-9 file:cursor-pointer file:items-center file:rounded-lg file:border file:border-border file:bg-card file:px-3 file:text-sm file:font-semibold file:text-foreground hover:file:border-rose/60 hover:file:bg-rose-soft/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              )}
            />
            {avatarError ? (
              <p id="pf-avatar-error" role="alert" className="text-xs font-medium text-danger">
                {avatarError}
              </p>
            ) : (
              <p id="pf-avatar-hint" className="flex items-center gap-1 text-xs text-muted-foreground">
                <Camera className="size-3.5" aria-hidden="true" /> JPG, PNG or WebP, up to 3 MB. Saved when you press Save changes.
              </p>
            )}
          </div>
        </div>

        <FormStack>
          <FormField id="pf-name" label="Your name" error={errors.name} required hint="Shown on certificates and in the community.">
            <Input name="name" autoComplete="name" defaultValue={profile.name} required maxLength={80} />
          </FormField>

          <div className="grid gap-1.5">
            <Label htmlFor="pf-email">Email</Label>
            <Input id="pf-email" type="email" value={profile.email} readOnly aria-describedby="pf-email-hint" className="bg-muted-bg/60" />
            <p id="pf-email-hint" className="text-xs text-muted-foreground">
              Your sign-in email. To change it, write to us from the Contact page and we'll help.
            </p>
          </div>

          <div className="grid gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="pf-timezone">Time zone</Label>
              {detected && detected !== profile.timezone ? (
                <button
                  type="button"
                  onClick={() => {
                    if (selectRef.current) selectRef.current.value = detected;
                  }}
                  className="text-xs font-semibold text-rose-strong underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  Use {timeZoneLabel(detected)}
                </button>
              ) : null}
            </div>
            <select
              id="pf-timezone"
              name="timezone"
              ref={selectRef}
              defaultValue={profile.timezone ?? ""}
              aria-describedby="pf-timezone-hint"
              aria-invalid={errors.timezone ? true : undefined}
              className={selectClass}
            >
              <option value="">Use my device's time zone</option>
              {timeZones.map((group) => (
                <optgroup key={group.region} label={group.region}>
                  {group.zones.map((zone) => (
                    <option key={zone} value={zone}>
                      {timeZoneLabel(zone)} ({zone})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p id="pf-timezone-hint" className="text-xs text-muted-foreground">
              Keeps your streaks and module unlock days on your local calendar.
            </p>
            {errors.timezone ? (
              <p role="alert" className="text-xs font-medium text-danger">
                {errors.timezone}
              </p>
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <span className="text-sm font-semibold">Role</span>
            <div>
              <Badge variant={profile.role === "learner" ? "rose" : "gold"} className="capitalize">
                {profile.role}
              </Badge>
            </div>
          </div>
        </FormStack>

        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
          {state.status === "success" ? (
            <p role="status" className="text-sm text-sage-strong">
              {state.message}
            </p>
          ) : null}
        </div>
      </form>

      {profile.avatar_url ? <RemoveAvatar /> : null}
    </div>
  );
}

function RemoveAvatar() {
  const [state, action, pending] = useActionState(removeAvatarAction, idleState);
  useToastOnSuccess(state.stamp, state.message);
  return (
    <form action={action} className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
      <Button type="submit" variant="ghost" size="sm" loading={pending}>
        <Trash2 /> Remove photo
      </Button>
      {state.status === "error" ? (
        <p role="alert" className="text-xs text-danger">
          {state.errors?.form}
        </p>
      ) : null}
    </form>
  );
}

export { ProfileForm };
