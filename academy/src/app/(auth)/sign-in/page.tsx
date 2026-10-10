import type { Metadata } from "next";
import { getServices } from "@/services";
import { safeRedirectPath } from "@/lib/utils";
import { SignInForm, type SignInFormProps } from "@/components/auth/sign-in-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign in", description: "Sign in to Cradle Your Cravings Academy." };

const NOTICES: Record<string, NonNullable<SignInFormProps["notice"]>> = {
  link: { tone: "warning", title: "That link didn't work", body: "It may have expired or already been used. Sign in below, or request a fresh link." },
  oauth: { tone: "warning", title: "Google sign-in didn't complete", body: "No changes were made. You can try again or use your email instead." },
  deleted: { tone: "success", title: "Your account has been deleted", body: "Thank you for walking with us. You're always welcome back." },
  reset: { tone: "success", title: "Your password was saved", body: "Sign in with your new password whenever you're ready." },
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string; notice?: string; email?: string }> }) {
  const { next, error, notice, email } = await searchParams;
  const { mode } = await getServices();
  const key = error ?? notice ?? "";
  return (
    <SignInForm
      next={safeRedirectPath(next, "/learn")}
      demoMailbox={mode.demo && mode.email === "mock"}
      notice={NOTICES[key] ?? null}
      email={typeof email === "string" && email.length < 255 ? email : undefined}
    />
  );
}
