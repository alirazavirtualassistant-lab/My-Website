import type { Metadata } from "next";
import { AdminShell } from "@/components/layout/admin-shell";
import { PageHeader, StatCard, EmptyState, Button } from "@/components/ui";
import { Inbox } from "lucide-react";

export const metadata: Metadata = { title: "Admin shell preview", robots: { index: false } };

export default function AdminShellPreview() {
  return (
    <AdminShell user={{ name: "Cynthia Myers Morrison", avatar_url: null, role: "admin" }}>
      <PageHeader eyebrow="Admin" title="Dashboard" description="Shell preview with placeholder content." actions={<Button size="sm">New course</Button>} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue (30d)" value="$4,925" hint="+12% vs last month" trend="up" />
        <StatCard label="Students" value="128" />
        <StatCard label="Active" value="87" tone="sage" />
        <StatCard label="Completions" value="23" tone="gold" />
      </div>
      <EmptyState className="mt-8" icon={<Inbox />} title="No pending testimonials" description="New submissions will wait here for review." />
    </AdminShell>
  );
}
