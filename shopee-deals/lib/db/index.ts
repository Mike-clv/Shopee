import {
  drizzle as drizzlePostgres,
  type PostgresJsDatabase,
} from "drizzle-orm/postgres-js";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePostgres } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Canonical type is the postgres-js variant; the PGlite instance is cast to
 * it at creation because both share the same Drizzle builder surface. A
 * single type keeps overload resolution working across select/insert chains.
 */
export type Database = PostgresJsDatabase<typeof schema>;

type DbBundle = {
  db: Database;
  migrate: () => Promise<void>;
  dispose: () => Promise<void>;
};

/**
 * Next.js can instantiate this module separately for each route/server bundle.
 * Keeping the handle on globalThis guarantees one PGlite/Postgres client per
 * Node process, so admin writes and public reads see the same database.
 */
const globalForDb = globalThis as typeof globalThis & {
  __sansaleDbBundle?: Promise<DbBundle>;
};

async function migratePglite(db: Database): Promise<void> {
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  await migrate(db as never, { migrationsFolder: "./drizzle" });
}

/** Backoff schedule between concurrent-migration retries (ms). */
const MIGRATION_RETRY_DELAYS_MS = [0, 1_500, 3_000, 5_000, 8_000, 12_000];

/**
 * Detects the failure mode of two processes racing through the same DDL
 * migration: duplicate-key on pg_type (23505), "relation already exists"
 * (42P07), or duplicate object (42710).
 */
function isMigrationRaceError(error: unknown): boolean {
  const code = (error as { code?: string }).code;
  if (code === "23505" || code === "42P07" || code === "42710") return true;
  return /already exists/i.test(
    String((error as { message?: string }).message ?? error),
  );
}

/**
 * Multiple processes run migrations concurrently (Next.js prerender workers
 * during `next build`, parallel serverless cold starts). Postgres serializes
 * DDL internally but the loser still fails with a unique-object violation.
 * The winner records the migration in __drizzle_migrations, so a retry just
 * skips the already-applied statements.
 */
async function migratePostgresOnce(db: Database): Promise<void> {
  let lastError: unknown;
  for (const delayMs of MIGRATION_RETRY_DELAYS_MS) {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    try {
      await migratePostgres(db as never, { migrationsFolder: "./drizzle" });
      return;
    } catch (error) {
      if (!isMigrationRaceError(error)) throw error;
      lastError = error;
    }
  }
  throw lastError;
}

async function createBundle(): Promise<DbBundle> {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    // Production / hosted Postgres (Neon, Supabase, RDS, local Postgres...).
    const client = postgres(databaseUrl, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    const db = drizzlePostgres(client, { schema });
    // Vercel runtime functions do not bundle the ./drizzle SQL folder, so
    // migrations cannot run there ("Can't find meta/_journal.json"). They are
    // applied by the build workers instead (same checkout, folder present),
    // so runtime skips them. Local dev keeps zero-config auto-migration.
    const isVercelRuntime =
      Boolean(process.env.VERCEL) &&
      process.env.NEXT_PHASE !== "phase-production-build";
    return {
      db,
      migrate: isVercelRuntime ? async () => {} : () => migratePostgresOnce(db),
      dispose: () => client.end({ timeout: 5 }),
    };
  }

  // Zero-config local database (stores data in ./.db-pglite/).
  const { PGlite } = await import("@electric-sql/pglite");
  const dataDir = process.env.PGLITE_DATA_DIR ?? ".db-pglite";
  const client = new PGlite(dataDir);
  const db = drizzlePglite(client, { schema }) as unknown as Database;
  return {
    db,
    migrate: () => migratePglite(db),
    dispose: () => client.close(),
  };
}

/**
 * Returns the shared database handle, running pending migrations exactly once.
 * Cached queries should call this before their first read.
 */
export function getDatabase(): Promise<Database> {
  if (!globalForDb.__sansaleDbBundle) {
    globalForDb.__sansaleDbBundle = createBundle()
      .then(async (bundle) => {
        await bundle.migrate();
        return bundle;
      })
      .catch((error) => {
        globalForDb.__sansaleDbBundle = undefined;
        throw error;
      });
  }
  return globalForDb.__sansaleDbBundle.then((b) => b.db);
}
