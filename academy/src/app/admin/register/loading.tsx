import { Skeleton } from "@/components/ui/skeleton";

export default function AdminRegisterLoading() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-cream px-4" role="status" aria-label="Loading">
      <div className="card-soft w-full max-w-[520px] p-6 sm:p-8">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-9 w-3/4" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-8 h-10 w-full" />
        <Skeleton className="mt-5 h-10 w-full" />
        <Skeleton className="mt-5 h-10 w-full" />
        <Skeleton className="mt-5 h-10 w-full" />
        <Skeleton className="mt-6 h-12 w-full" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
