import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="card-soft w-full p-6 sm:p-8" role="status" aria-label="Loading">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3 h-9 w-2/3" />
      <Skeleton className="mt-2 h-4 w-5/6" />
      <Skeleton className="mt-8 h-12 w-full" />
      <div className="my-5 h-px bg-border" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="mt-2 h-10 w-full" />
      <Skeleton className="mt-5 h-4 w-20" />
      <Skeleton className="mt-2 h-10 w-full" />
      <Skeleton className="mt-6 h-12 w-full" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
