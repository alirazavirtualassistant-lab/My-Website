/**
 * Schema ↔ TypeScript contract tests for supabase/migrations.
 *
 * Static checks (always run): every key of the `Tables` map in
 * src/lib/types.ts has a `create table` in 0001 with every column of its row
 * type, RLS enabled in 0002, and the four storage buckets exist in 0003.
 *
 * Live check (only when a local Postgres answers): runs scripts/db-check.ts,
 * which applies the migrations to a throwaway database and executes the RLS
 * smoke test. Defaults to 127.0.0.1:5433 / postgres; override with
 * PGHOST / PGPORT / PGUSER / PGPASSWORD. Skipped when psql cannot connect.
 */
import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "../../..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");

const types = read("src/lib/types.ts");
const schemaSql = read("supabase/migrations/0001_schema.sql");
const rlsSql = read("supabase/migrations/0002_rls.sql");
const storageSql = read("supabase/migrations/0003_storage.sql");

/** `tableName → interfaceName` from `export interface Tables { … }`. */
function tablesMap(): Array<[string, string]> {
  const block = types.match(/export interface Tables \{([\s\S]*?)\n\}/);
  if (!block) throw new Error("Tables map not found in src/lib/types.ts");
  return [...block[1].matchAll(/^\s*(\w+):\s*(\w+);/gm)].map((m) => [m[1], m[2]]);
}

/** Property names of `export interface <name> { … }` (top-level only). */
function interfaceColumns(name: string): string[] {
  const start = types.indexOf(`export interface ${name} {`);
  if (start < 0) throw new Error(`interface ${name} not found`);
  let depth = 0;
  let i = types.indexOf("{", start);
  const open = i;
  for (; i < types.length; i++) {
    if (types[i] === "{") depth++;
    else if (types[i] === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  const body = types.slice(open + 1, i);
  const cols: string[] = [];
  let level = 0;
  for (const rawLine of body.split("\n")) {
    const line = rawLine.trim();
    if (level === 0) {
      const m = line.match(/^(\w+)\??:/);
      if (m) cols.push(m[1]);
    }
    for (const ch of line) {
      if (ch === "{") level++;
      else if (ch === "}") level--;
    }
  }
  return cols;
}

/** The column names declared inside `create table if not exists public.<table> ( … );`. */
function sqlColumns(table: string): string[] {
  const re = new RegExp(`create table if not exists public\\.${table} \\(([\\s\\S]*?)\\n\\);`);
  const m = schemaSql.match(re);
  if (!m) return [];
  return m[1]
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("--") && !l.startsWith("constraint"))
    .map((l) => l.match(/^"?(\w+)"?\s/)?.[1])
    .filter((c): c is string => Boolean(c));
}

describe("supabase migrations ↔ src/lib/types.ts", () => {
  const map = tablesMap();

  it("lists every table of the Tables map (39)", () => {
    expect(map.length).toBe(39);
  });

  it.each(map)("table %s has every column of %s in 0001_schema.sql", (table, iface) => {
    const expected = interfaceColumns(iface);
    const actual = sqlColumns(table);
    expect(actual.length, `create table public.${table} not found`).toBeGreaterThan(0);
    expect(actual.sort()).toEqual(expected.sort());
  });

  it.each(map.map(([t]) => t))("table %s has RLS enabled in 0002_rls.sql", (table) => {
    expect(rlsSql).toMatch(new RegExp(`'${table}'`));
  });

  it("creates the four storage buckets named like the Bucket type", () => {
    for (const bucket of ["course-resources", "learner-uploads", "public-assets", "video-uploads"]) {
      expect(storageSql).toContain(`('${bucket}', '${bucket}',`);
    }
  });

  it("keeps the privacy rule: no admin policy on notes or quiz_responses", () => {
    expect(rlsSql).not.toMatch(/"notes: admin/);
    expect(rlsSql).not.toMatch(/"quiz_responses: admin/);
    expect(rlsSql).toContain("create or replace view public.quiz_completion_status");
    expect(rlsSql).toContain("create or replace view public.certificate_public");
  });

  it("badge keys in seed.sql match scripts/seed.ts", async () => {
    const seedSql = read("supabase/seed/seed.sql");
    const { BADGES } = await import("../../../scripts/seed");
    for (const b of BADGES) {
      expect(seedSql).toContain(`('${b.key}', '${b.title}'`);
    }
    expect(BADGES.map((b) => b.key)).toEqual([
      "module:M1", "module:M2", "module:M3", "module:M4", "module:M5", "module:M6", "module:M7",
      "goal:minimum", "goal:target", "goal:stretch", "streak:7", "streak:30",
    ]);
  });
});

function localPostgresAvailable(): boolean {
  const res = spawnSync(
    "psql",
    ["-X", "-h", process.env.PGHOST ?? "127.0.0.1", "-p", process.env.PGPORT ?? "5433", "-U", process.env.PGUSER ?? "postgres", "-d", "postgres", "-Atc", "select 1"],
    { encoding: "utf8", env: { ...process.env, PGCONNECT_TIMEOUT: "3", PGPASSWORD: process.env.PGPASSWORD ?? "" } },
  );
  return !res.error && res.status === 0 && res.stdout.trim() === "1";
}

describe("local Postgres validation", () => {
  const available = localPostgresAvailable();
  it.skipIf(!available)(
    "applies the migrations and passes the RLS smoke test (scripts/db-check.ts)",
    () => {
      const res = spawnSync("npx", ["tsx", "scripts/db-check.ts", "--db", "cyc_check_vitest", "--drop"], {
        cwd: ROOT,
        encoding: "utf8",
        env: process.env,
      });
      const out = `${res.stdout}\n${res.stderr}`;
      expect(out, out).toContain("SMOKE TEST PASSED");
      expect(res.status, out).toBe(0);
    },
    120_000,
  );
});
