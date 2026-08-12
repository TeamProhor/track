import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { monitors } from "./monitors";
import { snapshots } from "./snapshots";

export const changes = sqliteTable("changes", {
  id: text("id").primaryKey(),
  monitorId: text("monitor_id")
    .references(() => monitors.id)
    .notNull(),
  previousSnapshotId: text("previous_snapshot_id").references(
    () => snapshots.id,
  ),
  newSnapshotId: text("new_snapshot_id")
    .references(() => snapshots.id)
    .notNull(),
  detectedAt: integer("detected_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  changeType: text("change_type", {
    enum: ["added", "removed", "modified", "structural", "textual"],
  }).notNull(),
  summary: text("summary"),
  diffData: text("diff_data", { mode: "json" }),
});
