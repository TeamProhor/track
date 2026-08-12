import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "./session";

export async function getUser() {
  const session = await getSession();
  if (!session || !session.userId) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId as string),
  });

  return user || null;
}
