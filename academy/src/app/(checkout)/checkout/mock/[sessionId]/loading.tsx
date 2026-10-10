import { Skeleton } from "@/components/ui/skeleton";

export default function MockCheckoutLoading() {
  return (
    <div role="status" aria-label="Loading payment page" className="grid gap-8">
      <div className="grid gap-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,19rem)]">
        <Skeleton className="h-56 w-full md:order-last" />
        <div className="card-soft grid gap-4 p-5 sm:p-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
