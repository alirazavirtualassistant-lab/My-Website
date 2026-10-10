"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface CommunityFiltersProps {
  tab: "posts" | "replies";
  courses: Array<{ id: string; title: string }>;
  courseId: string | null;
  status: string;
  authorId: string | null;
  authorName?: string | null;
}

const ALL = "__all__";

/** Course + status filters; each change updates the URL so the view is shareable. */
function CommunityFilters({ tab, courses, courseId, status, authorId, authorName }: CommunityFiltersProps) {
  const router = useRouter();
  const push = (next: { course?: string | null; status?: string; author?: string | null }) => {
    const params = new URLSearchParams();
    params.set("tab", tab);
    const course = next.course === undefined ? courseId : next.course;
    const st = next.status ?? status;
    const author = next.author === undefined ? authorId : next.author;
    if (course) params.set("course", course);
    if (st && st !== "all") params.set("status", st);
    if (author) params.set("author", author);
    router.push(`/admin/community?${params.toString()}`);
  };
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="filter-course">Course</Label>
        <Select value={courseId ?? ALL} onValueChange={(v) => push({ course: v === ALL ? null : v })}>
          <SelectTrigger id="filter-course" size="sm" className="w-56">
            <SelectValue placeholder="All courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All courses</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="filter-status">Status</Label>
        <Select value={status} onValueChange={(v) => push({ status: v })}>
          <SelectTrigger id="filter-status" size="sm" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            <SelectItem value="visible">Visible</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
            <SelectItem value="removed">Removed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {authorId ? (
        <Button type="button" variant="secondary" size="sm" onClick={() => push({ author: null })} aria-label={`Stop filtering by ${authorName ?? "this member"}`}>
          By {authorName ?? "one member"} · clear
        </Button>
      ) : null}
    </div>
  );
}

export { CommunityFilters };
