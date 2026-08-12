import { logger } from "../observability/logger";

export async function sendWebhookNotification(url: string, payload: any) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Webhook failed with status ${res.status}`);
    }
    logger.info({ url }, "Webhook sent successfully");
    return true;
  } catch (error: any) {
    logger.error({ url, error: error.message }, "Webhook delivery failed");
    return false;
  }
}
