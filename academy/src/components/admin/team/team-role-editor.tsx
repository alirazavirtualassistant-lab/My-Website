"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { changeTeamRoleAction } from "@/app/admin/(panel)/team/actions";
import { useAdminAction } from "@/components/admin/students/use-admin-action";

type TeamRole = "admin" | "assistant";

function TeamRoleEditor({ userId, role, name }: { userId: string; role: TeamRole; name: string }) {
  const [value, setValue] = React.useState<TeamRole>(role);
  const [, action, pending] = useAdminAction(changeTeamRoleAction, { onError: () => setValue(role) });
  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="user_id" value={userId} />
      <Label htmlFor={`team-role-${userId}`} className="sr-only">
        Role for {name}
      </Label>
      <Select name="role" value={value} onValueChange={(v) => setValue(v as TeamRole)}>
        <SelectTrigger id={`team-role-${userId}`} size="sm" className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Owner</SelectItem>
          <SelectItem value="assistant">Assistant</SelectItem>
        </SelectContent>
      </Select>
      {value !== role ? (
        <Button type="submit" size="sm" variant="outline" loading={pending}>
          Save
        </Button>
      ) : null}
    </form>
  );
}

export { TeamRoleEditor };
