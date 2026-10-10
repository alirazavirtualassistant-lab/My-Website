import * as React from "react";
import Link from "next/link";
import { ArrowRight, Flag, Quote, RotateCcw, ShoppingBag } from "lucide-react";
import type { AdminDashboardStats } from "@/lib/usecases/admin";
import { pluralize } from "@/lib/utils";

interface QuickLink {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: number;
  hint: string;
  attention: boolean;
}

/** Things that may need a human: pending testimonials, open reports, refunds. */
function QuickLinks({ stats }: { stats: AdminDashboardStats }) {
  const links: QuickLink[] = [
    { href: "/admin/testimonials?status=pending", icon: <Quote />, label: "Pending testimonials", value: stats.pending_testimonials, hint: "Waiting for review", attention: stats.pending_testimonials > 0 },
    { href: "/admin/community?reports=open", icon: <Flag />, label: "Open reports", value: stats.open_reports, hint: "Community posts flagged by members", attention: stats.open_reports > 0 },
    { href: "/admin/students?orders=refunded", icon: <RotateCcw />, label: "Refunded orders", value: stats.refunds, hint: "Full or partial refunds, all time", attention: false },
    { href: "/admin/students", icon: <ShoppingBag />, label: "Orders · 30 days", value: stats.orders_last30, hint: pluralize(stats.orders_last30, "paid order"), attention: false },
  ];
  return (
    <section aria-labelledby="quick-links-title" className="card-soft p-5 sm:p-6">
      <div className="mb-4">
        <p className="eyebrow">Needs a look</p>
        <h2 id="quick-links-title" className="mt-1 font-serif text-xl font-medium">
          Quick links
        </h2>
      </div>
      <ul className="divide-y divide-border">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-rose-soft/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              <span aria-hidden="true" className={`flex size-10 shrink-0 items-center justify-center rounded-lg [&>svg]:size-5 ${l.attention ? "bg-gold-soft text-warning" : "bg-muted-bg text-muted-foreground"}`}>
                {l.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">{l.label}</span>
                <span className="block text-xs text-muted-foreground">{l.hint}</span>
              </span>
              <span className="font-serif text-2xl text-foreground tabular-nums">{l.value}</span>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { QuickLinks };
