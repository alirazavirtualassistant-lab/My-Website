import { ImageResponse } from "next/og";
import { ensureBootstrapped } from "@/lib/usecases/demo";
import { courseStats, getCourseBySlug, getCourseTree } from "@/lib/usecases/catalog";
import { formatHoursMinutes, pluralize } from "@/lib/utils";
import { site } from "@/lib/config/site";
import { OG_SIZE, OgFrame, loadOgFonts } from "@/components/marketing/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${site.name} course`;

export default async function CourseOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await ensureBootstrapped();
  const [course, fonts] = await Promise.all([getCourseBySlug(slug), loadOgFonts()]);
  const tree = course ? await getCourseTree(course.id) : null;
  const stats = tree ? courseStats(tree) : null;
  const stat = stats
    ? [
        stats.total_video_sec > 0 ? `${formatHoursMinutes(stats.total_video_sec)} of video` : null,
        pluralize(stats.lesson_count, "lesson"),
        stats.resource_count > 0 ? pluralize(stats.resource_count, "resource") : null,
        `${pluralize(stats.module_count, "module")}${stats.bonus_count ? " + bonuses" : ""}`,
      ].filter((s): s is string => Boolean(s))
    : [];
  return new ImageResponse(
    (
      <OgFrame
        eyebrow={course ? `Online course · ${course.level}` : "Online course"}
        title={course?.title ?? site.name}
        subtitle={course?.subtitle || course?.short_description || site.tagline}
        stats={stat}
        serif={fonts.length > 0}
      />
    ),
    { ...size, ...(fonts.length ? { fonts } : {}) },
  );
}
