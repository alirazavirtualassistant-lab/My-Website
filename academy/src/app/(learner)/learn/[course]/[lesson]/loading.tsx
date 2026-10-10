import { Skeleton } from "@/components/ui/skeleton";

export default function LessonLoading() {
  return (
    <div className="flex flex-col gap-4" role="status" aria-label="Loading lesson">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="card-soft hidden p-3 xl:block">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-3 h-1.5 w-full" />
          <div className="mt-4 flex flex-col gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="aspect-video w-full rounded-lg" />
          <div>
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-3 h-9 w-3/4 max-w-xl" />
            <Skeleton className="mt-3 h-5 w-1/2 max-w-md" />
            <Skeleton className="mt-4 h-10 w-52" />
          </div>
          <Skeleton className="h-10 w-full max-w-2xl rounded-lg" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
