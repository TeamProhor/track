import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { monitors } from "./monitors";

export const snapshots = sqliteTable("snapshots", {
  id: text("id").primaryKey(),
  monitorId: text("monitor_id")
    .references(() => monitors.id)
    .notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  httpStatus: integer("http_status"),
  contentHash: text("content_hash"),
  extractedContent: text("extracted_content"),
  metadata: text("metadata", { mode: "json" }),
  crawlStrategy: text("crawl_strategy"),
  resultStatus: text("result_status", {
    enum: ["success", "error", "challenge"],
  }).notNull(),
});
