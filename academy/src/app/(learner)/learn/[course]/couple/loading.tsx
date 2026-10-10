import { Skeleton } from "@/components/ui/skeleton";

export default function CoupleLoading() {
  return (
    <div role="status" aria-label="Loading the couple space" className="grid gap-10">
      <div className="grid gap-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <div className="card-soft p-5 sm:p-6">
        <Skeleton className="h-7 w-32" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
      <div className="grid gap-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-72 w-full" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
