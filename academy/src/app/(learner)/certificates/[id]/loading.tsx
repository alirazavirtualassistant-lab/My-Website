import { Skeleton } from "@/components/ui/skeleton";

export default function CertificateLoading() {
  return (
    <div className="grid gap-8" role="status" aria-label="Loading certificate">
      <Skeleton className="h-4 w-28" />
      <div>
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-3 h-10 w-96 max-w-full" />
        <Skeleton className="mt-3 h-4 w-64 max-w-full" />
      </div>
      <Skeleton className="aspect-[1.414/1] w-full max-w-4xl" />
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,22rem)]">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
