import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { CouponForm } from "@/components/admin/coupons/coupon-form";
import { CopyLinkButton } from "@/components/admin/coupons/copy-link-button";
import { autoApplyUrl, getCouponForEdit } from "../queries";
import { getServices } from "@/services";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit coupon", robots: { index: false, follow: false } };

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireRole("admin", `/admin/coupons/${id}`);
  const { coupon, products } = await getCouponForEdit(id);
  if (!coupon) notFound();
  const { db } = await getServices();
  const courses = await db.from("courses").list();
  const link = autoApplyUrl(coupon, products, courses);
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Link href="/admin/coupons" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-rose-strong">
        <ArrowLeft className="size-4" aria-hidden="true" /> All coupons
      </Link>
      <PageHeader eyebrow="Commerce" title={coupon.code} description={`Used ${coupon.uses} time${coupon.uses === 1 ? "" : "s"}.`} actions={<CopyLinkButton url={link} size="md" />} />
      <div className="card-soft p-5 sm:p-8">
        <CouponForm coupon={coupon} products={products.map((p) => ({ id: p.id, title: p.title }))} />
      </div>
      <p className="text-xs text-muted-foreground">
        Auto-apply link: <code className="break-all rounded bg-card px-1 font-mono">{link}</code>
      </p>
    </div>
  );
}
