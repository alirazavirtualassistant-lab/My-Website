/**
 * Tiny in-memory DataStore for adapter tests. Equality-only filters, same
 * contract as services/types.ts. Independent of the real mock store.
 */
import type { TableName, Tables } from "@/lib/types";
import type { DataStore, ListOptions, Repo, Where } from "@/services/types";

type AnyRow = { id: string } & Record<string, unknown>;

function clone<T>(v: T): T {
  return v === undefined ? v : (JSON.parse(JSON.stringify(v)) as T);
}

function matches<T>(row: AnyRow, where: Where<T> | undefined): boolean {
  if (!where) return true;
  for (const [key, expected] of Object.entries(where as Record<string, unknown>)) {
    if (expected === undefined) continue;
    const actual = row[key];
    if (Array.isArray(expected)) {
      if (!expected.some((v) => v === actual)) return false;
    } else if (actual !== expected) return false;
  }
  return true;
}

class FakeRepo<T extends { id: string }> implements Repo<T> {
  readonly rows = new Map<string, AnyRow>();

  async list(opts: ListOptions<T> = {}): Promise<T[]> {
    let out = Array.from(this.rows.values()).filter((r) => matches(r, opts.where));
    if (opts.search) {
      const q = opts.search.query.toLowerCase();
      out = out.filter((r) => opts.search!.columns.some((c) => String(r[c] ?? "").toLowerCase().includes(q)));
    }
    if (opts.orderBy) {
      const [col, dir] = opts.orderBy;
      out.sort((a, b) => {
        const x = String(a[col] ?? "");
        const y = String(b[col] ?? "");
        return dir === "asc" ? x.localeCompare(y) : y.localeCompare(x);
      });
    }
    if (opts.offset) out = out.slice(opts.offset);
    if (opts.limit !== undefined) out = out.slice(0, opts.limit);
    return clone(out) as T[];
  }

  async count(where?: Where<T>): Promise<number> {
    return (await this.list({ where })).length;
  }

  async get(id: string): Promise<T | null> {
    const row = this.rows.get(id);
    return row ? (clone(row) as T) : null;
  }

  async findOne(where: Where<T>): Promise<T | null> {
    return (await this.list({ where, limit: 1 }))[0] ?? null;
  }

  async insert(row: T): Promise<T> {
    if (this.rows.has(row.id)) throw new Error(`duplicate id ${row.id}`);
    this.rows.set(row.id, clone(row) as AnyRow);
    return clone(row);
  }

  async insertMany(rows: T[]): Promise<T[]> {
    for (const r of rows) await this.insert(r);
    return clone(rows);
  }

  async update(id: string, patch: Partial<T>): Promise<T> {
    const row = this.rows.get(id);
    if (!row) throw new Error(`no row ${id}`);
    const next = { ...row, ...clone(patch), id } as AnyRow;
    this.rows.set(id, next);
    return clone(next) as T;
  }

  async updateWhere(where: Where<T>, patch: Partial<T>): Promise<number> {
    const hits = await this.list({ where });
    for (const h of hits) await this.update(h.id, patch);
    return hits.length;
  }

  async delete(id: string): Promise<void> {
    this.rows.delete(id);
  }

  async deleteWhere(where: Where<T>): Promise<number> {
    const hits = await this.list({ where });
    for (const h of hits) this.rows.delete(h.id);
    return hits.length;
  }

  async upsert(row: T): Promise<T> {
    this.rows.set(row.id, clone(row) as AnyRow);
    return clone(row);
  }
}

export interface FakeDb extends DataStore {
  readonly kind: "mock";
  tables: Map<TableName, FakeRepo<AnyRow>>;
}

export function createFakeDb(): FakeDb {
  const tables = new Map<TableName, FakeRepo<AnyRow>>();
  const db: FakeDb = {
    kind: "mock",
    tables,
    from<K extends TableName>(table: K): Repo<Tables[K]> {
      let repo = tables.get(table);
      if (!repo) {
        repo = new FakeRepo<AnyRow>();
        tables.set(table, repo);
      }
      return repo as unknown as Repo<Tables[K]>;
    },
    async transaction<R>(fn: (db: DataStore) => Promise<R>): Promise<R> {
      return fn(db);
    },
    async reset() {
      tables.clear();
    },
  };
  return db;
}
