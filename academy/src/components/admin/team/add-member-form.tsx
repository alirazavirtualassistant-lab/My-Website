"use client";

import * as React from "react";
import { UserPlus } from "lucide-react";
import { FormField, FormRow, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormErrorSummary } from "@/components/auth/form-error-summary";
import { SubmitButton } from "@/components/auth/submit-button";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/password";
import { addTeamMemberAction } from "@/app/admin/(panel)/team/actions";
import { useAdminAction } from "@/components/admin/students/use-admin-action";

/** "Admin can create accounts": name, email, role, and either a temporary password or a set-password email. */
function AddMemberForm() {
  const [mode, setMode] = React.useState<"email" | "password">("email");
  const formRef = React.useRef<HTMLFormElement>(null);
  const [state, action] = useAdminAction(addTeamMemberAction, {
    toastError: false,
    onSuccess: () => {
      formRef.current?.reset();
      setMode("email");
    },
  });
  const errors = state.errors ?? {};
  return (
    <form ref={formRef} action={action} noValidate className="grid gap-6">
      <FormErrorSummary summary={state.status === "error" ? state.summary : undefined} />
      <FormStack>
        <FormRow>
          <FormField id="tm-name" label="Name" required error={errors.name}>
            <Input name="name" autoComplete="off" required maxLength={80} />
          </FormField>
          <FormField id="tm-email" label="Email" required error={errors.email} hint="If an account already exists it’s promoted instead.">
            <Input name="email" type="email" autoComplete="off" required />
          </FormField>
        </FormRow>
      </FormStack>

      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-semibold">Role</legend>
        <RadioGroup name="role" defaultValue="assistant" className="sm:grid-cols-2">
          <Label htmlFor="role-assistant" className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3 font-medium has-[[data-state=checked]]:border-rose has-[[data-state=checked]]:bg-rose-soft/40">
            <RadioGroupItem id="role-assistant" value="assistant" className="mt-0.5" />
            <span className="grid gap-0.5">
              <span>Assistant</span>
              <span className="text-xs font-normal text-muted-foreground">Courses, students, community, testimonials and emails. No products, coupons, settings or team.</span>
            </span>
          </Label>
          <Label htmlFor="role-admin" className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3 font-medium has-[[data-state=checked]]:border-rose has-[[data-state=checked]]:bg-rose-soft/40">
            <RadioGroupItem id="role-admin" value="admin" className="mt-0.5" />
            <span className="grid gap-0.5">
              <span>Owner</span>
              <span className="text-xs font-normal text-muted-foreground">Everything, including billing, settings and this team page.</span>
            </span>
          </Label>
        </RadioGroup>
        {errors.role ? (
          <p role="alert" className="text-xs font-medium text-danger">
            {errors.role}
          </p>
        ) : null}
      </fieldset>

      <fieldset className="grid gap-3">
        <legend className="mb-1 text-sm font-semibold">Password</legend>
        <RadioGroup name="password_mode" value={mode} onValueChange={(v) => setMode(v as "email" | "password")}>
          <Label htmlFor="pw-email" className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-3 font-medium has-[[data-state=checked]]:border-rose has-[[data-state=checked]]:bg-rose-soft/40">
            <RadioGroupItem id="pw-email" value="email" />
            Email them a link to set their own password
          </Label>
          <Label htmlFor="pw-password" className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-3 font-medium has-[[data-state=checked]]:border-rose has-[[data-state=checked]]:bg-rose-soft/40">
            <RadioGroupItem id="pw-password" value="password" />
            Set a temporary password now
          </Label>
        </RadioGroup>
        {mode === "password" ? (
          <FormField id="tm-password" label="Temporary password" required error={errors.password} hint={`At least ${PASSWORD_MIN_LENGTH} characters with a letter and a number. Share it privately; they can change it from Account.`}>
            <Input name="password" type="text" autoComplete="new-password" spellCheck={false} className="font-mono" required />
          </FormField>
        ) : null}
      </fieldset>

      <div>
        <SubmitButton pendingLabel="Adding…">
          <UserPlus aria-hidden="true" /> Add team member
        </SubmitButton>
      </div>
    </form>
  );
}

export { AddMemberForm };
