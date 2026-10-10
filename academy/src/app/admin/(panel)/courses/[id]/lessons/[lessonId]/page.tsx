import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { getServices } from "@/services";
import { getLessonForAdmin, listQuizKeys } from "@/lib/usecases/admin-courses";
import { lessonSlug } from "@/lib/usecases/catalog";
import { signedUrlFor } from "@/lib/usecases/uploads";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { CourseSubnav } from "@/components/admin/courses/course-subnav";
import { StatusBadge } from "@/components/admin/courses/status-badge";
import { SearchParamToast } from "@/components/admin/courses/search-param-toast";
import { LessonForm } from "@/components/admin/courses/lesson-form";
import { LessonVideoCard } from "@/components/admin/courses/lesson-video-card";
import { LessonThumbnailCard } from "@/components/admin/courses/lesson-thumbnail-card";
import { LessonCaptionsCard } from "@/components/admin/courses/lesson-captions-card";
import { LessonAudioCard } from "@/components/admin/courses/lesson-audio-card";
import { LessonResourcesCard } from "@/components/admin/courses/lesson-resources-card";
import { LessonStepsCard } from "@/components/admin/courses/lesson-steps-card";

export const dynamic = "force-dynamic";

const isAbsolute = (v: string) => /^https?:\/\//i.test(v);

export async function generateMetadata({ params }: { params: Promise<{ id: string; lessonId: string }> }): Promise<Metadata> {
  const { lessonId } = await params;
  const data = await getLessonForAdmin(lessonId);
  return { title: data ? `${data.lesson.code} · ${data.lesson.title}` : "Lesson", robots: { index: false, follow: false } };
}

export default async function LessonEditorPage({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
  const { id, lessonId } = await params;
  const data = await getLessonForAdmin(lessonId);
  if (!data || data.course.id !== id) notFound();
  const { course, module, lesson, resources, steps } = data;
  const [services, quizzes] = await Promise.all([getServices(), listQuizKeys(course.id)]);
  const { storage } = services;

  const videoSrc = lesson.video_provider === "url" && lesson.video_url ? (isAbsolute(lesson.video_url) ? lesson.video_url : await signedUrlFor("video-uploads", lesson.video_url)) : null;
  const captionsUrl = lesson.captions_path ? (isAbsolute(lesson.captions_path) ? lesson.captions_path : await signedUrlFor("video-uploads", lesson.captions_path)) : null;
  const thumbnailUrl = lesson.thumbnail_path ? (isAbsolute(lesson.thumbnail_path) ? lesson.thumbnail_path : storage.getPublicUrl({ bucket: "public-assets", path: lesson.thumbnail_path })) : null;
  const audioSlots = await Promise.all(lesson.audio_slots.map(async (s) => ({ ...s, url: s.file_path ? await signedUrlFor("course-resources", s.file_path) : null })));
  const resourceRows = await Promise.all(resources.map(async (r) => ({ ...r, url: await signedUrlFor("course-resources", r.file_path, r.file_name) })));
  const previewHref = lesson.is_preview ? `/courses/${course.slug}/preview/${lessonSlug(lesson)}` : null;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <SearchParamToast />
      <PageHeader
        eyebrow={`${course.title} · ${module.code} ${module.title}`}
        title={
          <>
            <span className="mr-3 font-mono text-xl text-muted-foreground">{lesson.code}</span>
            {lesson.title}
          </>
        }
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <StatusBadge status={lesson.status} />
            {lesson.is_intro ? <span>Module introduction</span> : null}
            {lesson.is_preview ? <span>Free preview</span> : null}
          </span>
        }
        actions={
          <>
            {previewHref ? (
              <Button asChild variant="outline" size="sm">
                <Link href={previewHref} target="_blank" rel="noreferrer">
                  <Eye /> Public preview
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="ghost" size="sm">
              <Link href={`/admin/courses/${course.id}/curriculum`}>
                <ArrowLeft /> Curriculum
              </Link>
            </Button>
          </>
        }
      />
      <CourseSubnav courseId={course.id} slug={course.slug} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-6">
          <LessonForm lesson={lesson} courseId={course.id} quizzes={quizzes} moduleDripDays={module.drip_days} />
        </div>
        <div className="space-y-6">
          <LessonVideoCard
            lessonId={lesson.id}
            courseId={course.id}
            videoMode={services.mode.video}
            provider={lesson.video_provider}
            videoUrl={lesson.video_url}
            videoSrc={videoSrc}
            assetId={lesson.video_asset_id}
            playbackId={lesson.video_playback_id}
            plannedFilename={lesson.planned_video_filename}
          />
          <LessonThumbnailCard lessonId={lesson.id} courseId={course.id} thumbnailUrl={thumbnailUrl} />
          <LessonCaptionsCard lessonId={lesson.id} courseId={course.id} captionsPath={lesson.captions_path} captionsUrl={captionsUrl} />
          <LessonAudioCard lessonId={lesson.id} courseId={course.id} slots={audioSlots} />
        </div>
      </div>

      <LessonResourcesCard lessonId={lesson.id} courseId={course.id} resources={resourceRows} />
      <LessonStepsCard lessonId={lesson.id} courseId={course.id} steps={steps} quizzes={quizzes} />
    </div>
  );
}
