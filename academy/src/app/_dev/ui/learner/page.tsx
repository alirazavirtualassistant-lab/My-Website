import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { LearnerShell } from "@/components/layout/learner-shell";
import { PageHeader, ProgressRing, StatCard, Card, CardContent } from "@/components/ui";
import { Illustration } from "@/components/shared/illustration";

export const metadata: Metadata = { title: "Learner shell preview", robots: { index: false } };

export default function LearnerShellPreview() {
  const user = { name: "Ada Lovelace", avatar_url: null, role: "learner" as const };
  return (
    <>
      <SiteHeader user={user} cartCount={0} />
      <LearnerShell
        aside={
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <ProgressRing value={35} size="sm" tone="rose" className="mx-auto" />
            <p className="mt-2 text-xs font-semibold text-muted-foreground">Baby Steps</p>
          </div>
        }
      >
        <PageHeader eyebrow="My learning" title="Welcome back, Ada" description="One small step today is plenty." />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Streak" value="4 days" tone="rose" />
          <StatCard label="XP" value="1,240" tone="gold" />
          <StatCard label="Level" value="Sprout" tone="sage" icon={<Illustration name="sprout" />} />
        </div>
        <Card className="mt-8">
          <CardContent>
            <p className="text-sm text-muted-foreground">Content area. On mobile the rail becomes a bottom tab bar.</p>
          </CardContent>
        </Card>
      </LearnerShell>
    </>
  );
}
