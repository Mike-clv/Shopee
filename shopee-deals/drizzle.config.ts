import type { Config } from "drizzle-kit";
import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL ?? "";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: url ? { url } : { url: "" },
  strict: true,
  verbose: true,
}) satisfies Config;
