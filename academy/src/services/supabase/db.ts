/**
 * Supabase DataStore: the generic Repo<T> contract over PostgREST using the
 * service-role client.
 *
 * Schema assumptions (see supabase/migrations):
 * - One table per key of `Tables` (src/lib/types.ts), same name, columns
 *   named exactly like the row type (snake_case). JSON columns are jsonb.
 * - Every table has a text/uuid primary key `id` (profiles.id = auth.users.id).
 * - Row-level security protects direct client access; the app server uses the
 *   service role and relies on the use-case layer's own authorisation checks.
 *
 * Limitations:
 * - `transaction()` just runs `fn` with this store (no SQL transaction over
 *   PostgREST). Use cases should keep multi-row writes idempotent.
 * - `search` builds an `or=(col.ilike.*q*,…)` filter; `%`/`_` are escaped.
 * - `list()` without a limit returns at most PostgREST's max-rows (1000 by
 *   default); pass `limit`/`offset` to page.
 */
import type { TableName, Tables } from "@/lib/types";
import type { DataStore, ListOptions, Repo, Where } from "@/services/types";
import { createAdminSupabase, type AdminSupabase } from "./client";

type AnyRow = { id: string } & Record<string, unknown>;

/** Upper bound used when only an offset is given. */
const RANGE_FALLBACK = 1000;

function fail(table: string, op: string, error: { message: string; code?: string; details?: string | null }): never {
  const details = error.details ? ` (${error.details})` : "";
  const code = error.code ? ` [${error.code}]` : "";
  throw new Error(`[supabase:${table}] ${op} failed${code}: ${error.message}${details}`);
}

/**
 * Escapes a user query for use inside a quoted PostgREST `ilike` pattern.
 * LIKE-level: `\` `%` `_` get a backslash; PostgREST-level: the value is
 * double-quoted with `"` and `\` escaped again.
 */
