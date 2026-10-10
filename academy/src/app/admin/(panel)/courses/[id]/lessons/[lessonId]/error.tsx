"use client";

import { AdminErrorState } from "@/components/admin/dashboard/admin-error-state";

export default function LessonEditorError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <AdminErrorState error={error} retry={retry} title="This lesson didn’t load." backHref="/admin/courses" backLabel="All courses" />;
}
