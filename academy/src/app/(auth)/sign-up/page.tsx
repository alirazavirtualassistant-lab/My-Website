import type { Metadata } from "next";
import { getServices } from "@/services";
import { safeRedirectPath } from "@/lib/utils";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Create your account",
  description: "Join Cradle Your Cravings Academy. Small, science-backed, heart-led steps toward family wellness.",
};

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const { mode } = await getServices();
  return <SignUpForm next={safeRedirectPath(next, "/learn")} demoMailbox={mode.demo && mode.email === "mock"} />;
}
