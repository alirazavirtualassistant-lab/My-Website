import { Skeleton } from "@/components/ui/skeleton";

export default function NewPostLoading() {
  return (
    <div className="grid gap-8" role="status" aria-label="Loading the post form">
      <div className="grid gap-5">
        <Skeleton className="h-4 w-40" />
        <div>
          <Skeleton className="h-3 w-48" />
          <Skeleton className="mt-3 h-10 w-72 max-w-full" />
          <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        </div>
      </div>
      <div className="card-soft grid gap-5 p-5 sm:p-7">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-40" />
        <Skeleton className="h-16" />
        <Skeleton className="ml-auto h-10 w-36" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
