export function cronToSeconds(cron: string): number {
  if (cron === "*/5 * * * *") return 300;
  if (cron === "*/15 * * * *") return 900;
  if (cron === "*/30 * * * *") return 1800;
  if (cron === "0 * * * *") return 3600;
  if (cron === "0 */6 * * *") return 21600;
  if (cron === "0 0 * * *") return 86400;
  return 3600;
}

export function secondsToCron(seconds: number | string): string {
  const sec = Number(seconds);
  if (sec <= 300) return "*/5 * * * *";
  if (sec <= 900) return "*/15 * * * *";
  if (sec <= 1800) return "*/30 * * * *";
  if (sec <= 3600) return "0 * * * *";
  if (sec <= 21600) return "0 */6 * * *";
  return "0 0 * * *";
}

export function formatScheduleBangla(cron: string): string {
  const sec = cronToSeconds(cron);
  if (sec === 300) return "৫ মিনিট পর পর (300s)";
  if (sec === 900) return "১৫ মিনিট পর পর (900s)";
  if (sec === 1800) return "৩০ মিনিট পর পর (1800s)";
  if (sec === 3600) return "১ ঘণ্টা পর পর (3600s)";
  if (sec === 21600) return "৬ ঘণ্টা পর পর (21600s)";
  if (sec === 86400) return "২৪ ঘণ্টা পর পর (86400s)";
  return `${sec}s`;
}
