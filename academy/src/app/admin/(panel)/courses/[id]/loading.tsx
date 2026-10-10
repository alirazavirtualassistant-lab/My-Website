import { Skeleton } from "@/components/ui/skeleton";

export default function CourseLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6" role="status" aria-label="Loading course">
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-44" />
      <Skeleton className="h-96" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
