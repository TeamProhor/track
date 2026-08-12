"use server";

import { z } from "zod";
import { db } from "../db/client";
import { monitors } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { getUser } from "../auth/user";
import { redirect } from "next/navigation";

const monitorSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  schedule: z.string().min(1),
});

export async function createMonitor(formData: FormData) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = monitorSchema.parse({
    name: formData.get("name"),
    url: formData.get("url"),
    schedule: formData.get("schedule"),
  });

  const monitorId = randomUUID();

  const { secondsToCron } = await import("../utils/schedule");
  const rawSchedule = parsed.schedule;
  const cronSchedule = /^\d+$/.test(rawSchedule)
    ? secondsToCron(rawSchedule)
    : rawSchedule;

  await db.insert(monitors).values({
    id: monitorId,
    ownerId: user.id,
    name: parsed.name,
    url: parsed.url,
    schedule: cronSchedule,
  });

  redirect("/dashboard/monitors");
}

export async function triggerCheck(formData: FormData) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const monitorId = formData.get("monitorId") as string;
  if (!monitorId) return;

  const monitor = await db.query.monitors.findFirst({
    where: eq(monitors.id, monitorId),
  });

  if (!monitor || monitor.ownerId !== user.id) throw new Error("Forbidden");

  const { monitorQueue } = await import("../queue/connection");
  await monitorQueue.add("check", { monitorId: monitor.id });

  const { revalidatePath } = await import("next/cache");
  revalidatePath(`/dashboard/monitors/${monitorId}`);
}

export async function updateMonitor(formData: FormData) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const monitorId = formData.get("id") as string;
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const rawSchedule = formData.get("schedule") as string;
  const status = (formData.get("status") as string) || "active";

  if (!monitorId || !name || !url) throw new Error("Missing required fields");

  const existing = await db.query.monitors.findFirst({
    where: eq(monitors.id, monitorId),
  });
  if (!existing || existing.ownerId !== user.id) throw new Error("Forbidden");

  const { secondsToCron } = await import("../utils/schedule");
  const cronSchedule = /^\d+$/.test(rawSchedule)
    ? secondsToCron(rawSchedule)
    : rawSchedule;

  await db
    .update(monitors)
    .set({
      name,
      url,
      schedule: cronSchedule,
      status: status as any,
      updatedAt: new Date(),
    })
    .where(eq(monitors.id, monitorId));

  redirect(`/dashboard/monitors/${monitorId}`);
}

export async function deleteMonitor(formData: FormData) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const monitorId = formData.get("monitorId") as string;
  if (!monitorId) return;

  const existing = await db.query.monitors.findFirst({
    where: eq(monitors.id, monitorId),
  });
  if (!existing || existing.ownerId !== user.id) throw new Error("Forbidden");

  await db.delete(monitors).where(eq(monitors.id, monitorId));

  redirect("/dashboard/monitors");
}
