import { Skeleton } from "@/components/ui/skeleton";

export default function TestimonialsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6" role="status" aria-label="Loading testimonials">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <Skeleton className="h-11 w-80 max-w-full" />
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-36 w-full" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
