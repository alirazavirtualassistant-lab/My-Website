/**
 * Local migration validator.
 *
 *   npx tsx scripts/db-check.ts [--host 127.0.0.1] [--port 5433] [--user postgres]
 *                               [--password ''] [--db cyc_check] [--no-seed]
 *                               [--no-smoke] [--drop]
 *
 * Against a throwaway Postgres (NOT Supabase) it:
 *   1. drops + recreates the database (<db>, default cyc_check);
 *   2. applies supabase/local/shim.sql — stand-ins for the Supabase-only
 *      objects (auth.users, auth.uid(), storage.buckets/objects, the
 *      anon/authenticated/service_role roles);
 *   3. applies every supabase/migrations/*.sql in name order, unchanged;
 *   4. applies supabase/seed/seed.sql (badges + default settings);
 *   5. runs supabase/local/smoke.sql — profile trigger, RLS as learner /
 *      admin / assistant / anon, storage policies, constraints.
 *
 * Exit code 0 when everything passes. Needs the `psql` binary on PATH; the
 * env vars PGHOST / PGPORT / PGUSER / PGPASSWORD are honoured as defaults.
 * Nothing here needs a Node Postgres driver.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

interface Args {
  host: string;
  port: string;
  user: string;
  password: string;
  db: string;
  seed: boolean;
  smoke: boolean;
  drop: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    host: process.env.PGHOST ?? "127.0.0.1",
    port: process.env.PGPORT ?? "5433",
    user: process.env.PGUSER ?? "postgres",
    password: process.env.PGPASSWORD ?? "",
    db: "cyc_check",
    seed: true,
    smoke: true,
    drop: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      const v = argv[++i];
      if (v === undefined) throw new Error(`${a} needs a value`);
      return v;
    };
    if (a === "--host") args.host = next();
    else if (a === "--port") args.port = next();
    else if (a === "--user") args.user = next();
    else if (a === "--password") args.password = next();
    else if (a === "--db") args.db = next();
    else if (a === "--no-seed") args.seed = false;
    else if (a === "--no-smoke") args.smoke = false;
    else if (a === "--drop") args.drop = true;
    else if (a === "--help" || a === "-h") {
      console.log(
        "Usage: tsx scripts/db-check.ts [--host H] [--port P] [--user U] [--password PW] [--db NAME] [--no-seed] [--no-smoke] [--drop]",
      );
      process.exit(0);
    } else throw new Error(`Unknown argument ${a}`);
  }
  if (!/^[a-z_][a-z0-9_]*$/i.test(args.db)) throw new Error(`Unsafe database name: ${args.db}`);
  return args;
}

/** Resolve the academy root from the working directory (or its parent, when run from scripts/). */
function findRoot(): string {
  const candidates = [process.cwd(), path.resolve(process.cwd(), "..")];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "supabase", "migrations"))) return dir;
  }
  throw new Error("Run this from the academy/ directory (supabase/migrations not found).");
}

interface PsqlResult {
  ok: boolean;
  output: string;
}

function psql(args: Args, database: string, extra: string[]): PsqlResult {
  const res = spawnSync(
    "psql",
    ["-X", "-q", "-v", "ON_ERROR_STOP=1", "-h", args.host, "-p", args.port, "-U", args.user, "-d", database, ...extra],
    {
      encoding: "utf8",
      env: { ...process.env, PGPASSWORD: args.password, PGCONNECT_TIMEOUT: "5" },
    },
  );
  if (res.error) {
    return { ok: false, output: `${res.error.message}\n(is psql installed and on PATH?)` };
  }
  const output = [res.stdout, res.stderr].filter((s) => s && s.trim()).join("\n").trimEnd();
  return { ok: res.status === 0, output };
}

function step(label: string, result: PsqlResult): void {
  console.log(`\n== ${label}`);
  if (result.output) console.log(result.output);
  console.log(result.ok ? `-- ok: ${label}` : `-- FAILED: ${label}`);
  if (!result.ok) {
    console.error(`\ndb-check failed at "${label}".`);
    process.exit(1);
  }
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const root = findRoot();
  const migrationsDir = path.join(root, "supabase", "migrations");
  const migrations = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  if (migrations.length === 0) throw new Error(`No migrations in ${migrationsDir}`);

  console.log(`db-check: ${args.user}@${args.host}:${args.port} database "${args.db}"`);
  console.log(`migrations: ${migrations.join(", ")}`);

  step("connect", psql(args, "postgres", ["-c", "select version();"]));
  step(
    `recreate database ${args.db}`,
    psql(args, "postgres", [
      "-c",
      `drop database if exists ${args.db} with (force);`,
      "-c",
      `create database ${args.db};`,
    ]),
  );
  step("supabase/local/shim.sql", psql(args, args.db, ["-f", path.join(root, "supabase", "local", "shim.sql")]));
  for (const m of migrations) {
    step(`supabase/migrations/${m}`, psql(args, args.db, ["-f", path.join(migrationsDir, m)]));
  }
  // Applying twice proves every migration is idempotent (re-runnable).
  for (const m of migrations) {
    step(`re-apply supabase/migrations/${m} (idempotency)`, psql(args, args.db, ["-f", path.join(migrationsDir, m)]));
  }
  if (args.seed) {
    const seedFile = path.join(root, "supabase", "seed", "seed.sql");
    step("supabase/seed/seed.sql", psql(args, args.db, ["-f", seedFile]));
    step("re-apply supabase/seed/seed.sql (idempotency)", psql(args, args.db, ["-f", seedFile]));
  }

  step(
    "schema summary",
    psql(args, args.db, [
      "-P",
      "footer=off",
      "-c",
      "select count(*) as tables, count(*) filter (where rowsecurity) as rls_enabled from pg_tables where schemaname = 'public';",
      "-c",
      "select count(*) as policies from pg_policies where schemaname in ('public', 'storage');",
      "-c",
      "select string_agg(id, ', ' order by id) as buckets from storage.buckets;",
    ]),
  );

  if (args.smoke) {
    step("supabase/local/smoke.sql", psql(args, args.db, ["-f", path.join(root, "supabase", "local", "smoke.sql")]));
  }

  if (args.drop) {
    step(`drop database ${args.db}`, psql(args, "postgres", ["-c", `drop database if exists ${args.db} with (force);`]));
  }

  console.log("\ndb-check: ALL CHECKS PASSED");
}

try {
  main();
} catch (err) {
  console.error(`db-check: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}
