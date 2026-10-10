"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, KeyRound, Mail, Receipt, ShieldCheck, UserRound, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const accountTabs: Array<{ label: string; href: string; icon: LucideIcon; exact?: boolean }> = [
  { label: "Profile", href: "/account", icon: UserRound, exact: true },
  { label: "Logins", href: "/account/logins", icon: KeyRound },
  { label: "Emails", href: "/account/emails", icon: Mail },
  { label: "Billing", href: "/account/billing", icon: CreditCard },
  { label: "Purchases", href: "/account/purchases", icon: Receipt },
  { label: "Privacy", href: "/account/privacy", icon: ShieldCheck },
];

/** Horizontal tab-style navigation shared by every /account page (scrolls on small screens). */
function AccountNav({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Account sections" className={cn("-mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0", className)}>
      <ul className="flex w-max min-w-full gap-1 border-b border-border">
        {accountTabs.map(({ label, href, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                  active ? "border-rose text-rose-strong" : "border-transparent text-muted-foreground hover:border-line hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { AccountNav };
