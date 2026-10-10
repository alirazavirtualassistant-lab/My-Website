import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div role="status" aria-label="Loading your cart" className="grid gap-8">
      <div className="grid gap-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="card-soft p-5 sm:p-6">
        <Skeleton className="h-7 w-24" />
        <div className="mt-4 flex gap-4">
          <Skeleton className="size-14 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="mt-2 h-3 w-1/3" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,18rem)]">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
