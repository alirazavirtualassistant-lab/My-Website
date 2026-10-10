"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface EmailLogFiltersProps {
  templates: string[];
  template: string | null;
  status: string;
  q: string;
}

const ALL = "__all__";

/** Template + status selects update the URL immediately; the search box submits as a normal GET form. */
function EmailLogFilters({ templates, template, status, q }: EmailLogFiltersProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState(q);
  const push = (next: { template?: string | null; status?: string }) => {
    const params = new URLSearchParams();
    const t = next.template === undefined ? template : next.template;
    const s = next.status ?? status;
    if (t) params.set("template", t);
    if (s && s !== "all") params.set("status", s);
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    router.push(`/admin/emails${qs ? `?${qs}` : ""}`);
  };
  return (
    <form method="get" action="/admin/emails" role="search" className="flex flex-wrap items-end gap-3">
      {template ? <input type="hidden" name="template" value={template} /> : null}
      {status !== "all" ? <input type="hidden" name="status" value={status} /> : null}
      <div className="grid gap-1.5">
        <Label htmlFor="email-template">Template</Label>
        <Select value={template ?? ALL} onValueChange={(v) => push({ template: v === ALL ? null : v })}>
          <SelectTrigger id="email-template" size="sm" className="w-52">
            <SelectValue placeholder="All templates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All templates</SelectItem>
            {templates.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email-status">Status</Label>
        <Select value={status} onValueChange={(v) => push({ status: v })}>
          <SelectTrigger id="email-status" size="sm" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid min-w-[220px] flex-1 gap-1.5">
        <Label htmlFor="email-q">Recipient or subject</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input id="email-q" name="q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} className="h-9 pl-9" placeholder="name@example.com" autoComplete="off" />
        </div>
      </div>
      <Button type="submit" variant="secondary" size="sm">
        Search
      </Button>
    </form>
  );
}

export { EmailLogFilters };
