import "server-only";
import { getServices } from "@/services";
import type { Profile, TableName } from "@/lib/types";
import { newId, nowIso } from "@/lib/utils";

/** Tables that hold per-user rows, for export and deletion. */
const USER_TABLES: Array<{ table: TableName; column: string }> = [
  { table: "enrollments", column: "user_id" },
  { table: "orders", column: "user_id" },
  { table: "subscriptions", column: "user_id" },
  { table: "lesson_progress", column: "user_id" },
  { table: "action_step_completions", column: "user_id" },
  { table: "xp_ledger", column: "user_id" },
  { table: "user_badges", column: "user_id" },
  { table: "streaks", column: "user_id" },
  { table: "quiz_responses", column: "user_id" },
  { table: "notes", column: "user_id" },
  { table: "forum_posts", column: "user_id" },
  { table: "forum_replies", column: "user_id" },
  { table: "forum_likes", column: "user_id" },
  { table: "certificates", column: "user_id" },
  { table: "testimonials", column: "user_id" },
];

/** GDPR export: every row that belongs to the user, as JSON. */
export async function exportUserData(userId: string): Promise<Record<string, unknown>> {
  const { db } = await getServices();
  const profile = await db.from("profiles").get(userId);
  const out: Record<string, unknown> = { exported_at: nowIso(), profile };
  for (const { table, column } of USER_TABLES) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    out[table] = await (db.from(table) as any).list({ where: { [column]: userId } });
  }
  out["partner_links"] = [
    ...(await db.from("partner_links").list({ where: { owner_user_id: userId } })),
    ...(await db.from("partner_links").list({ where: { partner_user_id: userId } })),
  ];
  return out;
}

/**
 * Deletes an account: credentials, private content, progress, community
 * posts (replaced by "Deleted member"), uploads. Orders are kept (anonymised)
 * for accounting. Used by self-service deletion and by admin "remove user".
 */
export async function deleteUserAccount(userId: string, actorUserId: string | null): Promise<{ ok: boolean; error?: string }> {
  const { db, auth, storage } = await getServices();
  const profile = await db.from("profiles").get(userId);
  if (!profile) return { ok: false, error: "User not found" };
  if (profile.role === "admin") {
    const admins = await db.from("profiles").list({ where: { role: "admin" } });
    if (admins.filter((a) => !a.deleted_at).length <= 1) return { ok: false, error: "You cannot delete the last admin account" };
  }
  await db.transaction(async (tx) => {
    const now = nowIso();
    for (const table of ["enrollments", "subscriptions", "lesson_progress", "action_step_completions", "xp_ledger", "user_badges", "streaks", "quiz_responses", "notes", "forum_likes", "certificates", "testimonials"] as TableName[]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (tx.from(table) as any).deleteWhere({ user_id: userId });
    }
    await tx.from("forum_posts").updateWhere({ user_id: userId }, { status: "removed", body: "[deleted]", title: "[deleted]" });
    await tx.from("forum_replies").updateWhere({ user_id: userId }, { status: "removed", body: "[deleted]" });
    await tx.from("partner_links").updateWhere({ owner_user_id: userId }, { status: "revoked" });
    await tx.from("partner_links").updateWhere({ partner_user_id: userId }, { status: "revoked" });
    await tx.from("orders").updateWhere({ user_id: userId }, { email: `deleted-${userId.slice(0, 8)}@example.invalid`, updated_at: now });
    await tx.from("profiles").update(userId, {
      name: "Deleted member",
      email: `deleted-${userId.slice(0, 8)}@example.invalid`,
      avatar_url: null,
      deleted_at: now,
      updated_at: now,
      stripe_customer_id: null,
    });
    await tx.from("audit_log").insert({ id: newId(), actor_user_id: actorUserId, action: "user.deleted", target_type: "profile", target_id: userId, meta: { self: actorUserId === userId }, created_at: now });
  });
  try {
    for (const f of await storage.list({ bucket: "learner-uploads", prefix: `${userId}/` })) await storage.delete({ bucket: "learner-uploads", path: f.path });
  } catch (err) {
    console.warn("[users] upload cleanup failed", err);
  }
  await auth.deleteUser(userId);
  return { ok: true };
}

export async function updateProfile(userId: string, patch: Partial<Pick<Profile, "name" | "avatar_url" | "timezone" | "email_preferences">>): Promise<Profile> {
  const { db } = await getServices();
  return db.from("profiles").update(userId, { ...patch, updated_at: nowIso() });
}

export async function acceptDisclaimer(userId: string): Promise<void> {
  const { db } = await getServices();
  await db.from("profiles").update(userId, { disclaimer_accepted_at: nowIso(), updated_at: nowIso() });
}

export async function logAudit(actorUserId: string | null, action: string, targetType: string, targetId: string | null, meta: Record<string, unknown> = {}) {
  const { db } = await getServices();
  await db.from("audit_log").insert({ id: newId(), actor_user_id: actorUserId, action, target_type: targetType, target_id: targetId, meta, created_at: nowIso() });
}
