/**
 * In-memory table store for demo mode, persisted to <dataDir>/store.json.
 *
 * - One Map per table in `Tables` (src/lib/types.ts), keyed by row id.
 * - Loaded from disk once; writes are debounced (~250ms) and atomic
 *   (temp file + rename). If the filesystem is read-only (serverless), we log
 *   once and keep working purely in memory.
 * - `transaction()` runs under an in-process async mutex. Re-entrant calls
 *   (a transaction opened while already inside one) run inline so use cases
 *   can compose without deadlocking.
 *
 * This module has no Next.js or React imports so scripts/*.ts can use it.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import type { TableName, Tables } from "@/lib/types";
import { env } from "@/lib/env";

export const STORE_FILE_NAME = "store.json";
export const STORE_SCHEMA_VERSION = 1;
const SAVE_DEBOUNCE_MS = 250;

/** Every table name, in a stable order. Used to initialise and serialise. */
export const TABLE_NAMES: readonly TableName[] = [
  "profiles",
  "auth_users",
  "auth_tokens",
  "courses",
  "modules",
  "lessons",
  "lesson_resources",
  "action_steps",
  "products",
  "coupons",
  "orders",
  "checkout_sessions",
  "subscriptions",
  "enrollments",
  "partner_links",
  "gifts",
  "lesson_progress",
  "action_step_completions",
  "xp_ledger",
  "badges",
  "user_badges",
  "streaks",
  "quiz_definitions",
  "quiz_responses",
  "notes",
  "forum_categories",
  "forum_posts",
  "forum_replies",
  "forum_likes",
  "forum_reports",
  "certificates",
  "testimonials",
  "email_events",
  "broadcasts",
  "audit_log",
  "site_settings",
  "newsletter_signups",
  "contact_messages",
  "webhook_events",
];

type AnyRow = { id: string } & Record<string, unknown>;
type TableMap = Map<string, AnyRow>;

interface StoreFile {
  version: number;
  saved_at: string;
  tables: Partial<Record<TableName, AnyRow[]>>;
}

/** Deep copy for plain JSON-ish data so callers can never mutate store state. */
export function clone<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  return structuredClone(value);
}

function isReadOnlyError(err: unknown): boolean {
  const code = (err as NodeJS.ErrnoException | undefined)?.code;
  return code === "EROFS" || code === "EACCES" || code === "EPERM" || code === "ENOTSUP";
}

/** Resolve the store file path for a data directory (relative to cwd). */
export function resolveStorePath(dataDir: string = env.dataDir): string {
  return path.resolve(process.cwd(), dataDir, STORE_FILE_NAME);
}

export class MockStore {
  readonly filePath: string;
  private readonly tables = new Map<TableName, TableMap>();
  private loaded = false;
  private loading: Promise<void> | null = null;
  private dirty = false;
  private saveTimer: NodeJS.Timeout | null = null;
  private saving: Promise<void> | null = null;
  private readOnly = false;
  private warnedReadOnly = false;
  /** Promise chain used as the transaction mutex. */
  private chain: Promise<unknown> = Promise.resolve();
  private readonly txContext = new AsyncLocalStorage<true>();

  constructor(filePath: string) {
    this.filePath = filePath;
    for (const name of TABLE_NAMES) this.tables.set(name, new Map());
  }

  // ---------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------

  /** Loads the JSON file once. Missing or unreadable file = empty store. */
  async load(): Promise<void> {
    if (this.loaded) return;
    if (!this.loading) {
      this.loading = this.loadFromDisk().finally(() => {
        this.loaded = true;
        this.loading = null;
      });
    }
    await this.loading;
  }

