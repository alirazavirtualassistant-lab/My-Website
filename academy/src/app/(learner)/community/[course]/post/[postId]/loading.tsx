import { Skeleton } from "@/components/ui/skeleton";

export default function PostLoading() {
  return (
    <div className="grid gap-8" role="status" aria-label="Loading the post">
      <Skeleton className="h-4 w-40" />
      <div className="card-soft grid gap-5 p-5 sm:p-7">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-9 w-20" />
      </div>
      <div className="grid gap-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
