import { getAppBaseUrl } from "./supabase";

type NotificationInput = {
  to?: string;
  subject: string;
  preview: string;
  reviewPath: string;
};

export async function sendEmailNotification(input: NotificationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFICATION_FROM_EMAIL ?? "ApprovalFlow <notifications@approvalflow.app>";
  const to = input.to ?? process.env.AGENCY_NOTIFICATION_EMAIL;

  if (!apiKey || !to) {
    console.info("ApprovalFlow notification skipped", {
      subject: input.subject,
      reviewPath: input.reviewPath,
    });
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: input.subject,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;line-height:1.5;color:#18181b">
          <p>${input.preview}</p>
          <p><a href="${getAppBaseUrl()}${input.reviewPath}">Open review</a></p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    console.error("ApprovalFlow notification failed", await response.text());
  }
}
