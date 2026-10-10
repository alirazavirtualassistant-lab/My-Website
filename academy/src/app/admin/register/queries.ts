import "server-only";
import { getServices } from "@/services";

/** True when at least one non-deleted admin profile exists. */
export async function liveAdminExists(): Promise<boolean> {
  const { db } = await getServices();
  const admins = await db.from("profiles").list({ where: { role: "admin" } });
  return admins.some((a) => !a.deleted_at);
}
