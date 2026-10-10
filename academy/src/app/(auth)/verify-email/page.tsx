import type { Metadata } from "next";
import { getServices } from "@/services";
import { getSession } from "@/lib/auth/session";
import { safeRedirectPath, isValidEmail } from "@/lib/utils";
import { VerifyEmailPanel } from "@/components/auth/verify-email-panel";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Verify your email", robots: { index: false } };

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string; next?: string; email?: string }> }) {
  const { token, next, email } = await searchParams;
  const [{ mode }, session] = await Promise.all([getServices(), getSession()]);
  const hint = typeof email === "string" && isValidEmail(email) ? email.trim().toLowerCase() : null;
  return (
    <VerifyEmailPanel
      token={token && token.length >= 16 ? token : null}
      next={safeRedirectPath(next, "/learn")}
      knownEmail={session?.email ?? hint}
      signedIn={session !== null}
      demoMailbox={mode.demo && mode.email === "mock"}
    />
  );
}