  private async loadFromDisk(): Promise<void> {
    let raw: string;
    try {
      raw = await fs.readFile(this.filePath, "utf8");
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
        console.warn(`[mock-store] could not read ${this.filePath}: ${(err as Error).message}. Starting empty.`);
      }
      return;
    }
    try {
      const parsed = JSON.parse(raw) as StoreFile;
      if (!parsed || typeof parsed !== "object" || typeof parsed.tables !== "object") {
        throw new Error("unexpected shape");
      }
      for (const [name, rows] of Object.entries(parsed.tables)) {
        if (!Array.isArray(rows)) continue;
        const map = this.table(name as TableName);
        for (const row of rows) {
          if (row && typeof row === "object" && typeof row.id === "string") map.set(row.id, row);
        }
      }
    } catch (err) {
      console.warn(`[mock-store] ${this.filePath} is not valid JSON (${(err as Error).message}). Starting empty.`);
    }
  }

  /** True once the file has been read (or found missing). */
  get isLoaded(): boolean {
    return this.loaded;
  }

  /** Whether disk writes have been disabled because the FS is read-only. */
  get isReadOnly(): boolean {
    return this.readOnly;
  }

  // ---------------------------------------------------------------------
  // Table access (synchronous; callers deep-copy as needed)
  // ---------------------------------------------------------------------

  /** Table map by name; tables added to `Tables` later are created on demand. */
  table(name: TableName): TableMap {
    let map = this.tables.get(name);
    if (!map) {
      if (typeof name !== "string" || !name) throw new Error(`[mock-store] invalid table name "${String(name)}"`);
      map = new Map();
      this.tables.set(name, map);
    }
    return map;
  }

  /** Mark the store dirty and schedule a debounced save. */
  touch(): void {
    this.dirty = true;
    if (this.readOnly) return;
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      void this.flush();
    }, SAVE_DEBOUNCE_MS);
    // Never keep the process alive just to persist a demo store.
    this.saveTimer.unref?.();
  }

  /** Writes pending changes now (awaits an in-flight save first). */
  async flush(): Promise<void> {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    if (this.saving) {
      await this.saving;
    }
    if (!this.dirty || this.readOnly) return;
    this.saving = this.writeToDisk().finally(() => {
      this.saving = null;
    });
    await this.saving;
    // Changes made while we were writing trigger another pass.
    if (this.dirty && !this.readOnly) await this.flush();
  }

  private async writeToDisk(): Promise<void> {
    this.dirty = false;
    const snapshot = this.serialize();
    const dir = path.dirname(this.filePath);
    const tmp = path.join(dir, `.${STORE_FILE_NAME}.${process.pid}.${Date.now()}.tmp`);
    try {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(tmp, snapshot, "utf8");
      await fs.rename(tmp, this.filePath);
    } catch (err) {
      await fs.unlink(tmp).catch(() => undefined);
      if (isReadOnlyError(err)) {
        this.readOnly = true;
        if (!this.warnedReadOnly) {
          this.warnedReadOnly = true;
          console.warn(
            `[mock-store] filesystem is read-only (${(err as NodeJS.ErrnoException).code}); keeping data in memory only. Set DEMO_DATA_DIR to a writable directory to persist.`,
          );
        }
        return;
      }
      // Transient error: keep dirty so the next touch retries.
      this.dirty = true;
      console.warn(`[mock-store] could not save ${this.filePath}: ${(err as Error).message}`);
    }
  }

  private serialize(): string {
    const tables: StoreFile["tables"] = {};
    const names = [...TABLE_NAMES, ...Array.from(this.tables.keys()).filter((n) => !TABLE_NAMES.includes(n))];
    for (const name of names) {
      tables[name] = Array.from(this.table(name).values());
    }
    const file: StoreFile = { version: STORE_SCHEMA_VERSION, saved_at: new Date().toISOString(), tables };
    return JSON.stringify(file, null, 2);
  }

  /** Clears every table and deletes the file on disk. */
  async reset(): Promise<void> {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    if (this.saving) await this.saving.catch(() => undefined);
    for (const map of this.tables.values()) map.clear();
    this.dirty = false;
    await fs.unlink(this.filePath).catch((err: NodeJS.ErrnoException) => {
      if (err.code !== "ENOENT") console.warn(`[mock-store] could not delete ${this.filePath}: ${err.message}`);
    });
  }

  // ---------------------------------------------------------------------
  // Mutex
  // ---------------------------------------------------------------------

  /** True while running inside `runExclusive` on the current async context. */
  get inTransaction(): boolean {
    return this.txContext.getStore() === true;
  }

  /**
   * Serialises `fn` behind every other exclusive section. Nested calls (fn
   * itself calling runExclusive) run inline rather than deadlocking.
   */
  runExclusive<R>(fn: () => Promise<R>): Promise<R> {
    if (this.inTransaction) return fn();
    const run = () => this.txContext.run(true, fn);
    const result = this.chain.then(run, run);
    // Keep the chain alive regardless of fn's outcome.
    this.chain = result.catch(() => undefined);
    return result;
  }
}

declare global {
  var __cycMockStores: Map<string, MockStore> | undefined;
}

/**
 * Returns the process-wide store for a file path. Cached on globalThis so
 * Next.js dev HMR (which re-evaluates modules) does not create duplicates
 * that would fight over the same file.
 */
export function getMockStore(filePath: string = resolveStorePath()): MockStore {
  if (!globalThis.__cycMockStores) globalThis.__cycMockStores = new Map();
  let store = globalThis.__cycMockStores.get(filePath);
  if (!store) {
    store = new MockStore(filePath);
    globalThis.__cycMockStores.set(filePath, store);
  }
  return store;
}

/** Test helper: forget the cached store for a path (does not touch disk). */
export function forgetMockStore(filePath: string): void {
  globalThis.__cycMockStores?.delete(filePath);
}

export type { AnyRow, TableMap };
export type TypedRow<K extends TableName> = Tables[K];
