import * as React from "react";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { isPlaceholderLink } from "@/components/shared/markdown-render";

function Anchor({ href, children, ...props }: React.ComponentProps<"a">) {
  if (!href) return <span {...props}>{children}</span>;
  if (isPlaceholderLink(href)) return <span {...props}>{children}</span>;
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

function TableWrap(props: React.ComponentProps<"table">) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table {...props} />
    </div>
  );
}

/** Components handed to MDXRemote for blog posts (prose styling comes from .prose-cyc). */
export const mdxComponents: MDXComponents = {
  a: Anchor,
  table: TableWrap,
};
