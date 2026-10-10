import { Skeleton } from "@/components/ui/skeleton";

export default function LearnLoading() {
  return (
    <div className="grid gap-10" role="status" aria-label="Loading your learning">
      <div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-10 w-72 max-w-full" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      </div>
      <div className="card-soft grid gap-6 p-5 sm:p-7 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <Skeleton className="h-3 w-40" />
          <Skeleton className="mt-3 h-4 w-56" />
          <Skeleton className="mt-2 h-8 w-80 max-w-full" />
          <Skeleton className="mt-4 h-4 w-40" />
          <div className="mt-5 flex gap-3">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-28" />
          </div>
        </div>
        <Skeleton className="size-28 rounded-full" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
