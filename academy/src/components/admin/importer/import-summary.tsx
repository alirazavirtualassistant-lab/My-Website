import * as React from "react";
import type { CoursePackage } from "@/lib/types";
import { formatHoursMinutes, pluralize } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatBytes } from "@/components/admin/media/upload-client";

/** Per-module numbers of the incoming package. XP per module already matched the sheet's XP Summary tab (the importer refuses otherwise). */
function ImportSummary({ pkg, fileCount, totalFileBytes }: { pkg: CoursePackage; fileCount: number; totalFileBytes: number }) {
  const rows = pkg.modules.map((m) => {
    const files = new Set<string>(m.resources.map((r) => r.file_path));
    for (const l of m.lessons) for (const r of l.resources) files.add(r.file_path);
    return {
      code: m.code,
      title: m.title,
      kind: m.kind,
      drip: m.drip_days,
      lessons: m.lessons.length,
      resources: files.size,
      transcripts: m.lessons.filter((l) => l.transcript.trim()).length,
      video_sec: m.lessons.reduce((n, l) => n + l.duration_sec, 0),
      xp: pkg.stats.xp_by_module[m.code] ?? m.completion_xp + m.lessons.reduce((n, l) => n + l.action_steps.reduce((a, s) => a + s.xp, 0), 0),
    };
  });
  return (
    <section aria-labelledby="summary-title" className="space-y-4">
      <h2 id="summary-title" className="font-serif text-xl font-medium">
        What’s in the package
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Lessons" value={pkg.stats.lesson_count} hint={`${pluralize(pkg.modules.length, "module")}`} tone="rose" />
        <StatCard label="Resources" value={pkg.stats.resource_count} hint={fileCount > 0 ? `${fileCount} files · ${formatBytes(totalFileBytes)}` : "Files already in storage"} tone="gold" />
        <StatCard label="Video" value={formatHoursMinutes(pkg.stats.total_video_sec)} hint={`${pkg.stats.transcript_count} transcripts`} tone="sage" />
        <StatCard label="Total XP" value={pkg.stats.total_xp.toLocaleString("en-US")} hint="Matches the XP Summary tab" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Module</TableHead>
            <TableHead>Unlocks</TableHead>
            <TableHead className="text-right">Lessons</TableHead>
            <TableHead className="text-right">Resources</TableHead>
            <TableHead className="text-right">Transcripts</TableHead>
            <TableHead className="text-right">Video</TableHead>
            <TableHead className="text-right">XP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.code}>
              <TableCell className="whitespace-normal">
                <span className="mr-2 font-mono text-xs text-muted-foreground">{r.code}</span>
                <span className="font-semibold">{r.title}</span>
                {r.kind !== "core" ? (
                  <Badge variant="muted" className="ml-2 capitalize">
                    {r.kind}
                  </Badge>
                ) : null}
              </TableCell>
              <TableCell className="text-muted-foreground">{r.drip === 0 ? "Immediately" : `Day ${r.drip}`}</TableCell>
              <TableCell className="text-right tabular-nums">{r.lessons}</TableCell>
              <TableCell className="text-right tabular-nums">{r.resources}</TableCell>
              <TableCell className="text-right tabular-nums">{r.transcripts}</TableCell>
              <TableCell className="text-right tabular-nums">{formatHoursMinutes(r.video_sec)}</TableCell>
              <TableCell className="text-right tabular-nums">{r.xp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right tabular-nums">{pkg.stats.lesson_count}</TableCell>
            <TableCell className="text-right tabular-nums">{pkg.stats.resource_count}</TableCell>
            <TableCell className="text-right tabular-nums">{pkg.stats.transcript_count}</TableCell>
            <TableCell className="text-right tabular-nums">{formatHoursMinutes(pkg.stats.total_video_sec)}</TableCell>
            <TableCell className="text-right tabular-nums">{pkg.stats.total_xp}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <p className="text-xs text-muted-foreground">
        Quizzes: {pkg.quizzes.map((q) => q.key).join(", ") || "none"} · Forum categories: {pkg.forum_categories.length} · Source sheet: <span className="font-mono">{pkg.source.sheet}</span>
      </p>
    </section>
  );
}

export { ImportSummary };
