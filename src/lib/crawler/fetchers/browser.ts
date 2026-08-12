import { chromium } from "patchright";
import { validateUrl } from "../../security/ssrf";
import { globalUserAgentProvider } from "../core/user-agents";

export async function fetchBrowser(
  url: string,
  timeoutMs = 30000,
  extraHeaders?: Record<string, string>,
) {
  const safeUrl = await validateUrl(url);
  const userAgent =
    extraHeaders?.["User-Agent"] ||
    globalUserAgentProvider.getRandomUserAgent();

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-infobars",
      "--window-size=1920,1080",
    ],
  });

  const context = await browser.newContext({
    userAgent,
    extraHTTPHeaders: extraHeaders,
    viewport: { width: 1920, height: 1080 },
    locale: "en-US",
    timezoneId: "Asia/Dhaka",
    deviceScaleFactor: 1,
    hasTouch: false,
    isMobile: false,
  });

  if (extraHeaders?.Cookie) {
    const cookiePairs = extraHeaders.Cookie.split(";");
    const hostname = new URL(safeUrl).hostname;
    const domain = hostname.startsWith(".") ? hostname : `.${hostname}`;
    const cookiesToAdd = cookiePairs
      .map((pair) => {
        const [name, ...rest] = pair.trim().split("=");
        return {
          name: name?.trim(),
          value: rest.join("=").trim(),
          domain,
          path: "/",
        };
      })
      .filter((c) => c.name && c.value);

    await context.addCookies(cookiesToAdd).catch(() => {});
  }

  const page = await context.newPage();

  // Stealth script injection
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    // @ts-ignore
    window.chrome = { runtime: {} };
    Object.defineProperty(navigator, "plugins", {
      get: () => [1, 2, 3, 4, 5],
    });
    Object.defineProperty(navigator, "languages", {
      get: () => ["en-US", "en"],
    });
  });

  try {
    const response = await page
      .goto(safeUrl, {
        waitUntil: "networkidle",
        timeout: timeoutMs,
      })
      .catch(() => null);

    // Wait for potential Cloudflare challenge to complete
    let attempts = 0;
    while (attempts < 5) {
      const content = await page.content();
      if (
        !content.includes("Just a moment") &&
        !content.includes("cf-challenge")
      ) {
        break;
      }
      await page.waitForTimeout(2000);
      attempts++;
    }

    const html = await page.content();
    const status = response?.status() || 200;

    return { html, status };
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}
