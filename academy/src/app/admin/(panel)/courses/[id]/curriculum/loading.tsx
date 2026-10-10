import { Skeleton } from "@/components/ui/skeleton";

export default function CurriculumLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6" role="status" aria-label="Loading curriculum">
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-10 w-64" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-40" />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
