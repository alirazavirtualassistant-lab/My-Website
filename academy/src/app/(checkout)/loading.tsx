import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutGroupLoading() {
  return (
    <div role="status" aria-label="Loading" className="grid gap-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-2/3" />
      <div className="card-soft p-5 sm:p-6">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="mt-4 h-16 w-full" />
        <Skeleton className="mt-3 h-16 w-full" />
      </div>
      <Skeleton className="h-12 w-full sm:w-48" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
