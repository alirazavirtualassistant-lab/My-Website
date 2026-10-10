import type { Metadata } from "next";
import Link from "next/link";
import { MailWarning } from "lucide-react";
import { getServices } from "@/services";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Choose a new password", robots: { index: false } };

/**
 * `?token=` is the single-use token (mock) or a token hash forwarded by
 * /auth/callback (Supabase recovery links). Supabase's PKCE recovery flow
 * exchanges the code in the callback instead and lands here with a session,
 * so a signed-in user without a token can still set a password.
 */
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; welcome?: string }> }) {
  const { token = "", welcome } = await searchParams;
  const { auth } = await getServices();
  const isWelcome = welcome === "1" || welcome === "true";
  const canProceed = token.length >= 16 || (auth.kind === "supabase" && (await getSession()) !== null);

  if (!canProceed) {
    return (
      <AuthCard eyebrow="Hmm" title="This link isn't complete">
        <div className="grid gap-5">
          <div role="alert" className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning-soft p-4 text-sm">
            <MailWarning className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
            <p className="text-foreground/90">The reset link is missing its token, or it has already been used. Ask for a new one and open the latest email.</p>
          </div>
          <Button asChild size="lg" className="w-full">
            <Link href="/forgot-password">Request a new link</Link>
          </Button>
        </div>
      </AuthCard>
    );
  }
  return <ResetPasswordForm token={token} welcome={isWelcome} />;
}
