import { defineConfig } from "drizzle-kit";

const rawUrl = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || "file:local.db";
const url = rawUrl.replace(/^turso:/, "libsql:");

export default defineConfig({
  schema: "./src/lib/db/schema/*",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN,
  },
});
