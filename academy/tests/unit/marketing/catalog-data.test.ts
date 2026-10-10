import { describe, expect, it } from "vitest";
import { applyCatalogFilters, filtersToSearchParams, parseCatalogFilters, DEFAULT_FILTERS, type CourseCardData } from "@/components/marketing/catalog-data";

const base: CourseCardData = {
  id: "1",
  slug: "baby-steps",
  title: "Baby Steps: Your Health Journey Toward Conception",
  subtitle: "A 12-week, science-backed, heart-led journey",
  short_description: "Empower your family wellness with Cynthia Myers Morrison.",
  illustration: "family",
  thumbnail_url: null,
  level: "All levels",
  language: "English",
  topics: ["nutrition", "cravings"],
  badge: "new",
  status: "published",
  publish_at: null,
  created_at: "2026-10-01T00:00:00.000Z",
  last_updated_at: "2026-10-01T00:00:00.000Z",
  duration_sec: 39660,
  lesson_count: 59,
  module_count: 7,
  resource_count: 54,
  price: { cents: 19700, original_cents: null, on_sale: false, sale_ends_at: null, currency: "USD" },
  enrollment_count: 3,
};
const free: CourseCardData = {
  ...base,
  id: "2",
  slug: "intro",
  title: "A short free intro to movement",
  subtitle: "Thirty minutes to get moving",
  short_description: "A gentle start.",
  topics: ["movement"],
  level: "Beginner",
  duration_sec: 1800,
  created_at: "2026-09-01T00:00:00.000Z",
  price: { cents: 0, original_cents: null, on_sale: false, sale_ends_at: null, currency: "USD" },
  enrollment_count: 10,
};

describe("parseCatalogFilters", () => {
  it("reads known values and drops unknown ones", () => {
    const f = parseCatalogFilters({ q: "  cravings ", topic: "nutrition", level: "Nope", duration: "long", price: "free", sort: "popular" });
    expect(f).toEqual({ q: "cravings", topic: "nutrition", level: null, duration: "long", price: "free", sort: "popular" });
  });
  it("accepts URLSearchParams and arrays", () => {
    expect(parseCatalogFilters(new URLSearchParams("topic=stress")).topic).toBe("stress");
    expect(parseCatalogFilters({ level: ["Beginner", "x"] }).level).toBe("Beginner");
    expect(parseCatalogFilters(undefined)).toEqual(DEFAULT_FILTERS);
  });
});

describe("filtersToSearchParams", () => {
  it("omits defaults so a clean catalog has a clean URL", () => {
    expect(filtersToSearchParams(DEFAULT_FILTERS).toString()).toBe("");
    expect(filtersToSearchParams({ ...DEFAULT_FILTERS, q: "gut", sort: "popular" }).toString()).toBe("q=gut&sort=popular");
  });
});

describe("applyCatalogFilters", () => {
  const all = [base, free];
  it("searches title, subtitle, description and topic labels (all tokens must match)", () => {
    expect(applyCatalogFilters(all, { ...DEFAULT_FILTERS, q: "cravings" }).map((c) => c.id)).toEqual(["1"]);
    expect(applyCatalogFilters(all, { ...DEFAULT_FILTERS, q: "movement" }).map((c) => c.id)).toEqual(["2"]);
    expect(applyCatalogFilters(all, { ...DEFAULT_FILTERS, q: "heart led" }).map((c) => c.id)).toEqual(["1"]);
    expect(applyCatalogFilters(all, { ...DEFAULT_FILTERS, q: "zzz" })).toEqual([]);
  });
  it("filters by topic, level, duration bucket and price", () => {
    expect(applyCatalogFilters(all, { ...DEFAULT_FILTERS, topic: "nutrition" }).map((c) => c.id)).toEqual(["1"]);
    expect(applyCatalogFilters(all, { ...DEFAULT_FILTERS, level: "Beginner" }).map((c) => c.id)).toEqual(["2"]);
    expect(applyCatalogFilters(all, { ...DEFAULT_FILTERS, duration: "long" }).map((c) => c.id)).toEqual(["1"]);
    expect(applyCatalogFilters(all, { ...DEFAULT_FILTERS, duration: "short" }).map((c) => c.id)).toEqual(["2"]);
    expect(applyCatalogFilters(all, { ...DEFAULT_FILTERS, price: "free" }).map((c) => c.id)).toEqual(["2"]);
    expect(applyCatalogFilters(all, { ...DEFAULT_FILTERS, price: "paid" }).map((c) => c.id)).toEqual(["1"]);
  });
  it("sorts newest first by default and by enrollments when popular", () => {
    expect(applyCatalogFilters(all, DEFAULT_FILTERS).map((c) => c.id)).toEqual(["1", "2"]);
    expect(applyCatalogFilters(all, { ...DEFAULT_FILTERS, sort: "popular" }).map((c) => c.id)).toEqual(["2", "1"]);
  });
});
