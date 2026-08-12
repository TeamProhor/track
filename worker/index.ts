import { createWorker } from "../src/lib/queue/connection";
import { processMonitorJob } from "./jobs/check-monitor";
import { logger } from "../src/lib/observability/logger";

const worker = createWorker("monitor-checks", async (job: any) => {
  await processMonitorJob(job);
});

worker.on("completed", (job) => {
  logger.info({ jobId: job.id }, "Job completed successfully");
});

import { startScheduler } from "./scheduler";

worker.on("failed", (job, err) => {
  logger.error({ jobId: job?.id, error: err.message }, "Job failed");
});

logger.info("Worker started successfully, waiting for jobs...");
startScheduler();
