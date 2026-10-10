"use client";

import { AdminErrorState } from "@/components/admin/dashboard/admin-error-state";

export default function CourseError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <AdminErrorState error={error} retry={retry} title="This course didn’t load." backHref="/admin/courses" backLabel="All courses" />;
}
