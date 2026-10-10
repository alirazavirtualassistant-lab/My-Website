import { Skeleton } from "@/components/ui/skeleton";

export default function GiftLoading() {
  return (
    <div role="status" aria-label="Opening your gift" className="grid gap-8">
      <div className="flex items-center gap-6">
        <Skeleton className="size-26 rounded-full" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="card-soft p-5 sm:p-6">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-5 h-12 w-48" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
