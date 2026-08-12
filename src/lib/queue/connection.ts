import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(
  process.env.REDIS_URL || "redis://localhost:6379",
  {
    maxRetriesPerRequest: null,
  },
);

export const monitorQueue = new Queue("monitor-checks", { connection });

export function createWorker(name: string, processor: any) {
  return new Worker(name, processor, { connection });
}
