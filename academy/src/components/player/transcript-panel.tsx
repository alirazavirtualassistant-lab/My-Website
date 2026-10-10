"use client";

/**
 * Verbatim transcript with section headings + time chips (seek the player),
 * cue lines in muted italics, in-page search with highlight + next/previous,
 * and Copy / Download .txt.
 */
import * as React from "react";
import { ChevronDown, ChevronUp, Copy, Download, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { usePlayerStore } from "./player-store";
import { findMatches, parseTranscript, readingMinutes, splitMatches, type ParsedTranscript, type TextSegment } from "./transcript-utils";

export interface TranscriptPanelProps {
  transcript: string;
  lessonTitle: string;
  lessonCode: string;
  className?: string;
}

function Highlighted({ segments, activeIndex }: { segments: TextSegment[]; activeIndex: number }) {
  return (
    <>
      {segments.map((s, i) =>
        s.match ? (
          <mark
            key={i}
            data-match-index={s.matchIndex}
            className={cn("rounded-sm px-0.5", s.matchIndex === activeIndex ? "bg-gold text-ink ring-2 ring-gold/60" : "bg-gold-soft text-foreground")}
          >
            {s.text}
          </mark>
        ) : (
          <React.Fragment key={i}>{s.text}</React.Fragment>
        ),
      )}
    </>
  );
}

function TranscriptPanel({ transcript, lessonTitle, lessonCode, className }: TranscriptPanelProps) {
  const parsed = React.useMemo<ParsedTranscript>(() => parseTranscript(transcript), [transcript]);
  const { hasPlayer, seekTo } = usePlayerStore();
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const matches = React.useMemo(() => findMatches(parsed, query), [parsed, query]);

  React.useEffect(() => setActive(0), [query]);

  React.useEffect(() => {
    if (!matches.length) return;
    const el = containerRef.current?.querySelector<HTMLElement>(`[data-match-index="${active}"]`);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [active, matches.length]);

  function step(delta: number) {
    if (!matches.length) return;
    setActive((a) => (a + delta + matches.length) % matches.length);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(transcript);
      toast.success("Transcript copied");
    } catch {
      toast.error("Copy isn't available in this browser. Use Download instead.");
    }
  }

  function download() {
    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${lessonCode}-${lessonTitle.replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase() || "transcript"}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (!transcript.trim()) {
    return <p className={cn("text-sm text-muted-foreground", className)}>The transcript for this lesson has not been added yet.</p>;
  }

  // Number matches globally so highlight indices line up with `matches`.
  let runningIndex = 0;

  return (
    <div id="transcript" className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                step(e.shiftKey ? -1 : 1);
              }
            }}
            placeholder="Search the transcript"
            aria-label="Search the transcript"
            aria-describedby="transcript-search-status"
            className="pl-9 pr-20"
          />
          {query ? (
            <div className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center gap-0.5">
              <Button type="button" size="icon" variant="ghost" className="size-7" aria-label="Previous match" onClick={() => step(-1)} disabled={!matches.length}>
                <ChevronUp aria-hidden="true" />
              </Button>
              <Button type="button" size="icon" variant="ghost" className="size-7" aria-label="Next match" onClick={() => step(1)} disabled={!matches.length}>
                <ChevronDown aria-hidden="true" />
              </Button>
              <Button type="button" size="icon" variant="ghost" className="size-7" aria-label="Clear search" onClick={() => setQuery("")}>
                <X aria-hidden="true" />
              </Button>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" variant="outline" onClick={copy}>
            <Copy aria-hidden="true" />
            Copy
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={download}>
            <Download aria-hidden="true" />
            Download .txt
          </Button>
        </div>
      </div>
      <p id="transcript-search-status" role="status" aria-live="polite" className="text-xs text-muted-foreground">
        {query.trim() ? (matches.length ? `${active + 1} of ${matches.length} matches` : "No matches") : `Full script, word for word · about ${readingMinutes(parsed.wordCount)} min read`}
      </p>

      <div ref={containerRef} className="prose-cyc max-w-none">
        {parsed.title ? <p className="eyebrow">{parsed.title}</p> : null}
        {parsed.sections.map((section) => (
          <section key={section.id} id={section.id} aria-label={section.label ?? undefined} className="transcript-line">
            {section.heading ? (
              <h3 className="transcript-heading flex flex-wrap items-center gap-2">
                {section.time ? (
                  hasPlayer ? (
                    <button
                      type="button"
                      onClick={() => seekTo(section.time!.startSec)}
                      className="inline-flex items-center rounded-full border border-rose/40 bg-rose-soft/60 px-2 py-0.5 font-mono text-[11px] tracking-normal text-rose-strong normal-case hover:bg-rose-soft focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      aria-label={`Play from ${section.time.start}`}
                    >
                      {section.time.start}
                      {section.time.end ? `–${section.time.end}` : ""}
                    </button>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-border bg-cream-2 px-2 py-0.5 font-mono text-[11px] tracking-normal text-muted-foreground normal-case">
                      {section.time.start}
                      {section.time.end ? `–${section.time.end}` : ""}
                    </span>
                  )
                ) : null}
                <span>{section.label}</span>
              </h3>
            ) : null}
            {section.blocks.map((block, j) => {
              const segments = splitMatches(block.text, query, runningIndex);
              runningIndex += segments.filter((s) => s.match).length;
              return block.kind === "cue" ? (
                <p key={j} className="transcript-line text-sm text-muted-foreground italic">
                  <Highlighted segments={segments} activeIndex={active} />
                </p>
              ) : (
                <p key={j} className="transcript-line">
                  <Highlighted segments={segments} activeIndex={active} />
                </p>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}

export { TranscriptPanel };
