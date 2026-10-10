import { Skeleton } from "@/components/ui/skeleton";

export default function CertificatesLoading() {
  return (
    <div className="grid gap-10" role="status" aria-label="Loading certificates">
      <div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-10 w-64 max-w-full" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="card-soft p-4 sm:p-5">
            <Skeleton className="aspect-[1.414/1] w-full" />
            <Skeleton className="mt-4 h-5 w-2/3" />
            <Skeleton className="mt-2 h-4 w-1/2" />
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-36" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
