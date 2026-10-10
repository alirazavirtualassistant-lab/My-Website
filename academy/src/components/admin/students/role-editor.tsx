"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toaster";
import { idleState } from "@/components/auth/types";
import type { Role } from "@/lib/types";
import { changeRoleAction } from "@/app/admin/(panel)/students/actions";
import { messageOf } from "./form-state";

const ROLE_LABELS: Record<Role, string> = { learner: "Learner", assistant: "Assistant", admin: "Owner (admin)" };

/** Owner-only role picker. The server re-checks every rule (last owner, self-demotion). */
function RoleEditor({ userId, role }: { userId: string; role: Role }) {
  const [state, action, pending] = useActionState(changeRoleAction, idleState);
  const [value, setValue] = React.useState<Role>(role);
  React.useEffect(() => {
    if (!state.stamp) return;
    const message = messageOf(state);
    if (state.status === "error") {
      toast.error(message ?? "Something went wrong.");
      setValue(role);
    } else if (message) toast.success(message);
  }, [state, role]);
  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="user_id" value={userId} />
      <div className="grid gap-1.5">
        <Label htmlFor="role-select">Role</Label>
        <Select name="role" value={value} onValueChange={(v) => setValue(v as Role)}>
          <SelectTrigger id="role-select" className="w-44" aria-describedby="role-hint">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
              <SelectItem key={r} value={r}>
                {ROLE_LABELS[r]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" variant="outline" loading={pending} disabled={value === role}>
        Save role
      </Button>
      <p id="role-hint" className="basis-full text-xs text-muted-foreground">
        Assistants get the admin panel minus products, coupons, settings and team. Owners get everything.
      </p>
      {state.status === "error" && state.errors?.form ? (
        <p role="alert" className="basis-full text-xs font-medium text-danger">
          {state.errors.form}
        </p>
      ) : null}
    </form>
  );
}

export { RoleEditor, ROLE_LABELS };
