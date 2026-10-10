import type { MetadataRoute } from "next";
import { site } from "@/lib/config/site";
import { ensureBootstrapped } from "@/lib/usecases/demo";
import { getCourseTree, lessonSlug, listPublishedCourses } from "@/lib/usecases/catalog";
import { listBlogPosts } from "@/components/marketing/blog";

const STATIC: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/courses", priority: 0.9, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/refund-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/medical-disclaimer", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC.map((s) => ({ url: `${base}${s.path}`, lastModified: now, changeFrequency: s.changeFrequency, priority: s.priority }));

  try {
    await ensureBootstrapped();
    const courses = await listPublishedCourses();
    for (const course of courses) {
      entries.push({ url: `${base}/courses/${course.slug}`, lastModified: new Date(course.last_updated_at), changeFrequency: "monthly", priority: 0.9 });
      const tree = await getCourseTree(course.id);
      for (const m of tree?.modules ?? []) {
        for (const l of m.lessons) {
          if (l.is_preview) entries.push({ url: `${base}/courses/${course.slug}/preview/${lessonSlug(l)}`, lastModified: new Date(l.updated_at), changeFrequency: "monthly", priority: 0.5 });
        }
      }
    }
  } catch (err) {
    console.error("[sitemap] courses unavailable", err);
  }

  try {
    const posts = await listBlogPosts();
    for (const p of posts) {
      entries.push({ url: `${base}/blog/${p.slug}`, lastModified: p.date ? new Date(p.date) : now, changeFrequency: "yearly", priority: 0.5 });
    }
  } catch (err) {
    console.error("[sitemap] blog unavailable", err);
  }

  return entries;
}
