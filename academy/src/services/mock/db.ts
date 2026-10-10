/**
 * Mock DataStore: the generic Repo<T> contract over MockStore (store.ts).
 *
 * Every method returns deep copies, so callers can never mutate store state
 * by accident. Filters are equality-only (`where` values may be arrays = IN),
 * plus `orderBy`, `limit`, `offset` and a case-insensitive `search`.
 */
import type { TableName, Tables } from "@/lib/types";
import type { DataStore, ListOptions, Repo, Where } from "@/services/types";
import { MockStore, clone, getMockStore, resolveStorePath, type AnyRow } from "./store";

export interface MockDataStore extends DataStore {
  readonly kind: "mock";
  /** Absolute path of the JSON file backing this store. */
  readonly filePath: string;
  /** Force pending changes to disk (tests, graceful shutdown). */
  flush(): Promise<void>;
  reset(): Promise<void>;
}

// ---------------------------------------------------------------------------
// Filtering helpers
// ---------------------------------------------------------------------------

function valuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null || a === undefined || b === undefined) return false;
  if (typeof a === "object" && typeof b === "object") {
    // Rarely used (e.g. where on a JSON column); compare structurally.
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}

function matchesWhere<T>(row: AnyRow, where: Where<T> | undefined): boolean {
  if (!where) return true;
  for (const [key, expected] of Object.entries(where as Record<string, unknown>)) {
    if (expected === undefined) continue;
    const actual = row[key];
    if (Array.isArray(expected)) {
      if (!expected.some((v) => valuesEqual(actual, v))) return false;
    } else if (!valuesEqual(actual, expected)) {
      return false;
    }
  }
  return true;
}

function matchesSearch(row: AnyRow, search: { columns: string[]; query: string } | undefined): boolean {
  if (!search) return true;
  const q = search.query.trim().toLowerCase();
  if (q === "") return true;
  return search.columns.some((col) => {
    const v = row[col];
    if (v === null || v === undefined) return false;
    const s = typeof v === "string" ? v : typeof v === "number" || typeof v === "boolean" ? String(v) : null;
    return s !== null && s.toLowerCase().includes(q);
  });
}

function compareValues(a: unknown, b: unknown): number {
  // null/undefined sort last regardless of direction, like Postgres NULLS LAST for asc.
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  const sa = String(a);
  const sb = String(b);
  return sa < sb ? -1 : sa > sb ? 1 : 0;
}

// ---------------------------------------------------------------------------
// Repo
// ---------------------------------------------------------------------------

class MockRepo<K extends TableName, T extends Tables[K] & { id: string } = Tables[K] & { id: string }> implements Repo<T> {
  constructor(
    private readonly store: MockStore,
    private readonly table: K,
  ) {}

  private get rows(): Map<string, AnyRow> {
    return this.store.table(this.table);
  }

  private select(where?: Where<T>): AnyRow[] {
    const out: AnyRow[] = [];
    for (const row of this.rows.values()) {
      if (matchesWhere(row, where)) out.push(row);
    }
    return out;
  }

  async list(opts: ListOptions<T> = {}): Promise<T[]> {
    let rows = this.select(opts.where);
    if (opts.search) {
      rows = rows.filter((r) => matchesSearch(r, opts.search as { columns: string[]; query: string }));
    }
    if (opts.orderBy) {
      const [col, dir] = opts.orderBy;
      const sign = dir === "desc" ? -1 : 1;
      // Stable sort: ties keep insertion order.
      rows = rows
        .map((r, i) => ({ r, i }))
        .sort((x, y) => {
          const c = compareValues(x.r[col], y.r[col]);
          return c !== 0 ? c * sign : x.i - y.i;
        })
        .map((x) => x.r);
    }
    const offset = Math.max(0, opts.offset ?? 0);
    const end = opts.limit !== undefined ? offset + Math.max(0, opts.limit) : undefined;
    if (offset > 0 || end !== undefined) rows = rows.slice(offset, end);
    return rows.map((r) => clone(r) as unknown as T);
  }

  async count(where?: Where<T>): Promise<number> {
    return this.select(where).length;
  }

  async get(id: string): Promise<T | null> {
    const row = this.rows.get(id);
    return row ? (clone(row) as unknown as T) : null;
  }

  async findOne(where: Where<T>): Promise<T | null> {
    for (const row of this.rows.values()) {
      if (matchesWhere(row, where)) return clone(row) as unknown as T;
    }
    return null;
  }

  async insert(row: T): Promise<T> {
    this.assertInsertable(row);
    const stored = clone(row) as unknown as AnyRow;
    this.rows.set(row.id, stored);
    this.store.touch();
    return clone(row);
  }

