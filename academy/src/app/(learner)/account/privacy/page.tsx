import type { Metadata } from "next";
import Link from "next/link";
import { Download, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/account/section-card";
import { DeleteAccountDialog } from "@/components/account/delete-account-dialog";
import { requireProfile } from "../_shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Privacy", robots: { index: false } };

export default async function AccountPrivacyPage() {
  const { profile } = await requireProfile("/account/privacy");
  return (
    <>
      <SectionCard
        title="Your data"
        description="Everything we hold about you, in one file."
        actions={
          <Button asChild variant="outline">
            <a href="/api/account/export" download="cradle-your-cravings-export.json">
              <Download aria-hidden="true" /> Export my data
            </a>
          </Button>
        }
      >
        <div className="grid gap-3 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sage-strong" aria-hidden="true" />
            <span>
              The export is a JSON file with your profile, enrolments, progress, notes, quiz answers, community posts and certificates. Read more in our{" "}
              <Link href="/privacy" className="font-semibold text-rose-strong underline-offset-4 hover:underline">
                privacy policy
              </Link>
              .
            </span>
          </p>
        </div>
      </SectionCard>

      <SectionCard tone="danger" title="Delete account" description="Permanent. We'd rather you stayed, but it's your call and we make it simple.">
        <div className="grid gap-4">
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Your progress, notes, uploads, badges and certificates are removed.</li>
            <li>Community posts and replies become “Deleted member”.</li>
            <li>Order records are kept for accounting, with your details anonymised.</li>
            <li>Active memberships are not refunded automatically — cancel them under Billing first if you like.</li>
          </ul>
          <div>
            <DeleteAccountDialog email={profile.email} />
          </div>
        </div>
      </SectionCard>
    </>
  );
}
