import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <div role="status" aria-label="Preparing checkout" className="grid gap-8">
      <div className="grid gap-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,19rem)]">
        <div className="card-soft p-5 sm:p-6 md:order-last">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-4 h-16 w-full" />
          <Skeleton className="mt-6 h-24 w-full" />
        </div>
        <div className="card-soft grid gap-5 p-5 sm:p-6">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