  async insertMany(rows: T[]): Promise<T[]> {
    const seen = new Set<string>();
    for (const row of rows) {
      this.assertInsertable(row);
      if (seen.has(row.id)) throw new Error(`[mock-db] duplicate id "${row.id}" within insertMany on "${this.table}"`);
      seen.add(row.id);
    }
    for (const row of rows) this.rows.set(row.id, clone(row) as unknown as AnyRow);
    if (rows.length > 0) this.store.touch();
    return rows.map((r) => clone(r));
  }

  async update(id: string, patch: Partial<T>): Promise<T> {
    const existing = this.rows.get(id);
    if (!existing) throw new Error(`[mock-db] "${this.table}" row "${id}" not found`);
    const next = this.applyPatch(existing, patch);
    this.rows.set(id, next);
    this.store.touch();
    return clone(next) as unknown as T;
  }

  async updateWhere(where: Where<T>, patch: Partial<T>): Promise<number> {
    let n = 0;
    for (const [id, row] of this.rows) {
      if (!matchesWhere(row, where)) continue;
      this.rows.set(id, this.applyPatch(row, patch));
      n++;
    }
    if (n > 0) this.store.touch();
    return n;
  }

  async delete(id: string): Promise<void> {
    if (this.rows.delete(id)) this.store.touch();
  }

  async deleteWhere(where: Where<T>): Promise<number> {
    let n = 0;
    for (const [id, row] of this.rows) {
      if (matchesWhere(row, where)) {
        this.rows.delete(id);
        n++;
      }
    }
    if (n > 0) this.store.touch();
    return n;
  }

  async upsert(row: T): Promise<T> {
    if (typeof row?.id !== "string" || row.id === "") throw new Error(`[mock-db] upsert into "${this.table}" needs an id`);
    this.rows.set(row.id, clone(row) as unknown as AnyRow);
    this.store.touch();
    return clone(row);
  }

  private assertInsertable(row: T): void {
    if (!row || typeof row.id !== "string" || row.id === "") {
      throw new Error(`[mock-db] insert into "${this.table}" needs a string id`);
    }
    if (this.rows.has(row.id)) {
      throw new Error(`[mock-db] duplicate id "${row.id}" in "${this.table}"`);
    }
  }

  private applyPatch(existing: AnyRow, patch: Partial<T>): AnyRow {
    const next: AnyRow = { ...existing };
    for (const [key, value] of Object.entries(patch as Record<string, unknown>)) {
      if (key === "id" || value === undefined) continue;
      next[key] = clone(value);
    }
    return next;
  }
}

// ---------------------------------------------------------------------------
// DataStore
// ---------------------------------------------------------------------------

function buildDataStore(store: MockStore): MockDataStore {
  const repos = new Map<TableName, Repo<AnyRow>>();

  const db: MockDataStore = {
    kind: "mock",
    filePath: store.filePath,
    from<K extends TableName>(table: K): Repo<Tables[K]> {
      let repo = repos.get(table);
      if (!repo) {
        repo = new MockRepo(store, table) as unknown as Repo<AnyRow>;
        repos.set(table, repo);
      }
      return repo as unknown as Repo<Tables[K]>;
    },
    transaction<R>(fn: (tx: DataStore) => Promise<R>): Promise<R> {
      return store.runExclusive(() => fn(db));
    },
    flush: () => store.flush(),
    reset: () => store.reset(),
  };
  return db;
}

declare global {
  var __cycMockDb: Promise<MockDataStore> | undefined;
}

/**
 * Process-wide mock DataStore backed by <env.dataDir>/store.json. Cached on
 * globalThis so Next dev HMR reuses the same instance.
 */
export function createMockDb(): Promise<MockDataStore> {
  if (!globalThis.__cycMockDb) {
    globalThis.__cycMockDb = createMockDbInstance().catch((err) => {
      globalThis.__cycMockDb = undefined;
      throw err;
    });
  }
  return globalThis.__cycMockDb;
}

/**
 * A DataStore for an explicit data directory. Instances for the same path share
 * one in-memory MockStore (see getMockStore) unless `fresh` is true, which
 * reads the file again into a brand-new store (persistence tests).
 */
export async function createMockDbInstance(dataDir?: string, options: { fresh?: boolean } = {}): Promise<MockDataStore> {
  const filePath = resolveStorePath(dataDir);
  const store = options.fresh ? new MockStore(filePath) : getMockStore(filePath);
  await store.load();
  return buildDataStore(store);
}

/** Test helper: drop the cached singleton so the next createMockDb() rebuilds it. */
export function resetMockDbCache(): void {
  globalThis.__cycMockDb = undefined;
}
