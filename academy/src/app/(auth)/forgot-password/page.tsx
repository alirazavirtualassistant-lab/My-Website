import type { Metadata } from "next";
import { getServices } from "@/services";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Reset your password", robots: { index: false } };

export default async function ForgotPasswordPage() {
  const { mode } = await getServices();
  return <ForgotPasswordForm demoMailbox={mode.demo && mode.email === "mock"} />;
}
