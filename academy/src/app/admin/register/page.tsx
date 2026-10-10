import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Settings2, Users } from "lucide-react";
import { env } from "@/lib/env";
import { getSession } from "@/lib/auth/session";
import { ensureBootstrapped } from "@/lib/usecases/demo";
import { Logo } from "@/components/shared/logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { AdminRegisterForm } from "@/components/auth/admin-register-form";
import { registerGuard } from "./logic";
import { liveAdminExists } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Set up the first admin", robots: { index: false, follow: false } };

/**
 * /admin/register — one-time bootstrap for the owner account. Public (the
 * proxy exempts it); the server action re-checks every rule before creating
 * anything. Renders its own <main id="main"> so it does not depend on the
 * admin shell, which must not role-gate this route.
 */
export default async function AdminRegisterPage() {
  await ensureBootstrapped();
  const [adminExists, session] = await Promise.all([liveAdminExists(), getSession()]);
  const guard = registerGuard({ setupCodeConfigured: env.adminSetupCode.length > 0, adminExists, demo: env.demo });

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-cream">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-cream focus-visible:outline-none" aria-label="Cradle Your Cravings Academy home">
          <Logo height={36} />
        </Link>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-rose-strong">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back home
        </Link>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto flex w-full max-w-6xl flex-1 items-start justify-center px-4 pb-16 outline-none sm:px-6 lg:items-center lg:px-8">
        <div className="w-full max-w-[520px]">
          {!guard.allowed && guard.reason === "not_configured" ? (
            <AuthCard eyebrow="Admin setup" title="Registration isn't configured yet">
              <Alert variant="warning">
                <Settings2 />
                <AlertTitle>Set ADMIN_SETUP_CODE first</AlertTitle>
                <AlertDescription>
                  <p>
                    Add a long, random <code className="rounded bg-card px-1 font-mono text-xs">ADMIN_SETUP_CODE</code> to the environment, restart the app, then return here to create the owner account.
                  </p>
                </AlertDescription>
              </Alert>
            </AuthCard>
          ) : !guard.allowed ? (
            <AuthCard eyebrow="Admin setup" title="An admin already exists">
              <Alert variant="info">
                <Users />
                <AlertTitle>Ask them to add you</AlertTitle>
                <AlertDescription>
                  <p>The owner can invite team members from Admin → Team. Registration here is closed to keep the site safe.</p>
                </AlertDescription>
              </Alert>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild>
                  <Link href={session ? "/admin" : "/sign-in?next=%2Fadmin"}>{session ? "Go to admin" : "Sign in"}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Back home</Link>
                </Button>
              </div>
            </AuthCard>
          ) : (
            <AuthCard
              eyebrow="Admin setup"
              title={guard.reason === "first_admin" ? "Create the owner account" : "Create an extra admin"}
              description={
                guard.reason === "first_admin"
                  ? "This runs once. The account you create here owns the admin panel, billing and team settings."
                  : "Demo mode lets you add another admin for evaluation. On a live site this page closes once an admin exists."
              }
            >
              <div className="mb-5 flex items-start gap-2 rounded-lg border border-sage/40 bg-sage-soft/60 px-3 py-2 text-xs text-foreground/90" role="note">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-sage-strong" aria-hidden="true" />
                <span>The setup code is checked in constant time and never shown. The account is verified automatically.</span>
              </div>
              <AdminRegisterForm />
            </AuthCard>
          )}
        </div>
      </main>
    </div>
  );
}
