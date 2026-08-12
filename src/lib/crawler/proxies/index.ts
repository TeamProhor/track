import { logger } from "../../observability/logger";

export type ProxyConfig = {
  server: string;
};

export class ProxyProvider {
  private proxies: ProxyConfig[] = [];
  private lastFetchTime = 0;
  private cacheTtlMs = 10 * 60 * 1000; // 10 minutes cache

  private async fetchProxiesFromProxyScrape(): Promise<ProxyConfig[]> {
    try {
      const url = "https://api.proxyscrape.com/v4/free-proxy-list/get?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all";
      const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) return [];

      const text = await response.text();
      const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0 && l.includes(":"));

      return lines.map(line => ({ server: line }));
    } catch (error: any) {
      logger.warn({ error: error.message }, "Failed to fetch proxies from ProxyScrape API");
      return [];
    }
  }

  async getProxy(): Promise<ProxyConfig | undefined> {
    const now = Date.now();

    if (this.proxies.length === 0 || now - this.lastFetchTime > this.cacheTtlMs) {
      const freshProxies = await this.fetchProxiesFromProxyScrape();
      if (freshProxies.length > 0) {
        this.proxies = freshProxies;
        this.lastFetchTime = now;
        logger.info({ count: freshProxies.length }, "Loaded fresh proxies from ProxyScrape");
      }
    }

    if (this.proxies.length === 0) return undefined;

    // Pick random proxy from pool
    const randomIndex = Math.floor(Math.random() * this.proxies.length);
    return this.proxies[randomIndex];
  }
}

export const globalProxyProvider = new ProxyProvider();
