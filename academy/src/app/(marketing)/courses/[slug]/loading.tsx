import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseLoading() {
  return (
    <div role="status" aria-label="Loading course">
      <Section tone="cream2" spacing="md" className="border-b border-border">
        <Container size="xl" className="grid gap-8 lg:grid-cols-[1fr_22rem]">
          <div>
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-5 h-12 w-3/4" />
            <Skeleton className="mt-4 h-5 w-full max-w-2xl" />
            <Skeleton className="mt-2 h-5 w-2/3 max-w-xl" />
            <div className="mt-6 flex flex-wrap gap-3">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-5 w-28" />
              ))}
            </div>
          </div>
          <Skeleton className="aspect-[16/9] w-full" />
        </Container>
      </Section>
      <Section spacing="md">
        <Container size="xl" className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-10">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </Container>
      </Section>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
