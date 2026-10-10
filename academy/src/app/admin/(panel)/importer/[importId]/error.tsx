"use client";

import { AdminErrorState } from "@/components/admin/dashboard/admin-error-state";

export default function ImportPreviewError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <AdminErrorState error={error} retry={retry} title="The import preview didn’t load." backHref="/admin/importer" backLabel="Back to importer" />;
}
