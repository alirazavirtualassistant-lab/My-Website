import type { ProductType } from "@/lib/types";

/** Human labels for product types (plain module so both server pages and client forms can import it). */
export const TYPE_LABELS: Record<ProductType, string> = {
  course: "Single course",
  bundle: "Bundle of courses",
  subscription: "Membership (recurring)",
  payment_plan: "Payment plan (instalments)",
};
