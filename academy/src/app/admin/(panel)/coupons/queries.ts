import "server-only";
import { getServices } from "@/services";
import type { Coupon, Course, Product } from "@/lib/types";
import { site } from "@/lib/config/site";
import { couponValidityError } from "@/lib/domain/pricing";

export type CouponState = "active" | "inactive" | "expired" | "exhausted";

export interface CouponRow extends Coupon {
  state: CouponState;
  product_titles: string[];
  auto_apply_url: string;
}

export function couponState(coupon: Pick<Coupon, "active" | "expires_at" | "max_uses" | "uses">, now: Date): CouponState {
  if (!coupon.active) return "inactive";
  const err = couponValidityError(coupon, now);
  if (!err) return "active";
  if (err.includes("expired")) return "expired";
  if (err.includes("redeemed")) return "exhausted";
  return "inactive";
}

/** `${site.url}/courses/<slug>?coupon=CODE` — the public course page reads ?coupon and passes it to buyNow. */
export function autoApplyUrl(coupon: Pick<Coupon, "code" | "product_ids">, products: ReadonlyArray<Pick<Product, "id" | "course_ids">>, courses: ReadonlyArray<Pick<Course, "id" | "slug" | "status">>): string {
  const courseById = new Map(courses.map((c) => [c.id, c]));
  let slug: string | null = null;
  for (const pid of coupon.product_ids) {
    const product = products.find((p) => p.id === pid);
    const course = product?.course_ids.map((id) => courseById.get(id)).find(Boolean);
    if (course) {
      slug = course.slug;
      break;
    }
  }
  slug ??= courses.find((c) => c.status === "published")?.slug ?? courses[0]?.slug ?? "baby-steps";
  return `${site.url}/courses/${slug}?coupon=${encodeURIComponent(coupon.code)}`;
}

export async function listCouponRows(): Promise<{ coupons: CouponRow[]; products: Product[] }> {
  const { db } = await getServices();
  const [coupons, products, courses] = await Promise.all([
    db.from("coupons").list({ orderBy: ["created_at", "desc"] }),
    db.from("products").list({ orderBy: ["created_at", "asc"] }),
    db.from("courses").list({ orderBy: ["created_at", "asc"] }),
  ]);
  const titleById = new Map(products.map((p) => [p.id, p.title]));
  const now = new Date();
  return {
    coupons: coupons.map((c) => ({
      ...c,
      state: couponState(c, now),
      product_titles: c.product_ids.map((id) => titleById.get(id) ?? "Unknown product"),
      auto_apply_url: autoApplyUrl(c, products, courses),
    })),
    products,
  };
}

export async function getCouponForEdit(id: string): Promise<{ coupon: Coupon | null; products: Product[] }> {
  const { db } = await getServices();
  const [coupon, products] = await Promise.all([db.from("coupons").get(id), db.from("products").list({ orderBy: ["created_at", "asc"] })]);
  return { coupon, products: products.filter((p) => p.active) };
}
