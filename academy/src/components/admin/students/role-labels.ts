import type { Role } from "@/lib/types";

/** Human labels for roles (plain module so both server pages and client editors can import it). */
export const ROLE_LABELS: Record<Role, string> = { learner: "Learner", assistant: "Assistant", admin: "Owner (admin)" };
