import type { Metadata } from "next";
import Link from "next/link";
import { Check, Pencil, Plus, Quote, Star, Trash2, X } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { getServices } from "@/services";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { ActionButton } from "@/components/admin/students/action-button";
import { ConfirmActionDialog } from "@/components/admin/students/confirm-action-dialog";
import { TestimonialFormDialog } from "@/components/admin/testimonials/testimonial-form-dialog";
import { getTestimonialsData, type TestimonialTab } from "./queries";
import { deleteTestimonialAction, moderateTestimonialAction, setFeaturedAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Testimonials", robots: { index: false, follow: false } };

const TABS: Array<{ key: TestimonialTab; label: string }> = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

function Stars({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-xs text-muted-foreground">No rating</span>;
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("size-3.5", i < rating ? "fill-gold text-gold" : "text-line")} aria-hidden="true" />
      ))}
    </span>
  );
}

export default async function AdminTestimonialsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const sp = await searchParams;
  const tab: TestimonialTab = sp.status === "approved" || sp.status === "rejected" ? sp.status : "pending";
  const [{ rows, counts, courses }, settings] = await Promise.all([getTestimonialsData(tab), getServices().then(({ db }) => db.from("site_settings").get("default"))]);
  const courseOptions = courses.map((c) => ({ id: c.id, title: c.title }));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        eyebrow="Social proof"
        title="Testimonials"
        description="Learners submit these from the capstone lesson. Approve what you’re happy to show; feature the ones that should lead."
        actions={
          <TestimonialFormDialog
            testimonial={null}
            courses={courseOptions}
            trigger={
              <Button>
                <Plus aria-hidden="true" /> Add testimonial
              </Button>
            }
          />
        }
      />

      {settings && !settings.testimonials_enabled ? (
        <Alert variant="warning">
          <AlertTitle>Testimonials are switched off on the public site</AlertTitle>
          <AlertDescription>
            <p>
              Approved testimonials are hidden until you turn them back on in{" "}
              <Link href="/admin/settings" className="underline underline-offset-4">
                Settings
              </Link>
              .
            </p>
          </AlertDescription>
        </Alert>
      ) : null}

      <nav aria-label="Testimonial status" className="inline-flex h-11 w-fit max-w-full items-center gap-1 overflow-x-auto rounded-lg bg-muted-bg p-1 no-scrollbar">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/testimonials?status=${t.key}`}
            aria-current={tab === t.key ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              tab === t.key ? "bg-card text-rose-strong shadow-soft" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            <Badge variant={t.key === "pending" && counts.pending > 0 ? "rose" : "muted"}>{counts[t.key]}</Badge>
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <EmptyState
          icon={<Quote />}
          title={tab === "pending" ? "Nothing waiting for review" : tab === "approved" ? "No approved testimonials yet" : "No rejected testimonials"}
          description={tab === "pending" ? "New submissions from the capstone lesson land here." : tab === "approved" ? "Approve a pending one, or add one you have permission to share." : "Rejected testimonials stay here for your records."}
        />
      ) : (
        <ul className="grid gap-4">
          {rows.map((t) => (
            <li key={t.id} className={cn("card-soft p-5 sm:p-6", t.featured && "border-gold/60")}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-serif text-xl leading-tight">{t.author_name}</p>
                    {t.author_role ? <span className="text-sm text-muted-foreground">· {t.author_role}</span> : null}
                    {t.featured ? <Badge variant="gold">Featured</Badge> : null}
                    {!t.user_id ? <Badge variant="outline">Added by hand</Badge> : null}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <Stars rating={t.rating} />
                    <span>{t.course_title ?? "General"}</span>
                    <span>{formatDate(t.created_at, { month: "short", day: "numeric", year: "numeric" })}</span>
                    {t.submitter_email ? (
                      <Link href={`/admin/students/${t.user_id}`} className="text-rose-strong underline-offset-4 hover:underline">
                        {t.submitter_email}
                      </Link>
                    ) : null}
                  </div>
                  <blockquote className="mt-3 border-l-2 border-gold pl-3 text-sm leading-relaxed whitespace-pre-line text-foreground/90">{t.body}</blockquote>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1 sm:max-w-[200px] sm:justify-end">
                  {t.status !== "approved" ? (
                    <ActionButton action={moderateTestimonialAction} fields={{ id: t.id, status: "approved" }} size="sm" pendingLabel="Approving…">
                      <Check aria-hidden="true" /> Approve
                    </ActionButton>
                  ) : null}
                  {t.status !== "rejected" ? (
                    <ActionButton action={moderateTestimonialAction} fields={{ id: t.id, status: "rejected" }} variant="outline" size="sm" pendingLabel="Rejecting…">
                      <X aria-hidden="true" /> Reject
                    </ActionButton>
                  ) : null}
                  {t.status === "approved" ? (
                    <ActionButton action={setFeaturedAction} fields={{ id: t.id, featured: t.featured ? "0" : "1" }} variant={t.featured ? "secondary" : "outline"} size="sm" pendingLabel="Saving…" aria-pressed={t.featured}>
                      <Star aria-hidden="true" /> {t.featured ? "Unfeature" : "Feature"}
                    </ActionButton>
                  ) : null}
                  <TestimonialFormDialog
                    testimonial={t}
                    courses={courseOptions}
                    trigger={
                      <Button variant="ghost" size="sm">
                        <Pencil aria-hidden="true" /> Edit
                      </Button>
                    }
                  />
                  <ConfirmActionDialog
                    action={deleteTestimonialAction}
                    fields={{ id: t.id }}
                    trigger={
                      <Button variant="ghost" size="sm" className="text-danger hover:bg-danger-soft hover:text-danger">
                        <Trash2 aria-hidden="true" /> Delete
                      </Button>
                    }
                    title="Delete this testimonial?"
                    description={`“${t.body.slice(0, 80)}${t.body.length > 80 ? "…" : ""}” by ${t.author_name} will be gone for good. Rejecting keeps it on file instead.`}
                    confirmLabel="Delete"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
