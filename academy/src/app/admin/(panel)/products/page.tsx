import type { Metadata } from "next";
import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getServices } from "@/services";
import { formatDate, formatMoney } from "@/lib/utils";
import { isSaleActive } from "@/lib/domain/pricing";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionButton } from "@/components/admin/students/action-button";
import { TYPE_LABELS } from "@/components/admin/products/product-types";
import { listProductRows } from "./queries";
import { setProductActiveAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Products", robots: { index: false, follow: false } };

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireRole("admin", "/admin/products");
  const [{ products }, { mode }, sp] = await Promise.all([listProductRows(), getServices(), searchParams]);
  const now = new Date();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        eyebrow="Commerce"
        title="Products"
        description="What people can buy: single courses, bundles, the All-Access membership and payment plans."
        actions={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus aria-hidden="true" /> New product
            </Link>
          </Button>
        }
      />

      {sp.saved ? (
        <Alert variant="success">
          <AlertTitle>Saved</AlertTitle>
          <AlertDescription>
            <p>“{sp.saved}” is saved and mirrored to {mode.payments === "stripe" ? "Stripe" : "the mock payment provider"}.</p>
          </AlertDescription>
        </Alert>
      ) : null}

      <Alert variant="warning">
        <AlertTitle>Placeholder prices — CONFIRM WITH CYNTHIA</AlertTitle>
        <AlertDescription>
          <p>
            The seeded products come from the placeholders in <code className="rounded bg-card px-1 font-mono text-xs">src/lib/config/site.ts</code> ($197 one-time, 3 × $69 plan, $29/mo and $249/yr All-Access). Edit them here before launch.
            {mode.payments === "mock" ? " Payments are in mock mode, so the provider ids below are stand-ins." : ""}
          </p>
        </AlertDescription>
      </Alert>

      {products.length === 0 ? (
        <EmptyState
          icon={<Package />}
          title="No products yet"
          description="Create one to put a price on a course, sell a bundle, or open a membership."
          action={
            <Button asChild>
              <Link href="/admin/products/new">New product</Link>
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Sale</TableHead>
              <TableHead>Billing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Provider ids</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => {
              const saleOn = isSaleActive(p, now);
              return (
                <TableRow key={p.id} className={p.active ? undefined : "opacity-70"}>
                  <TableCell>
                    <Link href={`/admin/products/${p.id}`} className="group block max-w-[280px] rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                      <span className="block truncate font-semibold group-hover:text-rose-strong group-hover:underline">{p.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        /{p.slug} · {p.course_titles.join(", ") || "No courses"}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{TYPE_LABELS[p.type]}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{p.is_free ? <Badge variant="success">Free</Badge> : formatMoney(p.price_cents, p.currency)}</TableCell>
                  <TableCell>
                    {p.sale_price_cents !== null ? (
                      <span className="text-sm">
                        <span className={saleOn ? "font-semibold text-sage-strong" : "text-muted-foreground line-through"}>{formatMoney(p.sale_price_cents, p.currency)}</span>
                        <span className="block text-xs text-muted-foreground">{p.sale_ends_at ? `${saleOn ? "ends" : "ended"} ${formatDate(p.sale_ends_at, { month: "short", day: "numeric" })}` : "no end date"}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {p.type === "subscription" ? `per ${p.interval ?? "month"}` : p.type === "payment_plan" ? `${p.installments ?? "?"} monthly instalments` : "one-time"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.active ? "success" : "muted"}>{p.active ? "Active" : "Archived"}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="block max-w-[180px] truncate font-mono text-[11px] text-muted-foreground" title={[p.stripe_product_id, p.stripe_price_id, p.stripe_sale_price_id].filter(Boolean).join("\n")}>
                      {p.stripe_product_id ?? "not synced"}
                    </span>
                    {p.stripe_price_id ? <span className="block max-w-[180px] truncate font-mono text-[11px] text-muted-foreground">{p.stripe_price_id}</span> : null}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/products/${p.id}`}>Edit</Link>
                      </Button>
                      <ActionButton action={setProductActiveAction} fields={{ id: p.id, active: p.active ? "0" : "1" }} variant="ghost" size="sm" pendingLabel="Saving…" className={p.active ? "text-danger hover:bg-danger-soft hover:text-danger" : undefined}>
                        {p.active ? "Archive" : "Restore"}
                      </ActionButton>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
