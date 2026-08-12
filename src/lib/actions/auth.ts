"use server";

import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { createSession, deleteSession } from "../auth/session";
import { Argon2id } from "oslo/password";
import { z } from "zod";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const parsed = schema.safeParse({ email, password });
  if (!parsed.success) {
    return { error: "Invalid email or password must be 8+ characters" };
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    return { error: "User already exists" };
  }

  const hashedPassword = await new Argon2id().hash(password);
  const userId = randomUUID();

  await db.insert(users).values({
    id: userId,
    email,
    passwordHash: hashedPassword,
    role: "user",
  });

  await createSession(userId);
  redirect("/dashboard");
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const parsed = schema.safeParse({ email, password });
  if (!parsed.success) {
    return { error: "Invalid email or password" };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || !user.passwordHash) {
    return { error: "Invalid credentials" };
  }

  const validPassword = await new Argon2id().verify(
    user.passwordHash,
    password,
  );
  if (!validPassword) {
    return { error: "Invalid credentials" };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function signOut() {
  await deleteSession();
  redirect("/sign-in");
}
