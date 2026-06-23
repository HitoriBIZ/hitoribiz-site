import { newsletterConfig } from "./config";
import type { SupabaseCampaignRow } from "./supabase";

type SendNewsletterTestEmailInput = {
  campaign: SupabaseCampaignRow;
  to: string;
};

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY ?? "";
  const from =
    process.env.RESEND_FROM_EMAIL ??
    process.env.NEWSLETTER_FROM_EMAIL ??
    "";

  if (!apiKey || !from) {
    return null;
  }

  return {
    apiKey,
    from,
    replyTo: process.env.RESEND_REPLY_TO ?? newsletterConfig.replyTo,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildTestEmailHtml(campaign: SupabaseCampaignRow) {
  const body = escapeHtml(campaign.body).replace(/\n/g, "<br />");

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.8; color: #0f172a;">
      <p style="display: inline-block; margin: 0 0 16px; padding: 4px 10px; border-radius: 999px; background: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 700;">
        TEST SEND
      </p>
      <h1 style="font-size: 22px; margin: 0 0 8px;">${escapeHtml(
        campaign.subject
      )}</h1>
      ${
        campaign.preview_text
          ? `<p style="margin: 0 0 24px; color: #64748b;">${escapeHtml(
              campaign.preview_text
            )}</p>`
          : ""
      }
      <div style="white-space: normal; font-size: 15px;">${body}</div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0 16px;" />
      <p style="font-size: 12px; color: #64748b;">
        これはHitoriBIZ Newsletterのテスト送信です。本配信では配信停止リンクと送信者情報を自動挿入します。<br />
        ${escapeHtml(newsletterConfig.footerName)} / ${escapeHtml(
          newsletterConfig.replyTo
        )}
      </p>
    </div>
  `;
}

function buildTestEmailText(campaign: SupabaseCampaignRow) {
  return [
    "[TEST SEND]",
    campaign.subject,
    campaign.preview_text,
    "",
    campaign.body,
    "",
    "---",
    "これはHitoriBIZ Newsletterのテスト送信です。",
    `${newsletterConfig.footerName} / ${newsletterConfig.replyTo}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendNewsletterTestEmail({
  campaign,
  to,
}: SendNewsletterTestEmailInput) {
  const config = getResendConfig();

  if (!config) {
    throw new Error(
      "Resendの環境変数が未設定です。RESEND_API_KEY と RESEND_FROM_EMAIL を設定してください。"
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to: [to],
      subject: `[TEST] ${campaign.subject}`,
      html: buildTestEmailHtml(campaign),
      text: buildTestEmailText(campaign),
      reply_to: config.replyTo,
      tags: [
        { name: "source", value: "hitoribiz_newsletter" },
        { name: "mode", value: "test_send" },
      ],
    }),
    cache: "no-store",
  });

  const result = (await response.json()) as { id?: string; message?: string };

  if (!response.ok) {
    throw new Error(
      `Resendテスト送信に失敗しました。${result.message ?? response.statusText}`
    );
  }

  return result.id ?? null;
}
