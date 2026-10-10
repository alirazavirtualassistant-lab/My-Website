import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24" role="status" aria-label="Loading">
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="mx-auto h-3 w-24" />
        <Skeleton className="mx-auto h-9 w-3/4" />
        <Skeleton className="mx-auto h-4 w-5/6" />
        <Skeleton className="mx-auto h-4 w-2/3" />
        <div className="flex justify-center gap-3 pt-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
