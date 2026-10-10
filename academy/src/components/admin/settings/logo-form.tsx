"use client";

import * as React from "react";
import { ImageUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/auth/submit-button";
import { Logo } from "@/components/shared/logo";
import { removeLogoAction, uploadLogoAction } from "@/app/admin/(panel)/settings/actions";
import { useAdminAction } from "@/components/admin/students/use-admin-action";

function LogoForm({ logoUrl }: { logoUrl: string | null }) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string>("");
  const [state, upload] = useAdminAction(uploadLogoAction, {
    onSuccess: () => {
      setPreview(null);
      setFileName("");
    },
  });
  const [, remove, removing] = useAdminAction(removeLogoAction);
  React.useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);
  const errors = state.errors ?? {};
  return (
    <div className="grid gap-5 sm:grid-cols-[160px_minmax(0,1fr)]">
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border bg-cream-2/50 p-3">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="New logo preview" className="max-h-full max-w-full object-contain" />
        ) : logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="Current logo" className="max-h-full max-w-full object-contain" />
        ) : (
          <Logo height={34} />
        )}
      </div>
      <div className="grid gap-3">
        <form action={upload} className="grid gap-3">
          <FormField id="logo-file" label="Upload a logo" hint="PNG, JPG, WebP or GIF up to 10 MB. A wide mark on a transparent background looks best. Leave empty to keep the built-in mark." error={errors.logo} optionalText="">
            <Input
              name="logo"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setFileName(f?.name ?? "");
                setPreview((old) => {
                  if (old) URL.revokeObjectURL(old);
                  return f ? URL.createObjectURL(f) : null;
                });
              }}
            />
          </FormField>
          <div className="flex flex-wrap gap-2">
            <SubmitButton variant="outline" disabled={!fileName} pendingLabel="Uploading…">
              <ImageUp aria-hidden="true" /> Upload
            </SubmitButton>
          </div>
        </form>
        {logoUrl ? (
          <form action={remove}>
            <Button type="submit" variant="ghost" size="sm" loading={removing} className="text-danger hover:bg-danger-soft hover:text-danger">
              <Trash2 aria-hidden="true" /> Remove logo
            </Button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

export { LogoForm };
