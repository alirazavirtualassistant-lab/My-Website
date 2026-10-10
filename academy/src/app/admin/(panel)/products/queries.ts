import "server-only";
import { getServices } from "@/services";
import type { Course, Product } from "@/lib/types";

export interface ProductRow extends Product {
  course_titles: string[];
}

export async function listProductRows(): Promise<{ products: ProductRow[]; courses: Course[] }> {
  const { db } = await getServices();
  const [products, courses] = await Promise.all([db.from("products").list({ orderBy: ["created_at", "asc"] }), db.from("courses").list({ orderBy: ["created_at", "asc"] })]);
  const titleById = new Map(courses.map((c) => [c.id, c.title]));
  return {
    products: products.map((p) => ({ ...p, course_titles: p.grants_all_courses ? ["All courses"] : p.course_ids.map((id) => titleById.get(id) ?? "Unknown course") })),
    courses,
  };
}

export async function getProductForEdit(id: string): Promise<{ product: Product | null; courses: Course[] }> {
  const { db } = await getServices();
  const [product, courses] = await Promise.all([db.from("products").get(id), db.from("courses").list({ orderBy: ["created_at", "asc"] })]);
  return { product, courses: courses.filter((c) => c.status !== "archived") };
}
