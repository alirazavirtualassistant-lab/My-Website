import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { ProductForm } from "@/components/admin/products/product-form";
import { getProductForEdit } from "../queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit product", robots: { index: false, follow: false } };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireRole("admin", `/admin/products/${id}`);
  const { product, courses } = await getProductForEdit(id);
  if (!product) notFound();
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Link href="/admin/products" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-rose-strong">
        <ArrowLeft className="size-4" aria-hidden="true" /> All products
      </Link>
      <PageHeader
        eyebrow="Commerce"
        title={product.title}
        description={`Last updated ${formatDate(product.updated_at, { month: "long", day: "numeric", year: "numeric" })}`}
        actions={<Badge variant={product.active ? "success" : "muted"}>{product.active ? "Active" : "Archived"}</Badge>}
      />
      <div className="card-soft p-5 sm:p-8">
        <ProductForm product={product} courses={courses.map((c) => ({ id: c.id, title: c.title, status: c.status }))} />
      </div>
      {product.stripe_product_id ? (
        <dl className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-3">
          <div>
            <dt className="font-semibold uppercase tracking-wider">Provider product</dt>
            <dd className="truncate font-mono">{product.stripe_product_id}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wider">Price id</dt>
            <dd className="truncate font-mono">{product.stripe_price_id ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wider">Sale price id</dt>
            <dd className="truncate font-mono">{product.stripe_sale_price_id ?? "—"}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
