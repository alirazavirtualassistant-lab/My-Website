import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";
import { site } from "@/lib/config/site";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { Illustration } from "@/components/shared/illustration";
import { listBlogPosts } from "@/components/marketing/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: `Notes from ${site.instructor.name} on cravings, family wellness and preparing for conception, one baby step at a time.`,
  alternates: { canonical: "/blog" },
  openGraph: { title: `Blog · ${site.name}`, description: "Notes on cravings, family wellness and preparing for conception.", url: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await listBlogPosts();
  return (
    <Section spacing="md">
      <Container size="md">
        <PageHeader eyebrow="Blog" title="Notes from Cynthia" description="Short reads on the science, the heart and the small steps." />
        {posts.length === 0 ? (
          <EmptyState icon={<PenLine />} title="No posts yet" description="The first notes are being written. Check back soon." className="mt-10" />
        ) : (
          <ul className="mt-10 grid gap-5">
            {posts.map((post, i) => (
              <li key={post.slug}>
                <article className="card-soft group relative grid gap-4 p-6 sm:grid-cols-[auto_1fr] sm:gap-6 sm:p-7">
                  <Illustration name={(["leaves", "seedling", "sprout", "bloom"] as const)[i % 4]} size={72} className="hidden text-rose-strong sm:block" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {post.date ? <time dateTime={post.date}>{formatDate(post.date)}</time> : null}
                      {post.date && post.author ? " · " : ""}
                      {post.author}
                    </p>
                    <h2 className="mt-2 font-serif text-2xl leading-tight font-medium sm:text-3xl">
                      <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                        {post.title}
                      </Link>
                    </h2>
                    {post.description ? <p className="mt-2 text-muted-foreground">{post.description}</p> : null}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {post.tags.map((t) => (
                        <Badge key={t} variant="secondary">
                          {t}
                        </Badge>
                      ))}
                      <span aria-hidden="true" className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-rose-strong">
                        Read <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                      </span>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
