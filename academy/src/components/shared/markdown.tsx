import * as React from "react";
import { cn } from "@/lib/utils";
import { renderMarkdown, isPlaceholderLink, type RenderOptions } from "./markdown-render";

export interface MarkdownProps extends Omit<React.ComponentProps<"div">, "children" | "content">, RenderOptions {
  /** Trusted markdown (admin-authored). HTML in it is escaped, never executed. */
  content: string;
  /** Render placeholder sheet links (forms.gle, youtube.com, facebook.com/groups) as plain text. Default true. */
  stripPlaceholderLinks?: boolean;
  /** Wrap in a <div class="prose-cyc"> (default) or return the bare HTML container. */
  prose?: boolean;
}

/**
 * Server Component: renders trusted markdown inside `.prose-cyc`.
 * The renderer escapes all HTML first, so this is safe for admin content; it is
 * still not meant for untrusted learner input (use plain text there).
 */
function Markdown({ content, stripPlaceholderLinks = true, prose = true, linkFilter, headingIds, headingOffset, className, ...props }: MarkdownProps) {
  const filter = (href: string) => (stripPlaceholderLinks && isPlaceholderLink(href) ? false : linkFilter ? linkFilter(href) : true);
  const html = renderMarkdown(content ?? "", { linkFilter: filter, headingIds, headingOffset });
  return (
    <div
      data-slot="markdown"
      className={cn(prose && "prose-cyc", className)}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
}

export { Markdown };
