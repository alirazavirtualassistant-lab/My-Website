import "server-only";
import { getServices } from "@/services";
import type { Profile } from "@/lib/types";

export interface TeamMember extends Profile {
  last_action_at: string | null;
}

export async function listTeam(): Promise<{ members: TeamMember[]; adminCount: number }> {
  const { db } = await getServices();
  const rows = (await db.from("profiles").list({ where: { role: ["admin", "assistant"] }, orderBy: ["created_at", "asc"] })).filter((p) => !p.deleted_at);
  const audit = await db.from("audit_log").list({ orderBy: ["created_at", "desc"], limit: 2000 });
  const lastByActor = new Map<string, string>();
  for (const a of audit) if (a.actor_user_id && !lastByActor.has(a.actor_user_id)) lastByActor.set(a.actor_user_id, a.created_at);
  const order = { admin: 0, assistant: 1, learner: 2 } as const;
  const members = rows
    .map((p) => ({ ...p, last_action_at: lastByActor.get(p.id) ?? null }))
    .sort((a, b) => order[a.role] - order[b.role] || a.name.localeCompare(b.name));
  return { members, adminCount: rows.filter((p) => p.role === "admin").length };
}
