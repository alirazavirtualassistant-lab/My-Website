import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Ticket } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { formatDate, formatMoney } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionButton } from "@/components/admin/students/action-button";
import { CopyLinkButton } from "@/components/admin/coupons/copy-link-button";
import { listCouponRows, type CouponState } from "./queries";
import { setCouponActiveAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Coupons", robots: { index: false, follow: false } };

const stateVariant: Record<CouponState, "success" | "muted" | "gold" | "rose"> = { active: "success", inactive: "muted", expired: "gold", exhausted: "rose" };
const stateLabel: Record<CouponState, string> = { active: "Active", inactive: "Inactive", expired: "Expired", exhausted: "Fully used" };

export default async function AdminCouponsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireRole("admin", "/admin/coupons");
  const [{ coupons }, sp] = await Promise.all([listCouponRows(), searchParams]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        eyebrow="Commerce"
        title="Coupons"
        description="Discount codes for checkout. Share the code, or copy an auto-apply link that fills it in for people."
        actions={
          <Button asChild>
            <Link href="/admin/coupons/new">
              <Plus aria-hidden="true" /> New coupon
            </Link>
          </Button>
        }
      />

      {sp.saved ? (
        <Alert variant="success">
          <AlertTitle>Saved</AlertTitle>
          <AlertDescription>
            <p>Coupon {sp.saved} is saved and mirrored to the payment provider.</p>
          </AlertDescription>
        </Alert>
      ) : null}

      {coupons.length === 0 ? (
        <EmptyState
          icon={<Ticket />}
          title="No coupons yet"
          description="Create one for a launch, a partner, or a gentle nudge to someone on the fence."
          action={
            <Button asChild>
              <Link href="/admin/coupons/new">New coupon</Link>
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Applies to</TableHead>
              <TableHead className="text-right">Uses</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((c) => (
              <TableRow key={c.id} className={c.state === "active" ? undefined : "opacity-80"}>
                <TableCell>
                  <Link href={`/admin/coupons/${c.id}`} className="font-mono font-semibold tracking-wider text-foreground hover:text-rose-strong hover:underline">
                    {c.code}
                  </Link>
                  {c.stripe_promotion_code_id ? <span className="block max-w-[160px] truncate font-mono text-[11px] text-muted-foreground">{c.stripe_promotion_code_id}</span> : null}
                </TableCell>
                <TableCell className="font-semibold tabular-nums">{c.kind === "percent" ? `${c.amount}% off` : `${formatMoney(c.amount)} off`}</TableCell>
                <TableCell className="max-w-[220px] truncate text-sm text-muted-foreground">{c.product_ids.length === 0 ? "All products" : c.product_titles.join(", ")}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {c.uses}
                  {c.max_uses !== null ? <span className="text-muted-foreground"> / {c.max_uses}</span> : null}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.expires_at ? formatDate(c.expires_at, { month: "short", day: "numeric", year: "numeric" }) : "Never"}</TableCell>
                <TableCell>
                  <Badge variant={stateVariant[c.state]}>{stateLabel[c.state]}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-1">
                    <CopyLinkButton url={c.auto_apply_url} variant="ghost" />
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/coupons/${c.id}`}>Edit</Link>
                    </Button>
                    <ActionButton action={setCouponActiveAction} fields={{ id: c.id, active: c.active ? "0" : "1" }} variant="ghost" size="sm" pendingLabel="Saving…" className={c.active ? "text-danger hover:bg-danger-soft hover:text-danger" : undefined}>
                      {c.active ? "Deactivate" : "Activate"}
                    </ActionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <p className="text-xs text-muted-foreground">
        Auto-apply links look like <code className="rounded bg-card px-1 font-mono">/courses/baby-steps?coupon=CODE</code>: the course page reads the code and carries it into checkout.
      </p>
    </div>
  );
}
