import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Receipt } from "lucide-react";
import { formatDate, formatMoney } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionButton } from "@/components/admin/students/action-button";
import { ConfirmActionDialog } from "@/components/admin/students/confirm-action-dialog";
import { StudentsSearch } from "@/components/admin/students/students-search";
import { refundOrderAction, resendReceiptAction } from "../students/actions";
import { listOrders, type OrderStatusFilter } from "./queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Orders", robots: { index: false, follow: false } };

const orderVariant = { paid: "success", pending: "muted", refunded: "rose", partially_refunded: "gold", failed: "rose" } as const;
const STATUSES: Array<{ key: OrderStatusFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "paid", label: "Paid" },
  { key: "pending", label: "Pending" },
  { key: "refunded", label: "Refunded" },
  { key: "partially_refunded", label: "Partially refunded" },
  { key: "failed", label: "Failed" },
];

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const sp = await searchParams;
  const status = (STATUSES.some((s) => s.key === sp.status) ? sp.status : "all") as OrderStatusFilter;
  const q = sp.q?.trim().slice(0, 120) || null;
  const { rows, total, totals } = await listOrders(status, q);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader eyebrow="Commerce" title="Orders" description="Every checkout, paid or not. Refunds go through the payment provider and remove the access the order granted." />
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Net revenue" value={formatMoney(totals.paid_cents)} tone="sage" icon={<Receipt />} hint="Paid orders minus refunds, all time" />
        <StatCard label="Refunded" value={formatMoney(totals.refunded_cents)} tone="rose" icon={<Receipt />} />
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <nav aria-label="Order status" className="inline-flex h-11 w-fit max-w-full items-center gap-1 overflow-x-auto rounded-lg bg-muted-bg p-1 no-scrollbar">
          {STATUSES.map((s) => (
            <Link
              key={s.key}
              href={`/admin/orders?status=${s.key}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              aria-current={status === s.key ? "page" : undefined}
              className={`inline-flex h-9 items-center rounded-md px-3 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${status === s.key ? "bg-card text-rose-strong shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
            >
              {s.label}
            </Link>
          ))}
        </nav>
        <StudentsSearch initialQuery={q ?? ""} basePath="/admin/orders" placeholder="Email, order id or coupon" />
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={<Receipt />} title="No orders match" description={q || status !== "all" ? "Try another status or search." : "Orders appear here as soon as someone checks out."} size="sm" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="text-muted-foreground">
                  {formatDate(o.paid_at ?? o.created_at, { month: "short", day: "numeric", year: "numeric" })}
                  <span className="block font-mono text-[11px]">{o.id.slice(0, 8)}</span>
                </TableCell>
                <TableCell>
                  {o.user_id ? (
                    <Link href={`/admin/students/${o.user_id}`} className="block max-w-[200px] truncate font-semibold hover:text-rose-strong hover:underline">
                      {o.buyer_name ?? o.email}
                    </Link>
                  ) : (
                    <span className="block max-w-[200px] truncate font-semibold">{o.email || "Guest"}</span>
                  )}
                  <span className="block max-w-[200px] truncate text-xs text-muted-foreground">{o.email}</span>
                  {o.gift ? <Badge variant="gold" className="mt-1">Gift</Badge> : null}
                </TableCell>
                <TableCell className="max-w-[260px] truncate">{o.items.map((i) => `${i.title}${i.quantity > 1 ? ` ×${i.quantity}` : ""}`).join(", ")}</TableCell>
                <TableCell>
                  <Badge variant={orderVariant[o.status]} className="capitalize">
                    {o.status.replace("_", " ")}
                  </Badge>
                  {o.coupon_code ? <span className="block font-mono text-[11px] text-muted-foreground">{o.coupon_code}</span> : null}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatMoney(o.total_cents, o.currency)}
                  {o.refunded_cents > 0 ? <span className="block text-xs text-muted-foreground">−{formatMoney(o.refunded_cents, o.currency)}</span> : null}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-1">
                    {["paid", "partially_refunded", "refunded"].includes(o.status) ? (
                      <ActionButton action={resendReceiptAction} fields={{ order_id: o.id }} variant="ghost" size="sm" pendingLabel="Sending…">
                        <Mail aria-hidden="true" /> Resend receipt
                      </ActionButton>
                    ) : null}
                    {o.status === "paid" ? (
                      <ConfirmActionDialog
                        action={refundOrderAction}
                        fields={{ order_id: o.id }}
                        trigger={
                          <Button variant="ghost" size="sm" className="text-danger hover:bg-danger-soft hover:text-danger">
                            Refund
                          </Button>
                        }
                        title={`Refund ${formatMoney(o.total_cents, o.currency)}?`}
                        description={`The full amount goes back to the original payment method and the access this order granted is removed for ${o.buyer_name ?? o.email}.`}
                        confirmLabel="Issue refund"
                      />
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {total > rows.length ? <p className="text-xs text-muted-foreground">Showing the newest {rows.length} of {total}. Narrow by status or search to see older ones.</p> : null}
    </div>
  );
}
