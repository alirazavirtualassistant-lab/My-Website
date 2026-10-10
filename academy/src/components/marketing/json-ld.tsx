import * as React from "react";

/**
 * Renders a schema.org JSON-LD block. The payload is our own data (never user
 * input), and "<" is escaped so a stray tag can never close the script.
 */
function JsonLd({ data, id }: { data: Record<string, unknown> | Array<Record<string, unknown>>; id?: string }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export { JsonLd };
