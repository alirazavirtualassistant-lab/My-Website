import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { parseFrontmatter, asString, asStringArray } from "./frontmatter";

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date
  author: string;
  tags: string[];
}

export interface BlogPost extends BlogPostMeta {
  body: string;
}

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function readPost(file: string): Promise<BlogPost | null> {
  const slug = file.replace(/\.mdx?$/, "");
  if (!SLUG_RE.test(slug)) return null;
  try {
    const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf8");
    const { data, body } = parseFrontmatter(raw);
    return {
      slug,
      title: asString(data.title, slug),
      description: asString(data.description),
      date: asString(data.date),
      author: asString(data.author, "Cradle Your Cravings Academy"),
      tags: asStringArray(data.tags),
      body,
    };
  } catch {
    return null;
  }
}

/** Published posts, newest first. Missing folder = no posts (not an error). */
export async function listBlogPosts(): Promise<BlogPostMeta[]> {
  let files: string[] = [];
  try {
    files = (await fs.readdir(BLOG_DIR)).filter((f) => /\.mdx?$/.test(f));
  } catch {
    return [];
  }
  const posts = (await Promise.all(files.map(readPost))).filter((p): p is BlogPost => p !== null);
  return posts
    .map(({ body: _body, ...meta }) => meta)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!SLUG_RE.test(slug)) return null;
  for (const ext of ["mdx", "md"]) {
    const post = await readPost(`${slug}.${ext}`);
    if (post) return post;
  }
  return null;
}
