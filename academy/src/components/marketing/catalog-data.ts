import type { CourseStatus } from "@/lib/types";
import { site } from "@/lib/config/site";
import type { EffectivePrice } from "./price";

/** Serialisable summary of a course for cards, filters and the catalog grid. */
export interface CourseCardData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  short_description: string;
  illustration: string | null;
  thumbnail_url: string | null;
  level: string;
  language: string;
  topics: string[];
  badge: "bestseller" | "new" | null;
  status: CourseStatus;
  publish_at: string | null;
  created_at: string;
  last_updated_at: string;
  duration_sec: number;
  lesson_count: number;
  module_count: number;
  resource_count: number;
  price: EffectivePrice | null;
  enrollment_count: number;
}

export const DURATION_BUCKETS = [
  { key: "short", label: "Under 3 hours", min: 0, max: 3 * 3600 },
  { key: "medium", label: "3–8 hours", min: 3 * 3600, max: 8 * 3600 },
  { key: "long", label: "8+ hours", min: 8 * 3600, max: Number.POSITIVE_INFINITY },
] as const;
export type DurationBucket = (typeof DURATION_BUCKETS)[number]["key"];

export const PRICE_FILTERS = [
  { key: "free", label: "Free" },
  { key: "paid", label: "Paid" },
] as const;
export type PriceFilter = (typeof PRICE_FILTERS)[number]["key"];

export const CATALOG_SORTS = [
  { key: "newest", label: "Newest" },
  { key: "popular", label: "Most popular" },
] as const;
export type CatalogSort = (typeof CATALOG_SORTS)[number]["key"];

export interface CatalogFilters {
  q: string;
  topic: string | null;
  level: string | null;
  duration: DurationBucket | null;
  price: PriceFilter | null;
  sort: CatalogSort;
}

export const DEFAULT_FILTERS: CatalogFilters = { q: "", topic: null, level: null, duration: null, price: null, sort: "newest" };

type ParamValue = string | string[] | undefined;
const first = (v: ParamValue): string => (Array.isArray(v) ? (v[0] ?? "") : (v ?? ""));

const topicKeys = new Set<string>(site.topics.map((t) => t.key));
const levelKeys = new Set<string>(site.levels);

/** Reads ?q=&topic=&level=&duration=&price=&sort= and drops anything unknown. */
export function parseCatalogFilters(params: Record<string, ParamValue> | URLSearchParams | null | undefined): CatalogFilters {
  const get = (key: string): string => {
    if (!params) return "";
    if (params instanceof URLSearchParams) return params.get(key) ?? "";
    return first(params[key]);
  };
  const topic = get("topic");
  const level = get("level");
  const duration = get("duration");
  const price = get("price");
  const sort = get("sort");
  return {
    q: get("q").trim().slice(0, 80),
    topic: topicKeys.has(topic) ? topic : null,
    level: levelKeys.has(level) ? level : null,
    duration: DURATION_BUCKETS.some((b) => b.key === duration) ? (duration as DurationBucket) : null,
    price: PRICE_FILTERS.some((p) => p.key === price) ? (price as PriceFilter) : null,
    sort: CATALOG_SORTS.some((s) => s.key === sort) ? (sort as CatalogSort) : "newest",
  };
}

/** Only non-default values make it into the URL, so a clean catalog has a clean address. */
export function filtersToSearchParams(f: CatalogFilters): URLSearchParams {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  if (f.topic) sp.set("topic", f.topic);
  if (f.level) sp.set("level", f.level);
  if (f.duration) sp.set("duration", f.duration);
  if (f.price) sp.set("price", f.price);
  if (f.sort !== "newest") sp.set("sort", f.sort);
  return sp;
}

export function activeFilterCount(f: CatalogFilters): number {
  return [f.q, f.topic, f.level, f.duration, f.price].filter(Boolean).length;
}

export function topicLabel(key: string): string {
  return site.topics.find((t) => t.key === key)?.label ?? key;
}

function matchesQuery(course: CourseCardData, q: string): boolean {
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const hay = [course.title, course.subtitle, course.short_description, course.level, ...course.topics.map(topicLabel)].join(" ").toLowerCase();
  return tokens.every((t) => hay.includes(t));
}

/** Pure filter + sort used on the server for the first paint and on the client for instant search. */
export function applyCatalogFilters(courses: CourseCardData[], f: CatalogFilters): CourseCardData[] {
  const bucket = f.duration ? DURATION_BUCKETS.find((b) => b.key === f.duration) : null;
  const out = courses.filter((c) => {
    if (!matchesQuery(c, f.q)) return false;
    if (f.topic && !c.topics.includes(f.topic)) return false;
    if (f.level && c.level !== f.level) return false;
    if (bucket && !(c.duration_sec >= bucket.min && c.duration_sec < bucket.max)) return false;
    if (f.price === "free" && !(c.price && c.price.cents === 0)) return false;
    if (f.price === "paid" && !(c.price && c.price.cents > 0)) return false;
    return true;
  });
  const byNewest = (a: CourseCardData, b: CourseCardData) => b.created_at.localeCompare(a.created_at);
  out.sort(f.sort === "popular" ? (a, b) => b.enrollment_count - a.enrollment_count || byNewest(a, b) : byNewest);
  return out;
}
