"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** GET search box; keeps the URL shareable (?q=…) and works without JS. */
function StudentsSearch({ initialQuery, basePath = "/admin/students", placeholder = "Search by name or email" }: { initialQuery: string; basePath?: string; placeholder?: string }) {
  const router = useRouter();
  const [value, setValue] = React.useState(initialQuery);
  return (
    <form method="get" action={basePath} role="search" className="flex w-full max-w-xl items-end gap-2">
      <div className="relative flex-1">
        <Label htmlFor="students-q" className="sr-only">
          Search students
        </Label>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input id="students-q" name="q" type="search" value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} className="pl-9" autoComplete="off" />
      </div>
      <Button type="submit" variant="secondary">
        Search
      </Button>
      {initialQuery ? (
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setValue("");
            router.push(basePath);
          }}
        >
          <X aria-hidden="true" /> Clear
        </Button>
      ) : null}
    </form>
  );
}

export { StudentsSearch };
