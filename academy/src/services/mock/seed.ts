/**
 * Demo accounts for mock mode. Idempotent: safe to run on every boot.
 *
 * Creates credentials + profiles only. Enrollments and course content are
 * seeded elsewhere (scripts/seed.ts + the course importer).
 *
 * Works with either auth adapter because it only uses `ensureAccount`
 * (passwordless, verified) and `adminSetPassword`, neither of which touches
 * request cookies — so it can run from scripts as well as route handlers.
 */
import type { Role } from "@/lib/types";
import { normalizeEmail, nowIso } from "@/lib/utils";
import type { AuthProvider, DataStore } from "@/services/types";

export interface DemoAccount {
  key: "admin" | "learner" | "partner" | "assistant";
  email: string;
  password: string;
  name: string;
  role: Role;
  description: string;
}

/** Demo credentials (also listed in the README). Demo mode only. */
export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  {
    key: "admin",
    email: "cynthia@demo.cradleyourcravings.com",
    password: "Admin!demo1",
    name: "Cynthia Myers Morrison",
    role: "admin",
    description: "Owner / instructor account with the full admin panel.",
  },
  {
    key: "learner",
    email: "learner@demo.cradleyourcravings.com",
    password: "BabySteps!demo1",
    name: "Demo Learner",
    role: "learner",
    description: "A learner account (enrolled by the content seed).",
  },
  {
    key: "partner",
    email: "partner@demo.cradleyourcravings.com",
    password: "Partner!demo1",
    name: "Demo Partner",
    role: "learner",
    description: "The learner's partner seat.",
  },
  {
    key: "assistant",
    email: "assistant@demo.cradleyourcravings.com",
    password: "Assist!demo1",
    name: "Demo Assistant",
    role: "assistant",
    description: "Team member: admin minus billing, settings and team.",
  },
] as const;

export function demoAccount(key: DemoAccount["key"]): DemoAccount {
  const found = DEMO_ACCOUNTS.find((a) => a.key === key);
  if (!found) throw new Error(`unknown demo account "${key}"`);
  return found;
}

export interface SeedDemoAccountsResult {
  created: string[];
  existing: string[];
  ids: Record<DemoAccount["key"], string>;
}

/**
 * Creates the demo accounts that are missing and makes sure each has the
 * expected name, role, verified email and password. Returns the profile ids
 * keyed by account so later seed steps can create enrollments.
 */
export async function seedDemoAccounts(db: DataStore, auth: AuthProvider): Promise<SeedDemoAccountsResult> {
  const result: SeedDemoAccountsResult = { created: [], existing: [], ids: { admin: "", learner: "", partner: "", assistant: "" } };

  for (const account of DEMO_ACCOUNTS) {
    const emailAddress = normalizeEmail(account.email);
    const { profile, created } = await auth.ensureAccount({ email: emailAddress, name: account.name, sendSetPassword: false });
    result.ids[account.key] = profile.id;

    const patch: Partial<typeof profile> = {};
    if (profile.name !== account.name) patch.name = account.name;
    if (profile.role !== account.role) patch.role = account.role;
    if (profile.deleted_at) patch.deleted_at = null;
    if (Object.keys(patch).length > 0) {
      await db.from("profiles").update(profile.id, { ...patch, updated_at: nowIso() });
    }

    if (created) {
      await auth.adminSetPassword({ userId: profile.id, password: account.password });
      result.created.push(emailAddress);
    } else {
      // Keep demo passwords predictable if someone changed them while playing.
      if (db.kind === "mock") {
        const user = await db.from("auth_users").get(profile.id);
        if (!user?.password_hash) await auth.adminSetPassword({ userId: profile.id, password: account.password });
      }
      result.existing.push(emailAddress);
    }
  }

  return result;
}
