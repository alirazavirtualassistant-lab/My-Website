import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquarePlus } from "lucide-react";
import type { ForumCategory } from "@/lib/types";
import { getServices } from "@/services";
import { getCourseBySlug } from "@/lib/usecases/catalog";
import { listCategories } from "@/lib/usecases/community";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { CommunityLocked } from "@/components/community/community-locked";
import { Pagination } from "@/components/community/pagination";
import { PostList } from "@/components/community/post-list";
import { SortTabs } from "@/components/community/sort-tabs";
import { POSTS_PER_PAGE, categoryHref, communityHref, newPostHref } from "@/components/community/types";
import { loadCommunity, loadLessonChips, loadProfiles, parsePage, parseSort, sortPosts, toPostRow } from "../_lib/load";

export const dynamic = "force-dynamic";

type Params = Promise<{ course: string; category: string }>;
type Search = Promise<{ sort?: string; page?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { course: slug, category } = await params;
  const course = await getCourseBySlug(slug);
  const cat = course ? (await listCategories(course.id)).find((c) => c.slug === category) : null;
  return { title: cat && course ? `${cat.title} · ${course.title} community` : "Community", robots: { index: false, follow: false } };
}

/** /community/[course]/[category] — paginated posts, newest or most liked. */
export default async function CategoryPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ course: slug, category: categorySlug }, sp] = await Promise.all([params, searchParams]);
  const { session, course, allowed, viewerIsAdmin } = await loadCommunity(slug, categoryHref(slug, categorySlug));
  const categories = await listCategories(course.id);
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) notFound();

  if (!allowed) {
    return (
      <div className="grid gap-8">
        <PageHeader eyebrow="Community" title={category.title} />
        <CommunityLocked courseSlug={course.slug} courseTitle={course.title} />
      </div>
    );
  }

  const sort = parseSort(sp.sort);
  const { db } = await getServices();
  const all = sortPosts(await db.from("forum_posts").list({ where: { course_id: course.id, category_id: category.id, status: "visible" } }), sort);
  const pageCount = Math.max(1, Math.ceil(all.length / POSTS_PER_PAGE));
  const page = Math.min(parsePage(sp.page), pageCount);
  const slice = all.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  const [profiles, lessons] = await Promise.all([loadProfiles(slice.map((p) => p.user_id)), loadLessonChips(course)]);
  const categoryById = new Map<string, ForumCategory>(categories.map((c) => [c.id, c]));
  const rows = slice.map((p) => toPostRow(p, { courseSlug: course.slug, viewerId: session.user_id, viewerIsAdmin, profiles, lessons, categories: categoryById }));

  const base = categoryHref(course.slug, category.slug);
  const hrefFor = (next: { sort?: "new" | "top"; page?: number }) => {
    const s = next.sort ?? sort;
    const p = next.page ?? 1;
    const qs = new URLSearchParams();
    if (s !== "new") qs.set("sort", s);
    if (p > 1) qs.set("page", String(p));
    const str = qs.toString();
    return str ? `${base}?${str}` : base;
  };
  const newHref = newPostHref(course.slug, { category: category.slug });

  return (
    <div className="grid gap-8">
      <div className="grid gap-5">
        <Link href={communityHref(course.slug)} className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-rose-strong underline-offset-4 hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {course.title}
        </Link>
        <PageHeader
          eyebrow="Community"
          title={category.title}
          description={category.description || undefined}
          actions={
            <Button asChild>
              <Link href={newHref}>
                <MessageSquarePlus aria-hidden="true" />
                New post
              </Link>
            </Button>
          }
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SortTabs current={sort} hrefFor={(s) => hrefFor({ sort: s, page: 1 })} />
        <p className="text-sm text-muted-foreground">
          {all.length === 0 ? "No posts yet" : `${all.length} ${all.length === 1 ? "post" : "posts"}`}
        </p>
      </div>

      <PostList
        label={`${category.title} posts`}
        posts={rows}
        emptyTitle="Nothing here yet"
        emptyDescription="Be the first to say hello. A small share is enough — “This week was hard” is a valid post."
        emptyAction={
          <Button asChild size="sm">
            <Link href={newHref}>Start a post</Link>
          </Button>
        }
      />

      <Pagination page={page} pageCount={pageCount} hrefFor={(p) => hrefFor({ page: p })} />
    </div>
  );
}
