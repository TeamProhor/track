import { Resend } from "resend";
import { logger } from "../observability/logger";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmailNotification(
  to: string,
  subject: string,
  html: string,
) {
  if (!resend) {
    logger.warn(
      { to, subject },
      "Email notification skipped (no RESEND_API_KEY)",
    );
    return false;
  }

  try {
    const data = await resend.emails.send({
      from: "Prohor Track <noreply@prohortrack.com>",
      to,
      subject,
      html,
    });
    logger.info({ data }, "Email sent");
    return true;
  } catch (error: any) {
    logger.error({ error: error.message }, "Email sending failed");
    return false;
  }
}
