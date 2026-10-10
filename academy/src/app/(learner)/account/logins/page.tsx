import type { Metadata } from "next";
import { CircleCheck, KeyRound, Mail, Sparkles } from "lucide-react";
import { getServices } from "@/services";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/account/section-card";
import { PasswordChangeForm } from "@/components/account/password-change-form";
import { MagicLinkSelfButton } from "@/components/account/magic-link-self-button";
import { requireProfile } from "../_shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Logins", robots: { index: false } };

type ProviderKey = "password" | "magic_link" | "google";

const PROVIDERS: Array<{ key: ProviderKey; label: string; description: string; icon: typeof KeyRound }> = [
  { key: "password", label: "Email & password", description: "Sign in with your email and a password.", icon: KeyRound },
  { key: "magic_link", label: "Magic link", description: "A one-time link emailed to you. Always available.", icon: Sparkles },
  { key: "google", label: "Google", description: "Continue with your Google account.", icon: Mail },
];

/** Which sign-in methods this account has used, from whichever auth backend is active. */
async function connectedProviders(userId: string): Promise<{ providers: Set<ProviderKey>; hasPassword: boolean }> {
  const { db } = await getServices();
  const providers = new Set<ProviderKey>();
  let hasPassword = false;
  if (db.kind === "mock") {
    const user = await db.from("auth_users").get(userId);
    for (const p of user?.providers ?? []) providers.add(p);
    hasPassword = !!user?.password_hash;
  } else {
    try {
      const { createServerSupabase } = await import("@/services/supabase/client");
      const supabase = await createServerSupabase();
      const { data } = await supabase.auth.getUser();
      for (const identity of data.user?.identities ?? []) {
        if (identity.provider === "email") {
          providers.add("password");
          hasPassword = true;
        } else if (identity.provider === "google") providers.add("google");
      }
    } catch (err) {
      console.warn("[account/logins] could not read identities", err);
    }
  }
  // Magic links work for every account.
  providers.add("magic_link");
  return { providers, hasPassword };
}

export default async function AccountLoginsPage() {
  const { session, profile } = await requireProfile("/account/logins");
  const [{ mode }, connected] = await Promise.all([getServices(), connectedProviders(session.user_id)]);
  const demoMailbox = mode.demo && mode.email === "mock";
  return (
    <>
      <SectionCard title="Ways to sign in" description={`Methods connected to ${profile.email}.`}>
        <ul className="divide-y divide-border">
          {PROVIDERS.map(({ key, label, description, icon: Icon }) => {
            const on = connected.providers.has(key);
            return (
              <li key={key} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div className="flex min-w-0 gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-soft/70 text-rose-strong" aria-hidden="true">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold">{label}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
                <Badge variant={on ? "success" : "muted"} className="mt-1 shrink-0">
                  {on ? (
                    <>
                      <CircleCheck aria-hidden="true" /> Connected
                    </>
                  ) : (
                    "Not used yet"
                  )}
                </Badge>
              </li>
            );
          })}
        </ul>
        <div className="mt-5 border-t border-border pt-5">
          <p className="mb-3 text-sm text-muted-foreground">Locked out on another device? Send yourself a one-time sign-in link.</p>
          <MagicLinkSelfButton demoMailbox={demoMailbox} />
        </div>
      </SectionCard>

      <SectionCard title="Password" description={connected.hasPassword ? "Choose a new password. You'll stay signed in here." : "Add a password to sign in without waiting for an email."}>
        <PasswordChangeForm hasPassword={connected.hasPassword} />
      </SectionCard>
    </>
  );
}
