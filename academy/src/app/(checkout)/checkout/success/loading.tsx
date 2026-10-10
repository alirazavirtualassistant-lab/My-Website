import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutSuccessLoading() {
  return (
    <div role="status" aria-label="Loading your order" className="grid gap-8">
      <div className="flex items-center gap-6">
        <Skeleton className="size-24 rounded-full" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <Skeleton className="h-12 w-44" />
      <Skeleton className="h-28 w-full" />
      <div className="card-soft p-5 sm:p-6">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-4 h-16 w-full" />
        <Skeleton className="mt-5 h-20 w-full" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
