"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingDown } from "lucide-react";
import type { AdminDashboardStats } from "@/lib/usecases/admin";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Row = AdminDashboardStats["dropoff"][number];

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Row }> }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div role="status" className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-card">
      <p className="font-mono font-semibold text-muted-foreground">{row.lesson_code}</p>
      <p className="max-w-[16rem] font-semibold text-foreground">{row.lesson_title}</p>
      <p className="mt-1 text-muted-foreground">
        <span className="font-semibold text-foreground tabular-nums">{row.reached}</span> {row.reached === 1 ? "learner has" : "learners have"} opened it
      </p>
    </div>
  );
}

/**
 * Drop-off: how many learners reached each lesson, in course order. One
 * series, so the title names it and there is no legend; the table below the
 * chart is the accessible view of the same numbers.
 */
function DropoffChart({ data }: { data: AdminDashboardStats["dropoff"] }) {
  const rows = data.filter((d) => d.lesson_code);
  const peak = rows.reduce((m, r) => Math.max(m, r.reached), 0);
  const tickEvery = Math.max(1, Math.ceil(rows.length / 8));
  return (
    <section aria-labelledby="dropoff-title" className="card-soft p-5 sm:p-6">
      <div className="mb-4">
        <p className="eyebrow">Engagement</p>
        <h2 id="dropoff-title" className="mt-1 font-serif text-xl font-medium">
          Where learners are
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Learners who have opened each lesson, in course order. A gentle slope is normal; a cliff is worth a look.</p>
      </div>
      {rows.length === 0 || peak === 0 ? (
        <EmptyState size="sm" icon={<TrendingDown />} title="Nothing to chart yet" description="This fills in as learners open lessons." />
      ) : (
        <>
          <div className="h-64 w-full" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 4, left: -16 }} barCategoryGap={2}>
                <CartesianGrid vertical={false} stroke="var(--line)" strokeWidth={1} />
                <XAxis dataKey="lesson_code" interval={tickEvery - 1} tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} width={40} tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "var(--rose-soft)", opacity: 0.6 }} content={<ChartTooltip />} />
                <Bar dataKey="reached" fill="var(--rose)" radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <details className="mt-3 text-sm">
            <summary className="cursor-pointer text-rose-strong underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">View as a table</summary>
            <div className="mt-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Lesson</TableHead>
                    <TableHead className="text-right">Learners reached</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.lesson_id ?? r.lesson_code}>
                      <TableCell className="font-mono text-xs">{r.lesson_code}</TableCell>
                      <TableCell className="max-w-[24rem] truncate">{r.lesson_title}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.reached}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </details>
        </>
      )}
    </section>
  );
}

export { DropoffChart };
