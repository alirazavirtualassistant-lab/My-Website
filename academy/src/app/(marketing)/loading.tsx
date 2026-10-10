import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function MarketingLoading() {
  return (
    <Section spacing="lg" role="status" aria-label="Loading page">
      <Container>
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-4 h-12 w-3/4 max-w-2xl" />
        <Skeleton className="mt-3 h-5 w-2/3 max-w-xl" />
        <div className="mt-8 flex gap-3">
          <Skeleton className="h-12 w-44" />
          <Skeleton className="h-12 w-36" />
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="card-soft overflow-hidden">
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
        <span className="sr-only">Loading…</span>
      </Container>
    </Section>
  );
}
