import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <div className="grid gap-8" role="status" aria-label="Loading posts">
      <div className="grid gap-5">
        <Skeleton className="h-4 w-48" />
        <div>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-10 w-72 max-w-full" />
          <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        </div>
      </div>
      <Skeleton className="h-10 w-52" />
      <div className="grid gap-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
