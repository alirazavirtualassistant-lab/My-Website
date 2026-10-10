"use client";

import { AdminErrorState } from "@/components/admin/dashboard/admin-error-state";

export default function CurriculumError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <AdminErrorState error={error} retry={retry} title="The curriculum didn’t load." backHref="/admin/courses" backLabel="All courses" />;
}
