import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getServices } from "@/services";
import type { Course, CourseTree, Product, ResourceType, SiteSettings, Testimonial } from "@/lib/types";
import { courseStats, getCourseTree, listPublishedCourses, type CourseStats } from "@/lib/usecases/catalog";
import { listProducts } from "@/lib/usecases/access";
import type { CourseCardData } from "@/components/marketing/catalog-data";
import { effectiveUnitPrice } from "@/components/marketing/price";

/** The course product (one-time purchase) that grants this course, if any. */
export function courseProductFor(products: Product[], courseId: string): Product | null {
  return products.find((p) => p.active && p.type === "course" && p.course_ids.includes(courseId)) ?? null;
}

export function paymentPlanFor(products: Product[], courseId: string): Product | null {
  return products.find((p) => p.active && p.type === "payment_plan" && p.course_ids.includes(courseId)) ?? null;
}

export function allAccessProducts(products: Product[]): Product[] {
  return products.filter((p) => p.active && p.type === "subscription" && p.grants_all_courses);
}

export function bundleProducts(products: Product[]): Product[] {
  return products.filter((p) => p.active && p.type === "bundle");
}

export async function thumbnailUrl(course: Pick<Course, "thumbnail_path">): Promise<string | null> {
  if (!course.thumbnail_path) return null;
  const { storage } = await getServices();
  try {
    return storage.getPublicUrl({ bucket: "public-assets", path: course.thumbnail_path });
  } catch {
    return null;
  }
}

export async function toCourseCardData(course: Course, opts: { products?: Product[]; tree?: CourseTree | null; enrollmentCount?: number } = {}): Promise<CourseCardData> {
  const { db } = await getServices();
  const products = opts.products ?? (await listProducts());
  const tree = opts.tree === undefined ? await getCourseTree(course.id) : opts.tree;
  const stats: CourseStats | null = tree ? courseStats(tree) : null;
  const enrollment_count = opts.enrollmentCount ?? (await db.from("enrollments").count({ course_id: course.id, status: "active" }));
  const product = courseProductFor(products, course.id);
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    short_description: course.short_description,
    illustration: course.illustration,
    thumbnail_url: await thumbnailUrl(course),
    level: course.level,
    language: course.language,
    topics: course.topics,
    badge: course.badge,
    status: course.status,
    publish_at: course.publish_at,
    created_at: course.created_at,
    last_updated_at: course.last_updated_at,
    duration_sec: stats?.total_video_sec ?? 0,
    lesson_count: stats?.lesson_count ?? 0,
    module_count: stats?.module_count ?? 0,
    resource_count: stats?.resource_count ?? 0,
    price: product ? effectiveUnitPrice(product) : null,
    enrollment_count,
  };
}

/** Published courses as cards, plus scheduled ones for "coming soon". */
export async function loadCatalog(): Promise<{ published: CourseCardData[]; scheduled: CourseCardData[] }> {
  const { db } = await getServices();
  const [published, scheduled, products] = await Promise.all([
    listPublishedCourses(),
    db.from("courses").list({ where: { status: "scheduled" }, orderBy: ["publish_at", "asc"] }),
    listProducts(),
  ]);
  const toCards = (rows: Course[]) => Promise.all(rows.map((c) => toCourseCardData(c, { products })));
  const [pub, sched] = await Promise.all([toCards(published), toCards(scheduled)]);
  return { published: pub, scheduled: sched };
}

/** The course we feature on the home page: Baby Steps when published, else the newest published course. */
export async function loadFeaturedCourse(): Promise<Course | null> {
  const courses = await listPublishedCourses();
  return courses.find((c) => c.slug === "baby-steps") ?? courses[0] ?? null;
}

export async function loadSettings(): Promise<SiteSettings | null> {
  const { db } = await getServices();
  return db.from("site_settings").get("default");
}

/** Approved testimonials (featured first, newest next). Empty when testimonials are switched off. */
export async function loadApprovedTestimonials(courseId: string | null = null, limit = 6): Promise<Testimonial[]> {
  const { db } = await getServices();
  const settings = await loadSettings();
  if (settings && settings.testimonials_enabled === false) return [];
  const where = courseId ? { status: "approved" as const, course_id: courseId } : { status: "approved" as const };
  const rows = await db.from("testimonials").list({ where, orderBy: ["created_at", "desc"] });
  return rows.sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, limit);
}

export function resourceTypeCounts(tree: CourseTree): Partial<Record<ResourceType, number>> {
  const seen = new Set<string>();
  const counts: Partial<Record<ResourceType, number>> = {};
  const add = (r: { file_path: string; type: ResourceType }) => {
    if (seen.has(r.file_path)) return;
    seen.add(r.file_path);
    counts[r.type] = (counts[r.type] ?? 0) + 1;
  };
  for (const m of tree.modules) {
    m.resources.forEach(add);
    for (const l of m.lessons) l.resources.forEach(add);
  }
  return counts;
}

// ---------------------------------------------------------------------------
// Legal pages
// ---------------------------------------------------------------------------

/** URL slug → key inside site_settings.legal / src/content/legal. */
export const LEGAL_PAGES = {
  terms: { key: "terms", title: "Terms of Service" },
  privacy: { key: "privacy", title: "Privacy Policy" },
  "refund-policy": { key: "refund-policy", title: "Refund Policy" },
  "medical-disclaimer": { key: "medical-disclaimer", title: "Medical Disclaimer" },
  cookies: { key: "cookie-policy", title: "Cookie Policy" },
} as const;
export type LegalSlug = keyof typeof LEGAL_PAGES;

export const LEGAL_REVIEW_TAG = "[LEGAL REVIEW NEEDED]";

export interface LegalDocument {
  slug: LegalSlug;
  title: string;
  body: string; // markdown without the leading H1
  needsReview: boolean;
  updatedAt: string | null;
}

export async function loadLegal(slug: LegalSlug): Promise<LegalDocument> {
  const page = LEGAL_PAGES[slug];
  const settings = await loadSettings();
  let raw = settings?.legal?.[page.key] ?? "";
  if (!raw.trim()) {
    try {
      raw = await fs.readFile(path.join(process.cwd(), "src/content/legal", `${page.key}.md`), "utf8");
    } catch {
      raw = `# ${page.title}\n\n${LEGAL_REVIEW_TAG}\n\nThis page has not been written yet.`;
    }
  }
  const lines = raw.replace(/\r\n?/g, "\n").split("\n");
  let title = page.title;
  const firstIdx = lines.findIndex((l) => l.trim() !== "");
  if (firstIdx !== -1 && /^#\s+/.test(lines[firstIdx])) {
    title = lines[firstIdx].replace(/^#\s+/, "").trim() || page.title;
    lines.splice(firstIdx, 1);
  }
  return {
    slug,
    title,
    body: lines.join("\n").trim(),
    needsReview: raw.includes(LEGAL_REVIEW_TAG),
    updatedAt: settings?.updated_at ?? null,
  };
}
