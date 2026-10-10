import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { CouponForm } from "@/components/admin/coupons/coupon-form";
import { getCouponForEdit } from "../queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New coupon", robots: { index: false, follow: false } };

export default async function NewCouponPage() {
  await requireRole("admin", "/admin/coupons/new");
  const { products } = await getCouponForEdit("__new__");
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Link href="/admin/coupons" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-rose-strong">
        <ArrowLeft className="size-4" aria-hidden="true" /> All coupons
      </Link>
      <PageHeader eyebrow="Commerce" title="New coupon" description="Percent or fixed amount off, with an optional expiry, usage limit and product scope." />
      <div className="card-soft p-5 sm:p-8">
        <CouponForm coupon={null} products={products.map((p) => ({ id: p.id, title: p.title }))} />
      </div>
    </div>
  );
}
