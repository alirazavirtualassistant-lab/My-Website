"use client";

import { AdminErrorState } from "@/components/admin/dashboard/admin-error-state";

export default function AdminDashboardError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <AdminErrorState error={error} retry={retry} title="The dashboard didn’t load." backHref="/" backLabel="View site" />;
}
