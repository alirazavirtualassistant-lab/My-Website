"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { ModuleKind } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormRow, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ILLUSTRATION_NAMES } from "@/components/shared/illustration";
import { createModuleAction, updateModuleAction } from "@/app/admin/(panel)/courses/[id]/curriculum/actions";
import { FormErrors, SaveButton, useSavedToast } from "./form-bits";
import { idleAdminState } from "./form-state";
import { NativeSelect } from "./native-select";

export interface ModuleFormValues {
  code: string;
  kind: ModuleKind;
  title: string;
  description: string;
  notes: string;
  drip_days: number;
  completion_xp: number;
  required_for_certificate: boolean;
  illustration: string | null;
}

const KIND_LABELS: Record<ModuleKind, string> = { home: "Course home", core: "Core module", bonus: "Bonus", replay: "Replay" };

/**
 * Inline module settings. With `moduleId` it updates; without, it creates a
 * new module on the course (used by the "Add module" dialog).
 */
function ModuleSettingsForm({ courseId, moduleId, values, onSaved, submitLabel = "Save module" }: { courseId: string; moduleId?: string; values: ModuleFormValues; onSaved?: () => void; submitLabel?: string }) {
  const router = useRouter();
  const action = React.useMemo(() => (moduleId ? updateModuleAction.bind(null, moduleId, courseId) : createModuleAction.bind(null, courseId)), [moduleId, courseId]);
  const [state, formAction] = useActionState(action, idleAdminState);
  const onSuccess = React.useCallback(() => {
    router.refresh();
    onSaved?.();
  }, [router, onSaved]);
  useSavedToast(state, onSuccess);
  const errors = state.errors ?? {};
  const prefix = moduleId ?? "new";
  const listId = `${prefix}-illustrations`;
  return (
    <form action={formAction} noValidate className="grid gap-5">
      <FormErrors state={state} />
      <FormStack>
        <FormRow className="sm:grid-cols-[8rem_1fr]">
          <FormField id={`${prefix}-code`} label="Code" error={errors.code} required hint="e.g. M3">
            <Input name="code" defaultValue={values.code} maxLength={20} spellCheck={false} className="font-mono uppercase" required />
          </FormField>
          <FormField id={`${prefix}-title`} label="Title" error={errors.title} required>
            <Input name="title" defaultValue={values.title} maxLength={160} required />
          </FormField>
        </FormRow>
        <FormRow className="sm:grid-cols-3">
          <FormField id={`${prefix}-kind`} label="Kind" error={errors.kind} required>
            <NativeSelect name="kind" defaultValue={values.kind}>
              {(Object.keys(KIND_LABELS) as ModuleKind[]).map((k) => (
                <option key={k} value={k}>
                  {KIND_LABELS[k]}
                </option>
              ))}
            </NativeSelect>
          </FormField>
          <FormField id={`${prefix}-drip`} label="Unlocks after (days)" hint="0 = the day they enrol" error={errors.drip_days}>
            <Input name="drip_days" type="number" min={0} max={3650} defaultValue={values.drip_days} inputMode="numeric" />
          </FormField>
          <FormField id={`${prefix}-xp`} label="Completion XP" hint="Awarded when every lesson is done" error={errors.completion_xp}>
            <Input name="completion_xp" type="number" min={0} max={10000} defaultValue={values.completion_xp} inputMode="numeric" />
          </FormField>
        </FormRow>
        <FormField id={`${prefix}-description`} label="Description" hint="Verbatim from the course sheet when imported." error={errors.description}>
          <Textarea name="description" defaultValue={values.description} maxLength={2000} className="min-h-20" />
        </FormField>
        <FormField id={`${prefix}-notes`} label="Notes" error={errors.notes}>
          <Textarea name="notes" defaultValue={values.notes} maxLength={5000} className="min-h-16" />
        </FormField>
        <FormRow className="sm:grid-cols-[1fr_auto] sm:items-end">
          <FormField id={`${prefix}-illustration`} label="Illustration key" hint="A built-in name, or the key from the sheet." error={errors.illustration}>
            <Input name="illustration" defaultValue={values.illustration ?? ""} maxLength={60} list={listId} />
          </FormField>
          <datalist id={listId}>
            {ILLUSTRATION_NAMES.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
          <div className="flex items-center gap-2 pb-2">
            <Checkbox id={`${prefix}-cert`} name="required_for_certificate" defaultChecked={values.required_for_certificate} />
            <Label htmlFor={`${prefix}-cert`} className="font-normal">
              Required for certificate
            </Label>
          </div>
        </FormRow>
      </FormStack>
      <div className="flex justify-end">
        <SaveButton size="sm">{submitLabel}</SaveButton>
      </div>
    </form>
  );
}

export { ModuleSettingsForm, KIND_LABELS };
