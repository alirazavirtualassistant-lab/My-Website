import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getServices } from "@/services";
import { getCourseTreeForAdmin } from "@/lib/usecases/admin-courses";
import { formatHoursMinutes, pluralize } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { CourseSubnav } from "@/components/admin/courses/course-subnav";
import { StatusBadge } from "@/components/admin/courses/status-badge";
import { SearchParamToast } from "@/components/admin/courses/search-param-toast";
import { CurriculumTree, type TreeModuleView } from "@/components/admin/courses/curriculum-tree";
import { BulkVideoUpload } from "@/components/admin/media/bulk-video-upload";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tree = await getCourseTreeForAdmin(id);
  return { title: tree ? `${tree.course.title} · Curriculum` : "Curriculum", robots: { index: false, follow: false } };
}

export default async function CurriculumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tree, services] = await Promise.all([getCourseTreeForAdmin(id), getServices()]);
  if (!tree) notFound();
  const { course } = tree;
  const modules: TreeModuleView[] = tree.modules.map((m) => ({
    id: m.id,
    code: m.code,
    kind: m.kind,
    title: m.title,
    description: m.description,
    notes: m.notes,
    drip_days: m.drip_days,
    completion_xp: m.completion_xp,
    required_for_certificate: m.required_for_certificate,
    illustration: m.illustration,
    lessons: m.lessons.map((l) => ({
      id: l.id,
      code: l.code,
      title: l.title,
      status: l.status,
      is_preview: l.is_preview,
      is_intro: l.is_intro,
      duration_sec: l.duration_sec,
      xp: l.action_steps.reduce((n, s) => n + s.xp, 0),
      resources: l.resources.length,
      video: l.video_provider === "none" ? (l.video_asset_id ? "processing" : "none") : l.video_provider === "mux" && !l.video_playback_id ? "processing" : "ready",
      planned_video_filename: l.planned_video_filename,
    })),
  }));
  const lessonCount = modules.reduce((n, m) => n + m.lessons.length, 0);
  const totalSec = modules.reduce((n, m) => n + m.lessons.reduce((a, l) => a + l.duration_sec, 0), 0);
  const totalXp = modules.reduce((n, m) => n + m.completion_xp + m.lessons.reduce((a, l) => a + l.xp, 0), 0);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <SearchParamToast />
      <PageHeader
        eyebrow="Curriculum"
        title={course.title}
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <StatusBadge status={course.status} />
            <span>
              {pluralize(modules.length, "module")} · {pluralize(lessonCount, "lesson")} · {formatHoursMinutes(totalSec)} of video · {totalXp.toLocaleString("en-US")} XP
            </span>
          </span>
        }
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/courses">
              <ArrowLeft /> All courses
            </Link>
          </Button>
        }
      />
      <CourseSubnav courseId={course.id} slug={course.slug} />
      <CurriculumTree courseId={course.id} courseSlug={course.slug} initialModules={modules} />
      <BulkVideoUpload
        courseId={course.id}
        videoMode={services.mode.video}
        lessons={modules.flatMap((m) => m.lessons.map((l) => ({ id: l.id, code: l.code, title: l.title, planned_video_filename: l.planned_video_filename, video: l.video, module_code: m.code })))}
      />
    </div>
  );
}
