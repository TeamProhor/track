import { db } from "../src/lib/db/client";
import { monitors } from "../src/lib/db/schema";
import { eq, lte, or, isNull } from "drizzle-orm";
import { monitorQueue } from "../src/lib/queue/connection";
import { logger } from "../src/lib/observability/logger";
import { CronExpressionParser } from "cron-parser";

export async function scheduleJobs() {
  const now = new Date();

  // Find monitors where nextCheckAt is in the past, or null (never checked)
  const dueMonitors = await db.query.monitors.findMany({
    where: (monitors) => 
      or(
        isNull(monitors.nextCheckAt),
        lte(monitors.nextCheckAt, now)
      )
  });

  for (const monitor of dueMonitors) {
    if (monitor.status !== "active") continue;

    // Add to BullMQ
    await monitorQueue.add("check", { monitorId: monitor.id });
    logger.info({ monitorId: monitor.id }, "Scheduled monitor job");

    // Calculate next check
    try {
      let cronStr = monitor.schedule;
      let interval;
      try {
        interval = CronExpressionParser.parse(cronStr);
      } catch {
        cronStr = "*/15 * * * *";
        interval = CronExpressionParser.parse(cronStr);
      }
      const nextDate = interval.next().toDate();

      await db
        .update(monitors)
        .set({ schedule: cronStr, nextCheckAt: nextDate, lastCheckedAt: now })
        .where(eq(monitors.id, monitor.id));
    } catch (err: any) {
      logger.error(
        { monitorId: monitor.id, error: err.message },
        "Failed to parse cron schedule",
      );
    }
  }
}

// Start polling every 60 seconds
export function startScheduler() {
  logger.info("Scheduler started");
  setInterval(scheduleJobs, 60000);
  // Run immediately on boot
  scheduleJobs();
}
