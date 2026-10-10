import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCourseBySlug } from "@/lib/usecases/catalog";
import { categoryForLesson, listCategories } from "@/lib/usecases/community";
import { PageHeader } from "@/components/ui/page-header";
import { CommunityLocked } from "@/components/community/community-locked";
import { NewPostForm } from "@/components/community/new-post-form";
import { categoryHref, communityHref, newPostHref } from "@/components/community/types";
import { lessonChip, loadCommunity, resolveLessonParam } from "../_lib/load";

export const dynamic = "force-dynamic";

type Params = Promise<{ course: string }>;
type Search = Promise<{ category?: string; lesson?: string; anonymous?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { course: slug } = await params;
  const course = await getCourseBySlug(slug);
  return { title: course ? `New post · ${course.title} community` : "New post", robots: { index: false, follow: false } };
}

/**
 * /community/[course]/new?category=<slug>&lesson=<code>
 * Both params are optional and forgiving: unknown values simply fall back.
 * Lesson action steps deep-link here ("Share in Forum").
 */
export default async function NewPostPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ course: slug }, sp] = await Promise.all([params, searchParams]);
  const { course, allowed } = await loadCommunity(slug, newPostHref(slug, { category: sp.category, lesson: sp.lesson }));

  if (!allowed) {
    return (
      <div className="grid gap-8">
        <PageHeader eyebrow="Community" title="Start a conversation" />
        <CommunityLocked courseSlug={course.slug} courseTitle={course.title} />
      </div>
    );
  }

  const [categories, lesson] = await Promise.all([listCategories(course.id), resolveLessonParam(course.id, sp.lesson)]);
  const wanted = (sp.category ?? "").trim().toLowerCase();
  let category = wanted ? (categories.find((c) => c.slug.toLowerCase() === wanted) ?? null) : null;
  if (!category && lesson) category = await categoryForLesson(course.id, lesson.module_id);
  if (!category) category = categories[0] ?? null;
  const backHref = category ? categoryHref(course.slug, category.slug) : communityHref(course.slug);
  const defaultAnonymous = sp.anonymous === "1" || sp.anonymous === "true";

  return (
    <div className="grid gap-8">
      <div className="grid gap-5">
        <Link href={backHref} className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-rose-strong underline-offset-4 hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {category ? category.title : course.title}
        </Link>
        <PageHeader
          eyebrow={`Community · ${course.title}`}
          title="Start a conversation"
          description={lesson ? `Sharing from ${lesson.code} · ${lesson.title}. Say what is true for you; a sentence is plenty.` : "Say what is true for you. A sentence is plenty, and “This week was hard” counts."}
        />
      </div>
      <div className="card-soft p-5 sm:p-7">
        <NewPostForm
          courseId={course.id}
          categories={categories.map((c) => ({ id: c.id, title: c.title }))}
          defaultCategoryId={category?.id ?? null}
          lesson={lesson ? lessonChip(course.slug, lesson) : null}
          defaultAnonymous={defaultAnonymous}
          cancelHref={backHref}
        />
      </div>
    </div>
  );
}
