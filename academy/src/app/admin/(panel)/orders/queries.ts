import "server-only";
import { getServices } from "@/services";
import type { Order } from "@/lib/types";

export type OrderStatusFilter = "all" | Order["status"];

export interface OrderRow extends Order {
  buyer_name: string | null;
}

export async function listOrders(status: OrderStatusFilter, q: string | null): Promise<{ rows: OrderRow[]; total: number; totals: { paid_cents: number; refunded_cents: number } }> {
  const { db } = await getServices();
  const where: Partial<Order> = {};
  if (status !== "all") where.status = status;
  const [rows, total, all] = await Promise.all([
    db.from("orders").list({ where, orderBy: ["created_at", "desc"], limit: 200, search: q ? { columns: ["email", "id", "coupon_code"], query: q } : undefined }),
    db.from("orders").count(where),
    db.from("orders").list(),
  ]);
  const userIds = [...new Set(rows.map((o) => o.user_id).filter((id): id is string => !!id))];
  const profiles = userIds.length ? await db.from("profiles").list({ where: { id: userIds } }) : [];
  const nameById = new Map(profiles.map((p) => [p.id, p.deleted_at ? "Deleted member" : p.name]));
  const paid = all.filter((o) => o.status === "paid" || o.status === "partially_refunded" || o.status === "refunded");
  return {
    rows: rows.map((o) => ({ ...o, buyer_name: o.user_id ? (nameById.get(o.user_id) ?? null) : null })),
    total,
    totals: { paid_cents: paid.reduce((n, o) => n + o.total_cents - o.refunded_cents, 0), refunded_cents: all.reduce((n, o) => n + o.refunded_cents, 0) },
  };
}
