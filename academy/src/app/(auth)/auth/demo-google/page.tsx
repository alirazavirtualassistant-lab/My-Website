import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServices } from "@/services";
import { safeRedirectPath } from "@/lib/utils";
import { DemoGooglePicker } from "@/components/auth/demo-google-picker";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Choose a demo account", robots: { index: false } };

/** Demo-only stand-in for Google's account chooser. 404 outside demo/mock mode. */
export default async function DemoGooglePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { auth, mode } = await getServices();
  if (!mode.demo || auth.kind !== "mock") notFound();
  const { next } = await searchParams;
  const { DEMO_ACCOUNTS } = await import("@/services/mock/seed");
  const accounts = DEMO_ACCOUNTS.map((a) => ({ email: a.email, name: a.name, role: a.role, description: a.description }));
  return <DemoGooglePicker accounts={accounts} next={safeRedirectPath(next, "/learn")} />;
}
