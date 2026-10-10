import { Skeleton } from "@/components/ui/skeleton";

export default function ImportPreviewLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6" role="status" aria-label="Loading import preview">
      <div className="space-y-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <Skeleton className="h-80" />
      <Skeleton className="h-48" />
      <Skeleton className="h-32" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
