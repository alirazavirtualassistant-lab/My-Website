import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <div className="card-soft p-5 sm:p-6" role="status" aria-label="Loading">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="mt-2 h-4 w-72 max-w-full" />
      <div className="mt-6 grid gap-5">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-2/3" />
      </div>
      <Skeleton className="mt-6 h-10 w-36" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
