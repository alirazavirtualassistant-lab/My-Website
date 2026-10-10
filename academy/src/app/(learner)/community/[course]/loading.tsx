import { Skeleton } from "@/components/ui/skeleton";

export default function CourseCommunityLoading() {
  return (
    <div className="grid gap-10" role="status" aria-label="Loading the community">
      <div className="grid gap-5">
        <Skeleton className="h-4 w-32" />
        <div>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-10 w-80 max-w-full" />
          <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-full max-w-xl" />
      </div>
      <Skeleton className="h-36" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
