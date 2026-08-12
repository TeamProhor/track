import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { monitors } from "./monitors";

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  monitorId: text("monitor_id")
    .references(() => monitors.id)
    .notNull(),
  channel: text("channel", { enum: ["email", "webhook"] }).notNull(),
  target: text("target").notNull(), // email address or webhook URL
  status: text("status", { enum: ["pending", "sent", "failed"] })
    .default("pending")
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  sentAt: integer("sent_at", { mode: "timestamp" }),
  errorLog: text("error_log"),
});
