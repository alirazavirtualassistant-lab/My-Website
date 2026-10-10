"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { moveItem } from "./reorder";

interface FaqRow {
  key: string;
  q: string;
  a: string;
}

let seq = 0;
const nextKey = () => `faq-${++seq}`;

/**
 * Question/answer rows submitted as `faq_q[]` / `faq_a[]`. Rows are kept in
 * local state so add/remove/reorder work without a round trip; the server
 * action zips the two arrays back together.
 */
function FaqEditor({ initial }: { initial: Array<{ q: string; a: string }> }) {
  const [rows, setRows] = React.useState<FaqRow[]>(() => initial.map((f) => ({ ...f, key: nextKey() })));
  const update = (key: string, patch: Partial<FaqRow>) => setRows((r) => r.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  return (
    <div className="space-y-4">
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">No questions yet. Add the ones learners ask before enrolling.</p> : null}
      <ol className="space-y-4">
        {rows.map((row, i) => (
          <li key={row.key} className="rounded-lg border border-border bg-cream-2/40 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Question {i + 1}</p>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Move question ${i + 1} up`} disabled={i === 0} onClick={() => setRows((r) => moveItem(r, i, i - 1))}>
                  <ArrowUp />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Move question ${i + 1} down`} disabled={i === rows.length - 1} onClick={() => setRows((r) => moveItem(r, i, i + 1))}>
                  <ArrowDown />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-danger" aria-label={`Remove question ${i + 1}`} onClick={() => setRows((r) => r.filter((x) => x.key !== row.key))}>
                  <Trash2 />
                </Button>
              </div>
            </div>
            <div className="mt-3 grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor={`${row.key}-q`}>Question</Label>
                <Input id={`${row.key}-q`} name="faq_q[]" value={row.q} onChange={(e) => update(row.key, { q: e.target.value })} maxLength={200} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`${row.key}-a`}>Answer</Label>
                <Textarea id={`${row.key}-a`} name="faq_a[]" value={row.a} onChange={(e) => update(row.key, { a: e.target.value })} maxLength={2000} className="min-h-20" />
              </div>
            </div>
          </li>
        ))}
      </ol>
      <Button type="button" variant="outline" size="sm" onClick={() => setRows((r) => [...r, { key: nextKey(), q: "", a: "" }])}>
        <Plus /> Add a question
      </Button>
    </div>
  );
}

export { FaqEditor };
