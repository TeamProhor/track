import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const monitors = sqliteTable("monitors", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id")
    .references(() => users.id)
    .notNull(),
  url: text("url").notNull(),
  name: text("name").notNull(),
  status: text("status", { enum: ["active", "paused", "error"] })
    .default("active")
    .notNull(),
  schedule: text("schedule").notNull(), // cron expression
  fetchStrategy: text("fetch_strategy", { enum: ["http", "browser"] })
    .default("http")
    .notNull(),
  selectors: text("selectors", { mode: "json" }), // array of selectors
  normalizationSettings: text("normalization_settings", { mode: "json" }),
  timeout: integer("timeout").default(30000),
  retrySettings: text("retry_settings", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  lastCheckedAt: integer("last_checked_at", { mode: "timestamp" }),
  nextCheckAt: integer("next_check_at", { mode: "timestamp" }),
});