export function ilikePattern(query: string): string {
  const likeEscaped = query.replace(/[\\%_]/g, (c) => `\\${c}`);
  const quoted = likeEscaped.replace(/[\\"]/g, (c) => `\\${c}`);
  return `"%${quoted}%"`;
}

// PostgREST's builder types are deeply generic (TS2589 when wrapped). We talk
// to it through a small structural view instead; the runtime object is the
// real builder, so nothing changes behaviourally.
interface QueryError {
  message: string;
  code?: string;
  details?: string | null;
}
interface QueryResult<T> {
  data: T | null;
  error: QueryError | null;
  count?: number | null;
}
interface FilterChain extends PromiseLike<QueryResult<AnyRow[]>> {
  eq(column: string, value: unknown): FilterChain;
  in(column: string, values: readonly unknown[]): FilterChain;
  is(column: string, value: null): FilterChain;
  not(column: string, operator: string, value: unknown): FilterChain;
  or(filters: string): FilterChain;
  order(column: string, options: { ascending: boolean; nullsFirst?: boolean }): FilterChain;
  range(from: number, to: number): FilterChain;
  limit(count: number): FilterChain;
  select(columns?: string): FilterChain;
  single(): PromiseLike<QueryResult<AnyRow>>;
  maybeSingle(): PromiseLike<QueryResult<AnyRow>>;
}
interface QueryBuilder {
  select(columns?: string, options?: { count?: "exact"; head?: boolean }): FilterChain;
  insert(values: AnyRow | AnyRow[]): FilterChain;
  update(values: Partial<AnyRow>): FilterChain;
  delete(): FilterChain;
  upsert(values: AnyRow, options?: { onConflict?: string }): FilterChain;
}

function applyWhere(chain: FilterChain, where: Where<AnyRow> | undefined): FilterChain {
  let q = chain;
  if (!where) return q;
  for (const [column, value] of Object.entries(where as Record<string, unknown>)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      const nonNull = value.filter((v) => v !== null);
      if (nonNull.length === 0) {
        // IN () matches nothing.
        q = q.in(column, ["__cyc_no_match__"]);
      } else if (nonNull.length === value.length) {
        q = q.in(column, nonNull);
      } else {
        q = q.or(`${column}.is.null,${column}.in.(${nonNull.map((v) => JSON.stringify(String(v))).join(",")})`);
      }
    } else if (value === null) {
      q = q.is(column, null);
    } else {
      q = q.eq(column, value);
    }
  }
  return q;
}

/** PostgREST refuses unfiltered UPDATE/DELETE; this filter matches every row. */
function ensureFilter(chain: FilterChain, where: Where<AnyRow> | undefined): FilterChain {
  const hasFilter = where && Object.values(where as Record<string, unknown>).some((v) => v !== undefined);
  return hasFilter ? chain : chain.not("id", "is", null);
}

class SupabaseRepo<T extends AnyRow> implements Repo<T> {
  constructor(
    private readonly client: () => AdminSupabase,
    private readonly table: TableName,
  ) {}

  private from(): QueryBuilder {
    return this.client().from(this.table) as unknown as QueryBuilder;
  }

  async list(opts: ListOptions<T> = {}): Promise<T[]> {
    let q = applyWhere(this.from().select("*"), opts.where as Where<AnyRow> | undefined);
    if (opts.search && opts.search.query.trim() !== "" && opts.search.columns.length > 0) {
      const pattern = ilikePattern(opts.search.query.trim());
      q = q.or(opts.search.columns.map((c) => `${c}.ilike.${pattern}`).join(","));
    }
    if (opts.orderBy) {
      const [column, dir] = opts.orderBy;
      q = q.order(column, { ascending: dir !== "desc", nullsFirst: false });
    }
    const offset = Math.max(0, opts.offset ?? 0);
    if (opts.limit !== undefined) {
      q = q.range(offset, offset + Math.max(0, opts.limit) - 1);
    } else if (offset > 0) {
      q = q.range(offset, offset + RANGE_FALLBACK - 1);
    }
    const { data, error } = await q;
    if (error) fail(this.table, "list", error);
    return (data ?? []) as T[];
  }

  async count(where?: Where<T>): Promise<number> {
    const q = applyWhere(this.from().select("id", { count: "exact", head: true }), where as Where<AnyRow> | undefined);
    const { count, error } = await q;
    if (error) fail(this.table, "count", error);
    return count ?? 0;
  }

  async get(id: string): Promise<T | null> {
    const { data, error } = await this.from().select("*").eq("id", id).maybeSingle();
    if (error) fail(this.table, "get", error);
    return (data as T | null) ?? null;
  }

  async findOne(where: Where<T>): Promise<T | null> {
    const q = applyWhere(this.from().select("*"), where as Where<AnyRow>).limit(1).maybeSingle();
    const { data, error } = await q;
    if (error) fail(this.table, "findOne", error);
    return (data as T | null) ?? null;
  }

  async insert(row: T): Promise<T> {
    const { data, error } = await this.from().insert(row).select("*").single();
    if (error) fail(this.table, "insert", error);
    return data as T;
  }

  async insertMany(rows: T[]): Promise<T[]> {
    if (rows.length === 0) return [];
    const { data, error } = await this.from().insert(rows).select("*");
    if (error) fail(this.table, "insertMany", error);
    return (data ?? []) as T[];
  }

  async update(id: string, patch: Partial<T>): Promise<T> {
    const { id: _ignored, ...rest } = patch as Partial<AnyRow>;
    void _ignored;
    const { data, error } = await this.from().update(rest).eq("id", id).select("*").maybeSingle();
    if (error) fail(this.table, "update", error);
    if (!data) throw new Error(`[supabase:${this.table}] update failed: row "${id}" not found`);
    return data as T;
  }

  async updateWhere(where: Where<T>, patch: Partial<T>): Promise<number> {
    const { id: _ignored, ...rest } = patch as Partial<AnyRow>;
    void _ignored;
    const base = ensureFilter(applyWhere(this.from().update(rest), where as Where<AnyRow>), where as Where<AnyRow>);
    const { data, error } = await base.select("id");
    if (error) fail(this.table, "updateWhere", error);
    return data?.length ?? 0;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.from().delete().eq("id", id);
    if (error) fail(this.table, "delete", error);
  }

  async deleteWhere(where: Where<T>): Promise<number> {
    const base = ensureFilter(applyWhere(this.from().delete(), where as Where<AnyRow>), where as Where<AnyRow>);
    const { data, error } = await base.select("id");
    if (error) fail(this.table, "deleteWhere", error);
    return data?.length ?? 0;
  }

  async upsert(row: T): Promise<T> {
    const { data, error } = await this.from().upsert(row, { onConflict: "id" }).select("*").single();
    if (error) fail(this.table, "upsert", error);
    return data as T;
  }
}

declare global {
  var __cycSupabaseDb: DataStore | undefined;
}

/**
 * Supabase-backed DataStore. The admin client is created on first query, so
 * this resolves even when env values are missing (they fail at query time with
 * a clear message).
 */
export async function createSupabaseDb(): Promise<DataStore> {
  if (globalThis.__cycSupabaseDb) return globalThis.__cycSupabaseDb;
  const repos = new Map<TableName, Repo<AnyRow>>();
  const db: DataStore = {
    kind: "supabase",
    from<K extends TableName>(table: K): Repo<Tables[K]> {
      let repo = repos.get(table);
      if (!repo) {
        repo = new SupabaseRepo<AnyRow>(createAdminSupabase, table);
        repos.set(table, repo);
      }
      return repo as unknown as Repo<Tables[K]>;
    },
    // No SQL transaction over PostgREST: runs fn with the same store.
    transaction<R>(fn: (tx: DataStore) => Promise<R>): Promise<R> {
      return fn(db);
    },
  };
  globalThis.__cycSupabaseDb = db;
  return db;
}
