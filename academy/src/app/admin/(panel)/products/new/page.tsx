import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { ProductForm } from "@/components/admin/products/product-form";
import { getProductForEdit } from "../queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New product", robots: { index: false, follow: false } };

export default async function NewProductPage() {
  await requireRole("admin", "/admin/products/new");
  const { courses } = await getProductForEdit("__new__");
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Link href="/admin/products" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-rose-strong">
        <ArrowLeft className="size-4" aria-hidden="true" /> All products
      </Link>
      <PageHeader eyebrow="Commerce" title="New product" description="Put a price on a course, build a bundle, or open a membership. You can archive it later without affecting anyone who already bought." />
      <div className="card-soft p-5 sm:p-8">
        <ProductForm product={null} courses={courses.map((c) => ({ id: c.id, title: c.title, status: c.status }))} />
      </div>
    </div>
  );
}
