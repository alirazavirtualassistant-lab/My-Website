import { Skeleton } from "@/components/ui/skeleton";

export default function CourseOverviewLoading() {
  return (
    <div className="flex flex-col gap-10" role="status" aria-label="Loading course">
      <div className="card-soft p-5 sm:p-8">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-10 w-3/4 max-w-xl" />
        <Skeleton className="mt-3 h-5 w-1/2 max-w-md" />
        <Skeleton className="mt-6 h-3 w-full max-w-2xl" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-36 rounded-full" />
        </div>
        <Skeleton className="mt-6 h-12 w-40" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-soft flex gap-4 p-5">
            <Skeleton className="hidden size-16 sm:block" />
            <div className="flex-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-2 h-7 w-2/3" />
              <Skeleton className="mt-2 h-4 w-full max-w-lg" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
