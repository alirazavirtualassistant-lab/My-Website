import { Skeleton } from "@/components/ui/skeleton";

export default function LessonEditorLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6" role="status" aria-label="Loading lesson">
      <div className="space-y-2">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Skeleton className="h-[32rem]" />
        <div className="space-y-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-40" />
          <Skeleton className="h-32" />
        </div>
      </div>
      <Skeleton className="h-56" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
