import { createHash } from "crypto";

export function generateHash(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}
