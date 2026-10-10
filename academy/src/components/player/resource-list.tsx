import * as React from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { DownloadLink } from "./download-link";
import { RESOURCE_TYPE_LABEL, ResourceIcon } from "./format";
import { formatBytes } from "./transcript-utils";
import type { ResourceView } from "./types";

export interface ResourceListProps {
  resources: ResourceView[];
  /** When false, rows show a lock instead of a download button. */
  unlocked?: boolean;
  lockedNote?: string;
  /** Group lesson vs module resources under small headings. */
  grouped?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

function Row({ r, unlocked, lockedNote }: { r: ResourceView; unlocked: boolean; lockedNote?: string }) {
  const size = formatBytes(r.sizeBytes);
  return (
    <li className="flex items-center gap-3 py-3">
      <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-soft/70 text-rose-strong">
        <ResourceIcon type={r.type} className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">{r.label}</span>
        <span className="block text-xs text-muted-foreground">
          {RESOURCE_TYPE_LABEL[r.type]}
          {size ? ` · ${size}` : ""}
          <span className="sr-only"> · {r.fileName}</span>
        </span>
      </span>
      {unlocked ? (
        <DownloadLink resourceId={r.id} href={r.url} fileName={r.fileName} />
      ) : (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Lock className="size-3.5" aria-hidden="true" />
          {lockedNote ?? "Locked"}
        </span>
      )}
    </li>
  );
}

/** Server-safe list of downloadable files (lesson + module resources). */
function ResourceList({ resources, unlocked = true, lockedNote, grouped = true, emptyTitle = "No downloads for this lesson", emptyDescription = "Some lessons are video and reflection only. Module guides live under the module heading.", className }: ResourceListProps) {
  if (resources.length === 0) {
    return <EmptyState size="sm" title={emptyTitle} description={emptyDescription} className={className} />;
  }
  const lessonRes = resources.filter((r) => r.scope === "lesson");
  const moduleRes = resources.filter((r) => r.scope === "module");
  if (!grouped || lessonRes.length === 0 || moduleRes.length === 0) {
    return (
      <ul className={cn("divide-y divide-border", className)}>
        {resources.map((r) => (
          <Row key={r.id} r={r} unlocked={unlocked} lockedNote={lockedNote} />
        ))}
      </ul>
    );
  }
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <section aria-labelledby="res-lesson">
        <h3 id="res-lesson" className="eyebrow">
          This lesson
        </h3>
        <ul className="divide-y divide-border">
          {lessonRes.map((r) => (
            <Row key={r.id} r={r} unlocked={unlocked} lockedNote={lockedNote} />
          ))}
        </ul>
      </section>
      <section aria-labelledby="res-module">
        <h3 id="res-module" className="eyebrow">
          Module guide
        </h3>
        <ul className="divide-y divide-border">
          {moduleRes.map((r) => (
            <Row key={r.id} r={r} unlocked={unlocked} lockedNote={lockedNote} />
          ))}
        </ul>
      </section>
    </div>
  );
}

export { ResourceList };
