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

let bundlePromise: Promise<DbBundle> | null = null;

async function migratePglite(db: Database): Promise<void> {
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  await migrate(db as never, { migrationsFolder: "./drizzle" });
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
    return {
      db,
      migrate: () => migratePostgres(db as never, { migrationsFolder: "./drizzle" }),
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
  if (!bundlePromise) {
    bundlePromise = createBundle()
      .then(async (bundle) => {
        await bundle.migrate();
        return bundle;
      })
      .catch((error) => {
        bundlePromise = null;
        throw error;
      });
  }
  return bundlePromise.then((b) => b.db);
}
