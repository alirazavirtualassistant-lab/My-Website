import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as React from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { site } from "@/lib/config/site";
import { formatDate } from "@/lib/utils";
import { getCourseBySlug } from "@/lib/usecases/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Illustration } from "@/components/shared/illustration";
import { Markdown } from "@/components/shared/markdown";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { getBlogPost, listBlogPosts } from "@/components/marketing/blog";
import { mdxComponents } from "@/components/marketing/mdx-components";
import { splitMdxTables } from "@/components/marketing/mdx-tables";
import { JsonLd } from "@/components/marketing/json-ld";

type Params = Promise<{ slug: string }>;

/**
 * Pipe tables go through the shared safe Markdown renderer (MDX has no GFM
 * tables here); everything else is compiled MDX, with the Markdown renderer
 * as a fallback if a segment fails to compile.
 */
async function renderBody(body: string): Promise<React.ReactNode[]> {
  const nodes: React.ReactNode[] = [];
  for (const [i, seg] of splitMdxTables(body).entries()) {
    if (seg.kind === "table") {
      nodes.push(<Markdown key={i} content={seg.text} prose={false} />);
      continue;
    }
    try {
      const { content } = await compileMDX({ source: seg.text, components: mdxComponents });
      nodes.push(<React.Fragment key={i}>{content}</React.Fragment>);
    } catch (err) {
      console.error("[blog] MDX compile failed, falling back to markdown", err);
      nodes.push(<Markdown key={i} content={seg.text} prose={false} />);
    }
  }
  return nodes;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post not found", robots: { index: false } };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.description, url: `/blog/${post.slug}`, type: "article", publishedTime: post.date, authors: [post.author] },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();
  const [others, babySteps] = await Promise.all([listBlogPosts(), getCourseBySlug("baby-steps")]);
  const related = others.filter((p) => p.slug !== post.slug).slice(0, 3);
  const courseHref = babySteps && babySteps.status === "published" ? `/courses/${babySteps.slug}` : "/courses";
  const body = await renderBody(post.body);

  return (
    <>
      <JsonLd
        id="article-jsonld"
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          author: { "@type": "Person", name: post.author },
          publisher: { "@type": "Organization", name: site.name, url: site.url },
          mainEntityOfPage: `${site.url}/blog/${post.slug}`,
        }}
      />
      <Section spacing="md">
        <Container size="prose">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/blog" className="inline-flex items-center gap-1 hover:text-rose-strong hover:underline underline-offset-4">
              <ArrowLeft className="size-4" aria-hidden="true" />
              All posts
            </Link>
          </nav>
          <article className="mt-6">
            <header>
              <p className="eyebrow">Blog</p>
              <h1 className="mt-3 text-balance">{post.title}</h1>
              {post.description ? <p className="mt-4 text-pretty text-lg text-muted-foreground">{post.description}</p> : null}
              <p className="mt-4 text-sm text-muted-foreground">
                {post.author}
                {post.date ? (
                  <>
                    {" · "}
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </>
                ) : null}
              </p>
              {post.tags.length ? (
                <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tags">
                  {post.tags.map((t) => (
                    <li key={t}>
                      <Badge variant="secondary">{t}</Badge>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="gold-rule mt-8" aria-hidden="true" />
            </header>
            <div className="prose-cyc mt-8 max-w-none text-lg">{body}</div>
          </article>

          <aside aria-label="Related" className="card-soft mt-12 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:gap-6">
            <Illustration name="path" size={80} className="text-rose-strong" />
            <div className="flex-1">
              <p className="eyebrow">Keep going</p>
              <p className="mt-1 font-serif text-2xl">Ready to turn reading into baby steps?</p>
              <p className="mt-1 text-sm text-muted-foreground">{babySteps?.subtitle ?? "Explore the courses and start where you are."}</p>
            </div>
            <Button asChild>
              <Link href={courseHref}>
                {babySteps ? "See the course" : "Browse courses"}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </aside>

          {related.length > 0 ? (
            <section aria-labelledby="related-heading" className="mt-10">
              <h2 id="related-heading" className="font-serif text-2xl">
                More to read
              </h2>
              <ul className="mt-3 space-y-2">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="font-semibold text-rose-strong underline-offset-4 hover:underline">
                      {p.title}
                    </Link>
                    {p.date ? <span className="ml-2 text-xs text-muted-foreground">{formatDate(p.date)}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <MedicalDisclaimer className="mt-12" />
        </Container>
      </Section>
    </>
  );
}
