import type { Metadata } from "next";
import { SectionCard } from "@/components/account/section-card";
import { EmailPreferencesForm } from "@/components/account/email-preferences-form";
import { requireProfile } from "../_shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Email preferences", robots: { index: false } };

export default async function AccountEmailsPage() {
  const { profile } = await requireProfile("/account/emails");
  return (
    <SectionCard title="Email preferences" description={`What we send to ${profile.email}. Change your mind any time.`}>
      <EmailPreferencesForm preferences={profile.email_preferences} />
    </SectionCard>
  );
}
