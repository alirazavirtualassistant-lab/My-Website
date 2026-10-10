"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Role } from "@/lib/types";
import { changeRoleAction } from "@/app/admin/(panel)/students/actions";
import { useAdminAction } from "./use-admin-action";
import { ROLE_LABELS } from "./role-labels";

/** Owner-only role picker. The server re-checks every rule (last owner, self-demotion). */
function RoleEditor({ userId, role }: { userId: string; role: Role }) {
  const [value, setValue] = React.useState<Role>(role);
  const [state, action, pending] = useAdminAction(changeRoleAction, { onError: () => setValue(role) });
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

export { RoleEditor };
