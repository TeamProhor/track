"use server";

import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "../auth/user";
import { revalidatePath } from "next/cache";

export async function updateTelegramChatId(formData: FormData) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const telegramChatId = formData.get("telegramChatId") as string;

  await db
    .update(users)
    .set({ telegramChatId: telegramChatId?.trim() || null })
    .where(eq(users.id, user.id));

  const { redirect } = await import("next/navigation");
  redirect("/dashboard/settings?saved=true");
}
