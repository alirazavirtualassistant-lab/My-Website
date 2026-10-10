import * as React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { AccountNav } from "@/components/account/account-nav";

/** Shared header + tabs for every /account page. The (learner) layout handles auth + the shell. */
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Your account" title="Account" description="Your details, logins, emails and billing — all in one calm place." />
      <AccountNav />
      <div className="grid gap-6">{children}</div>
    </div>
  );
}
