import { validateUrl } from "../../security/ssrf";
import { globalUserAgentProvider } from "../core/user-agents";

export async function fetchHttp(
  url: string,
  timeoutMs = 30000,
  extraHeaders?: Record<string, string>,
) {
  const safeUrl = await validateUrl(url);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const userAgent =
    extraHeaders?.["User-Agent"] ||
    globalUserAgentProvider.getRandomUserAgent();

  try {
    const res = await fetch(safeUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": userAgent,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,bn;q=0.8",
        "Cache-Control": "no-cache",
        ...extraHeaders,
      },
    });

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const html = await res.text();
    return { html, status: res.status };
  } finally {
    clearTimeout(timeoutId);
  }
}
