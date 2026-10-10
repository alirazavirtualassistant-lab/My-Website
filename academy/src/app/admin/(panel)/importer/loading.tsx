import { Skeleton } from "@/components/ui/skeleton";

export default function ImporterLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8" role="status" aria-label="Loading importer">
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <Skeleton className="h-64" />
      <Skeleton className="h-32" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
