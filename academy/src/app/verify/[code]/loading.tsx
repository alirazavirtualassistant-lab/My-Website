import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function VerifyLoading() {
  return (
    <Section spacing="md">
      <Container size="md">
        <div className="mx-auto max-w-3xl" role="status" aria-label="Checking certificate">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="mt-3 h-10 w-80 max-w-full" />
          <Skeleton className="mt-3 h-5 w-48" />
          <div className="card-soft mt-8 p-5 sm:p-7">
            <Skeleton className="h-6 w-28" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12 sm:col-span-2" />
            </div>
            <Skeleton className="mt-6 aspect-[1.414/1] w-full" />
          </div>
          <span className="sr-only">Loading…</span>
        </div>
      </Container>
    </Section>
  );
}
