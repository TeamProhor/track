import { z } from "zod";
import dns from "dns/promises";

export class SSRFError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SSRFError";
  }
}

export async function validateUrl(urlString: string): Promise<string> {
  const parsed = z.string().url().safeParse(urlString);
  if (!parsed.success) throw new SSRFError("Invalid URL");

  const url = new URL(urlString);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new SSRFError("Invalid protocol");
  }

  // Prevent local loopback directly
  if (
    url.hostname === "localhost" ||
    url.hostname.includes("127.0.0.1") ||
    url.hostname === "::1"
  ) {
    throw new SSRFError("Localhost is not allowed");
  }

  // Basic DNS lookup to check for internal IPs
  try {
    const records = await dns.lookup(url.hostname);
    const ip = records.address;

    // Check if IP is private (very simplified check, production needs more robust CIDR matching)
    if (
      ip.startsWith("10.") ||
      ip.startsWith("192.168.") ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) ||
      ip === "127.0.0.1" ||
      ip === "::1"
    ) {
      throw new SSRFError("Internal IPs are blocked");
    }
  } catch (err: any) {
    if (err instanceof SSRFError) throw err;
    throw new SSRFError("DNS resolution failed");
  }

  return url.toString();
}
