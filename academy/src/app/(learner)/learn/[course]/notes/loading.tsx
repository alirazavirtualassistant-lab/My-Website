import { Skeleton } from "@/components/ui/skeleton";

export default function NotesLoading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8" role="status" aria-label="Loading notes">
      <Skeleton className="h-4 w-48" />
      <div className="flex items-end justify-between gap-4">
        <div>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-10 w-72" />
          <Skeleton className="mt-3 h-4 w-40" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="card-soft p-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
