"use client";

import { AdminErrorState } from "@/components/admin/dashboard/admin-error-state";

export default function AdminCoursesError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <AdminErrorState error={error} retry={retry} title="The courses page didn’t load." />;
}
