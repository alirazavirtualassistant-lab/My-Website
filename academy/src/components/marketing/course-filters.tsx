"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { site } from "@/lib/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CourseGrid } from "./course-grid";
import {
  CATALOG_SORTS,
  DEFAULT_FILTERS,
  DURATION_BUCKETS,
  PRICE_FILTERS,
  activeFilterCount,
  applyCatalogFilters,
  filtersToSearchParams,
  type CatalogFilters,
  type CatalogSort,
  type CourseCardData,
} from "./catalog-data";

const SEARCH_DEBOUNCE_MS = 250;

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        pressed ? "border-rose bg-rose-soft text-rose-strong" : "border-border bg-card text-foreground/85 hover:border-rose/50 hover:text-rose-strong",
      )}
    >
      {children}
    </button>
  );
}

function ChipGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

export interface CourseFiltersProps {
  filters: CatalogFilters;
  query: string;
  onQueryChange: (q: string) => void;
  onChange: (next: CatalogFilters) => void;
  resultCount: number;
}

/** Search box, topic / level / duration / price chips and the sort select. */
function CourseFilters({ filters, query, onQueryChange, onChange, resultCount }: CourseFiltersProps) {
  const toggle = <K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) => onChange({ ...filters, [key]: filters[key] === value ? null : value });
  const active = activeFilterCount({ ...filters, q: query });
  return (
    <div data-slot="course-filters" className="card-soft space-y-6 p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1.5">
          <Label htmlFor="catalog-search">Search courses</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Try “cravings” or “nutrition”"
              autoComplete="off"
              className="pl-9"
              aria-controls="catalog-results"
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="catalog-sort">Sort by</Label>
          <select
            id="catalog-sort"
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value as CatalogSort })}
            className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none focus-visible:border-rose focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            {CATALOG_SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChipGroup label="Topic">
          {site.topics.map((t) => (
            <Chip key={t.key} pressed={filters.topic === t.key} onClick={() => toggle("topic", t.key)}>
              {t.label}
            </Chip>
          ))}
        </ChipGroup>
        <ChipGroup label="Level">
          {site.levels.map((l) => (
            <Chip key={l} pressed={filters.level === l} onClick={() => toggle("level", l)}>
              {l}
            </Chip>
          ))}
        </ChipGroup>
        <ChipGroup label="Duration">
          {DURATION_BUCKETS.map((b) => (
            <Chip key={b.key} pressed={filters.duration === b.key} onClick={() => toggle("duration", b.key)}>
              {b.label}
            </Chip>
          ))}
        </ChipGroup>
        <ChipGroup label="Price">
          {PRICE_FILTERS.map((p) => (
            <Chip key={p.key} pressed={filters.price === p.key} onClick={() => toggle("price", p.key)}>
              {p.label}
            </Chip>
          ))}
        </ChipGroup>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {resultCount === 1 ? "1 course" : `${resultCount} courses`}
          {active > 0 ? ` · ${active} ${active === 1 ? "filter" : "filters"} on` : ""}
        </p>
        {active > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onQueryChange("");
              onChange({ ...DEFAULT_FILTERS, sort: filters.sort });
            }}
          >
            <X aria-hidden="true" /> Clear filters
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export interface CourseCatalogProps {
  courses: CourseCardData[];
  initialFilters: CatalogFilters;
}

/**
 * Filters the already-loaded list on the client (no round trip) and mirrors
 * the state into the URL with history.replaceState so links stay shareable.
 */
function CourseCatalog({ courses, initialFilters }: CourseCatalogProps) {
  const pathname = usePathname();
  const [filters, setFilters] = React.useState<CatalogFilters>(initialFilters);
  const [query, setQuery] = React.useState(initialFilters.q);
  const timer = React.useRef<number | null>(null);

  const onQueryChange = (value: string) => {
    setQuery(value);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFilters((f) => ({ ...f, q: value.trim().slice(0, 80) })), SEARCH_DEBOUNCE_MS);
  };

  React.useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  React.useEffect(() => {
    const next = filtersToSearchParams(filters).toString();
    const current = window.location.search.replace(/^\?/, "");
    if (next !== current) window.history.replaceState(window.history.state, "", next ? `${pathname}?${next}` : pathname);
  }, [filters, pathname]);

  const visible = React.useMemo(() => applyCatalogFilters(courses, filters), [courses, filters]);

  return (
    <div className="space-y-8">
      <CourseFilters filters={filters} query={query} onQueryChange={onQueryChange} onChange={setFilters} resultCount={visible.length} />
      <div id="catalog-results">
        <CourseGrid
          courses={visible}
          emptyAction={
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setQuery("");
                setFilters({ ...DEFAULT_FILTERS, sort: filters.sort });
              }}
            >
              Clear filters
            </Button>
          }
        />
      </div>
    </div>
  );
}

export { CourseCatalog, CourseFilters };
