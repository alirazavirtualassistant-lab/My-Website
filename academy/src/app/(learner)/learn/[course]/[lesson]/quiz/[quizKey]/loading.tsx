import { Skeleton } from "@/components/ui/skeleton";

export default function QuizLoading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8" role="status" aria-label="Loading quiz">
      <Skeleton className="h-4 w-64" />
      <div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-10 w-2/3" />
        <Skeleton className="mt-3 h-16 w-full" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card-soft p-4">
          <Skeleton className="h-5 w-3/4" />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
