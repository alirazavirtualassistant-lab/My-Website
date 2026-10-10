import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityLoading() {
  return (
    <div className="grid gap-8" role="status" aria-label="Loading your communities">
      <div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-10 w-64 max-w-full" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-44" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
