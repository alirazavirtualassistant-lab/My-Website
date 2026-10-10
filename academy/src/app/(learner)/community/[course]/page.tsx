import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageSquarePlus, Pin, Sparkles, X } from "lucide-react";
import type { ForumCategory } from "@/lib/types";
import { getServices } from "@/services";
import { getCourseBySlug } from "@/lib/usecases/catalog";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { CategoryCard } from "@/components/community/category-card";
import { CommunityLocked } from "@/components/community/community-locked";
import { CommunityRules } from "@/components/community/community-rules";
import { CommunitySearch } from "@/components/community/community-search";
import { PostList } from "@/components/community/post-list";
import { communityHref, newPostHref } from "@/components/community/types";
import { loadCategoryViews, loadCommunity, loadLessonChips, loadProfiles, loadVisiblePosts, parseQuery, toPostRow } from "./_lib/load";

export const dynamic = "force-dynamic";

type Params = Promise<{ course: string }>;
type Search = Promise<{ q?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { course: slug } = await params;
  const course = await getCourseBySlug(slug);
  return { title: course ? `${course.title} · Community` : "Community", robots: { index: false, follow: false } };
}

/** /community/[course] — rules, search, pinned posts, categories and the latest conversations. */
export default async function CourseCommunityPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ course: slug }, { q }] = await Promise.all([params, searchParams]);
  const { session, course, allowed, viewerIsAdmin } = await loadCommunity(slug, communityHref(slug));
  const query = parseQuery(q);

  if (!allowed) {
    return (
      <div className="grid gap-8">
        <PageHeader eyebrow="Community" title={course.title} />
        <CommunityLocked courseSlug={course.slug} courseTitle={course.title} />
      </div>
    );
  }

  const { db } = await getServices();
  const posts = await loadVisiblePosts(course.id);
  const [{ categories, views }, lessons, results] = await Promise.all([
    loadCategoryViews(course, posts),
    loadLessonChips(course),
    query
      ? db.from("forum_posts").list({ where: { course_id: course.id, status: "visible" }, search: { columns: ["title", "body"], query }, orderBy: ["created_at", "desc"], limit: 40 })
      : Promise.resolve([]),
  ]);
  const categoryById = new Map<string, ForumCategory>(categories.map((c) => [c.id, c]));
  const pinned = posts.filter((p) => p.pinned);
  const latest = posts.filter((p) => !p.pinned).slice(0, 5);
  const profiles = await loadProfiles([...pinned, ...latest, ...results].map((p) => p.user_id));
  const rowInputs = { courseSlug: course.slug, viewerId: session.user_id, viewerIsAdmin, profiles, lessons, categories: categoryById, withCategory: true };
  const newHref = newPostHref(course.slug);

  return (
    <div className="grid gap-10">
      <div className="grid gap-5">
        <Link href="/community" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-rose-strong underline-offset-4 hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          All communities
        </Link>
        <PageHeader
          eyebrow="Community"
          title={course.title}
          description="Share what is working, ask what is not, and cheer each other on. Small shares are welcome."
          actions={
            <Button asChild>
              <Link href={newHref}>
                <MessageSquarePlus aria-hidden="true" />
                New post
              </Link>
            </Button>
          }
        />
        <CommunitySearch action={communityHref(course.slug)} defaultValue={query} className="max-w-xl" />
      </div>

      <CommunityRules />

      {query ? (
        <section aria-labelledby="search-heading" className="grid gap-5">
          <SectionHeading
            id="search-heading"
            eyebrow="Search"
            title={`Results for “${query}”`}
            description={results.length === 0 ? "Nothing matched. Try a different word, or start the conversation yourself." : `${results.length} ${results.length === 1 ? "post" : "posts"} mention it.`}
            action={
              <Button asChild variant="outline" size="sm">
                <Link href={communityHref(course.slug)}>
                  <X aria-hidden="true" />
                  Clear search
                </Link>
              </Button>
            }
          />
          <PostList
            label="Search results"
            posts={results.map((p) => toPostRow(p, rowInputs))}
            emptyTitle="No posts matched"
            emptyDescription="Try a different word, or be the one who starts this conversation."
            emptyAction={
              <Button asChild size="sm">
                <Link href={newHref}>Start a post</Link>
              </Button>
            }
          />
        </section>
      ) : null}

      {pinned.length > 0 ? (
        <section aria-labelledby="pinned-heading" className="grid gap-5">
          <SectionHeading id="pinned-heading" eyebrow={<span className="inline-flex items-center gap-1"><Pin className="size-3" aria-hidden="true" />Pinned</span>} title="Start here" />
          <PostList label="Pinned posts" posts={pinned.map((p) => toPostRow(p, rowInputs))} />
        </section>
      ) : null}

      <section aria-labelledby="categories-heading" className="grid gap-5">
        <SectionHeading id="categories-heading" eyebrow="Categories" title="Find your thread" description="One space per module, plus a few for everything in between." />
        <ul className="grid gap-4 sm:grid-cols-2" aria-label="Categories">
          {views.map((c) => (
            <li key={c.id}>
              <CategoryCard category={c} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="latest-heading" className="grid gap-5">
        <SectionHeading id="latest-heading" eyebrow={<span className="inline-flex items-center gap-1"><Sparkles className="size-3" aria-hidden="true" />Latest</span>} title="Recent conversations" />
        <PostList
          label="Recent posts"
          compact
          posts={latest.map((p) => toPostRow(p, rowInputs))}
          emptyTitle="No conversations yet"
          emptyDescription="Be the first to say hello. “This week was hard” is a valid post."
          emptyAction={
            <Button asChild size="sm">
              <Link href={newHref}>Start a post</Link>
            </Button>
          }
        />
      </section>
    </div>
  );
}
