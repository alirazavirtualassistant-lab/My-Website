import * as React from "react";
import { Activity, CalendarDays, CircleDollarSign, Repeat, Sparkles, Users } from "lucide-react";
import type { AdminDashboardStats } from "@/lib/usecases/admin";
import { formatMoney, pluralize } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";

/** The six headline numbers. Revenue is net of refunds. */
function StatGrid({ stats }: { stats: AdminDashboardStats }) {
  const { revenue, students, mrr_cents, orders_last30 } = stats;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard label="Revenue today" value={formatMoney(revenue.today_cents)} hint="Net of refunds" icon={<CircleDollarSign />} tone="rose" />
      <StatCard label="Revenue · 30 days" value={formatMoney(revenue.last30_cents)} hint={`${pluralize(orders_last30, "paid order")} in the last 30 days`} icon={<CalendarDays />} tone="gold" />
      <StatCard label="Revenue · all time" value={formatMoney(revenue.all_time_cents)} hint={revenue.refunded_cents > 0 ? `${formatMoney(revenue.refunded_cents)} refunded` : "No refunds yet"} icon={<Sparkles />} />
      <StatCard label="New students · 30 days" value={students.new_last30.toLocaleString("en-US")} hint={`${students.total.toLocaleString("en-US")} learners in total`} icon={<Users />} tone="sage" />
      <StatCard label="Active learners · 7 days" value={students.active_last7.toLocaleString("en-US")} hint="Opened a lesson this week" icon={<Activity />} tone="sage" />
      <StatCard label="Monthly recurring revenue" value={formatMoney(mrr_cents)} hint="Active All-Access memberships" icon={<Repeat />} tone="gold" />
    </div>
  );
}

export { StatGrid };
