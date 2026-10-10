import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6" role="status" aria-label="Loading settings">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-[32rem] w-full" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
