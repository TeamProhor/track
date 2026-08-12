import { logger } from "../observability/logger";
import { diffLines } from "diff";

const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  "8594573511:AAEcnVc3GUgV-NttccttxhsF3g4S0cHuBPQ";

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function formatDiffForTelegram(prevText: string, newText: string): string {
  const parts = diffLines(prevText, newText);
  const addedLines: string[] = [];
  const removedLines: string[] = [];

  for (const part of parts) {
    if (part.added) {
      const lines = part.value.split("\n").map((l) => l.trim()).filter(Boolean);
      addedLines.push(...lines);
    } else if (part.removed) {
      const lines = part.value.split("\n").map((l) => l.trim()).filter(Boolean);
      removedLines.push(...lines);
    }
  }

  let text = "";
  if (addedLines.length > 0) {
    text += `\n🟢 <b>যুক্ত করা হয়েছে (Added):</b>\n` + addedLines.slice(0, 5).map((l) => `+ <code>${escapeHtml(l.slice(0, 100))}</code>`).join("\n");
  }
  if (removedLines.length > 0) {
    text += `\n🔴 <b>মুছে ফেলা হয়েছে (Removed):</b>\n` + removedLines.slice(0, 5).map((l) => `- <code>${escapeHtml(l.slice(0, 100))}</code>`).join("\n");
  }

  return text;
}

export async function sendTelegramNotification(
  chatId: string,
  message: string,
) {
  if (!chatId) return false;

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        link_preview_options: {
          is_disabled: true,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      logger.error({ chatId, err }, "Telegram notification failed");
      return false;
    }

    logger.info({ chatId }, "Telegram notification sent successfully");
    return true;
  } catch (error: any) {
    logger.error({ chatId, error: error.message }, "Telegram error");
    return false;
  }
}
