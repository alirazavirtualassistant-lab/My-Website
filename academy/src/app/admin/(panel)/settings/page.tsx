import type { Metadata } from "next";
import { FlaskConical, RotateCcw } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getServices } from "@/services";
import { env } from "@/lib/env";
import { ensureSettings } from "@/lib/usecases/demo";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { ConfirmActionDialog } from "@/components/admin/students/confirm-action-dialog";
import { BrandForm } from "@/components/admin/settings/brand-form";
import { ColorsForm } from "@/components/admin/settings/colors-form";
import { LegalForm } from "@/components/admin/settings/legal-form";
import { LogoForm } from "@/components/admin/settings/logo-form";
import { LEGAL_PAGES } from "@/components/admin/settings/legal-pages";
import { resetDemoDataAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Settings", robots: { index: false, follow: false } };

function Section({ id, title, description, children, tone = "default" }: { id: string; title: string; description?: React.ReactNode; children: React.ReactNode; tone?: "default" | "danger" }) {
  return (
    <section aria-labelledby={`${id}-title`} className={`card-soft p-5 sm:p-6 ${tone === "danger" ? "border-danger/30" : ""}`}>
      <header className="mb-5">
        <h2 id={`${id}-title`} className="font-serif text-2xl leading-tight">
          {title}
        </h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}

export default async function AdminSettingsPage() {
  await requireRole("admin", "/admin/settings");
  const { db, storage, mode } = await getServices();
  const settings = await ensureSettings(db);
  const logoUrl = settings.logo_path ? storage.getPublicUrl({ bucket: "public-assets", path: settings.logo_path }) : null;
  const legalValues: Record<string, string> = {};
  for (const p of LEGAL_PAGES) legalValues[p.key] = settings.legal[p.key] ?? "";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader eyebrow="Owner only" title="Settings" description={`Site identity, legal pages and automatic emails. Last saved ${formatDate(settings.updated_at, { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}.`} />

      <Section id="brand" title="Site" description="Name, support address, the medical disclaimer and the automatic emails.">
        <BrandForm settings={settings} />
      </Section>

      <Section id="logo" title="Logo" description="Replaces the built-in line-art mark in the header, footer and emails.">
        <LogoForm logoUrl={logoUrl} />
      </Section>

      <Section id="legal" title="Legal pages" description="Terms, privacy, refunds, the medical disclaimer page and cookies. Each one is marked for legal review until a professional has signed off.">
        <LegalForm pages={LEGAL_PAGES} values={legalValues} />
      </Section>

      <Section id="colors" title="Colours" description="Optional overrides for the design tokens. Stored only; nothing on the live site changes yet.">
        <ColorsForm colors={settings.colors} />
      </Section>

      {env.demo ? (
        <Section id="demo" title="Demo data" tone="danger" description={`Backend: ${mode.backend} · payments: ${mode.payments} · email: ${mode.email}. Reset wipes every account, order and post and re-seeds the Baby Steps course with the demo accounts.`}>
          <ConfirmActionDialog
            action={resetDemoDataAction}
            fields={{}}
            trigger={
              <Button variant="destructive">
                <RotateCcw aria-hidden="true" /> Reset demo data
              </Button>
            }
            title="Reset all demo data?"
            description="Everything in the data store is deleted and re-seeded: demo accounts, the Baby Steps course, products, the sample enrollment and progress. You will be signed out and asked to sign in again with the demo admin account."
            confirmWord="RESET"
            confirmLabel="Reset everything"
            warning={
              <span className="inline-flex items-center gap-1.5">
                <FlaskConical className="size-3.5" aria-hidden="true" /> Demo mode only. This button does not exist on a live site.
              </span>
            }
          />
        </Section>
      ) : null}
    </div>
  );
}
