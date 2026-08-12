import { monitorQueue } from "../../src/lib/queue/connection";
import { fetchHttp } from "../../src/lib/crawler/fetchers/http";
import { fetchBrowser } from "../../src/lib/crawler/fetchers/browser";
import { extractContent } from "../../src/lib/crawler/extraction";
import { generateHash } from "../../src/lib/diff/hash";
import { compareContent } from "../../src/lib/diff/compare";
import { db } from "../../src/lib/db/client";
import { monitors, snapshots, changes, users } from "../../src/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { logger } from "../../src/lib/observability/logger";
import {
  sendTelegramNotification,
  formatDiffForTelegram,
} from "../../src/lib/notifications/telegram";

export async function processMonitorJob(job: any) {
  const { monitorId } = job.data;

  const monitor = await db.query.monitors.findFirst({
    where: eq(monitors.id, monitorId),
  });

  if (!monitor || monitor.status !== "active") return;

  logger.info({ monitorId, url: monitor.url }, "Starting monitor check");

  let html: string;
  let status: number;
  try {
    if (monitor.fetchStrategy === "browser") {
      ({ html, status } = await fetchBrowser(monitor.url));
    } else {
      try {
        ({ html, status } = await fetchHttp(monitor.url));
      } catch (err: any) {
        logger.warn(
          { monitorId, error: err.message },
          "HTTP fetch failed, falling back to browser fetch",
        );
        ({ html, status } = await fetchBrowser(monitor.url));
      }
    }
  } catch (error: any) {
    logger.error({ monitorId, error: error.message }, "Fetch failed");
    throw error;
  }

  // Ignore Cloudflare challenge temporary text
  if (html.includes("Just a moment…") || html.includes("Just a moment...")) {
    logger.warn({ monitorId }, "Captured Cloudflare challenge page, skipping snapshot comparison");
    return;
  }

  const extracted = extractContent(html);
  const hash = generateHash(extracted);

  const prevSnapshot = await db.query.snapshots.findFirst({
    where: eq(snapshots.monitorId, monitor.id),
    orderBy: [desc(snapshots.timestamp)],
  });

  const snapshotId = randomUUID();
  await db.insert(snapshots).values({
    id: snapshotId,
    monitorId: monitor.id,
    httpStatus: status,
    contentHash: hash,
    extractedContent: extracted,
    resultStatus: "success",
  });

  if (prevSnapshot && prevSnapshot.contentHash !== hash) {
    const diff = compareContent(prevSnapshot.extractedContent || "", extracted);
    if (diff.hasChanged) {
      await db.insert(changes).values({
        id: randomUUID(),
        monitorId: monitor.id,
        previousSnapshotId: prevSnapshot.id,
        newSnapshotId: snapshotId,
        changeType: diff.changeType as any,
        summary: diff.summary,
        diffData: diff.diffData,
      });
      logger.info({ monitorId }, "Change detected");

      if (monitor.ownerId) {
        const owner = await db.query.users.findFirst({
          where: eq(users.id, monitor.ownerId),
        });
        if (owner?.telegramChatId) {
          const diffDetails = formatDiffForTelegram(
            prevSnapshot.extractedContent || "",
            extracted,
          );
          const message = `🚨 <b>প্রহর ট্র্যাক অ্যালার্ট! (Change Alert)</b>\n\n📌 <b>মনিটর:</b> ${monitor.name}\n🌐 <b>URL:</b> ${monitor.url}\n${diffDetails}`;
          await sendTelegramNotification(owner.telegramChatId, message);
        }
      }
    }
  }
}
