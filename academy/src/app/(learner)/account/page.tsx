import type { Metadata } from "next";
import { groupTimeZones } from "@/components/auth/logic";
import { SectionCard } from "@/components/account/section-card";
import { ProfileForm } from "@/components/account/profile-form";
import { requireProfile } from "./_shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Profile", robots: { index: false } };

function supportedTimeZones(): string[] {
  try {
    return Intl.supportedValuesOf("timeZone");
  } catch {
    return ["UTC"];
  }
}

export default async function AccountProfilePage() {
  const { profile } = await requireProfile("/account");
  const timeZones = groupTimeZones(supportedTimeZones());
  return (
    <SectionCard title="Profile" description="How you appear across the Academy.">
      <ProfileForm profile={{ name: profile.name, email: profile.email, avatar_url: profile.avatar_url, role: profile.role, timezone: profile.timezone }} timeZones={timeZones} />
    </SectionCard>
  );
}
