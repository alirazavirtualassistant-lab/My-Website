import type { Metadata } from "next";
import { site } from "@/lib/config/site";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { CourseCatalog } from "@/components/marketing/course-filters";
import { CourseGrid } from "@/components/marketing/course-grid";
import { parseCatalogFilters } from "@/components/marketing/catalog-data";
import { loadCatalog } from "../_lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Courses",
  description: `Browse every course from ${site.instructor.name}: science-backed, heart-led, one baby step at a time.`,
  alternates: { canonical: "/courses" },
  openGraph: { title: `Courses · ${site.name}`, description: site.description, url: "/courses" },
};

export default async function CoursesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [params, catalog] = await Promise.all([searchParams, loadCatalog()]);
  const filters = parseCatalogFilters(params);
  return (
    <>
      <Section spacing="md">
        <Container>
          <PageHeader
            eyebrow="Courses"
            title="Start where you are"
            description="Every course pairs short videos with downloadable resources and small, repeatable actions. Filter by what you need most right now."
          />
          <div className="mt-10">
            <CourseCatalog courses={catalog.published} initialFilters={filters} />
          </div>
        </Container>
      </Section>

      {catalog.scheduled.length > 0 ? (
        <Section tone="cream2" spacing="md" aria-labelledby="coming-soon-heading">
          <Container>
            <p className="eyebrow">On the way</p>
            <h2 id="coming-soon-heading" className="mt-2">
              Coming soon
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">Courses Cynthia is preparing now. Join the newsletter on the home page to hear when they open.</p>
            <CourseGrid courses={catalog.scheduled} comingSoon className="mt-8" headingLevel="h3" />
          </Container>
        </Section>
      ) : null}

      <Section spacing="sm">
        <Container size="md">
          <MedicalDisclaimer />
        </Container>
      </Section>
    </>
  );
}
