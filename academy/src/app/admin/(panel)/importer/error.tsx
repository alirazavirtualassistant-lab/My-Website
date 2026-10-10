"use client";

import { AdminErrorState } from "@/components/admin/dashboard/admin-error-state";

export default function ImporterError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <AdminErrorState error={error} retry={retry} title="The importer didn’t load." />;
}
