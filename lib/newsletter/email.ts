import { newsletterConfig } from "./config";
import type { NewsletterRecipientRow, SupabaseCampaignRow } from "./supabase";

type SendNewsletterTestEmailInput = {
  campaign: SupabaseCampaignRow;
  to: string;
};

type SendNewsletterCampaignEmailInput = {
  campaign: SupabaseCampaignRow;
  recipient: NewsletterRecipientRow;
  unsubscribeToken: string;
};

const defaultResendFromEmail = "HitoriBIZ <onboarding@resend.dev>";

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY ?? "";
  const from =
    process.env.RESEND_FROM_EMAIL ??
    process.env.NEWSLETTER_FROM_EMAIL ??
    defaultResendFromEmail;

  if (!apiKey) {
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

function isHtmlEmailBody(value: string) {
  const trimmed = value.trim().toLowerCase();

  return (
    trimmed.startsWith("<!doctype html") ||
    trimmed.startsWith("<html") ||
    trimmed.includes("<body") ||
    trimmed.includes("<table")
  );
}

function stripHtmlToText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function injectBeforeBodyEnd(html: string, fragment: string) {
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${fragment}</body>`);
  }

  return `${html}${fragment}`;
}

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://hitori-biz.com"
  ).replace(/\/$/, "");
}

function buildUnsubscribeUrl(token: string) {
  return `${getSiteUrl()}/newsletter/unsubscribe?token=${encodeURIComponent(
    token
  )}`;
}

function buildTestBannerHtml() {
  return `
    <div style="margin:0;padding:12px 16px;background:#dbeafe;color:#1d4ed8;font-family:Arial,'Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif;font-size:13px;font-weight:bold;text-align:center;">
      TEST SEND｜これはHitoriBIZ Newsletterのテスト送信です
    </div>
  `;
}

function buildCampaignFooterHtml(unsubscribeToken: string) {
  const unsubscribeUrl = buildUnsubscribeUrl(unsubscribeToken);

  return `
    <div style="margin:32px auto 0;padding:20px 16px;border-top:1px solid #e2e8f0;color:#64748b;font-family:Arial,'Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif;font-size:12px;line-height:1.8;text-align:center;">
      ${escapeHtml(newsletterConfig.footerName)}<br />
      返信先: ${escapeHtml(newsletterConfig.replyTo)}<br />
      <a href="${escapeHtml(unsubscribeUrl)}" style="color:#2563eb;">${escapeHtml(
        newsletterConfig.unsubscribeText
      )}</a>
    </div>
  `;
}

function buildTestEmailHtml(campaign: SupabaseCampaignRow) {
  if (isHtmlEmailBody(campaign.body)) {
    return injectBeforeBodyEnd(campaign.body, buildTestBannerHtml());
  }

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
  const bodyText = isHtmlEmailBody(campaign.body)
    ? stripHtmlToText(campaign.body)
    : campaign.body;

  return [
    "[TEST SEND]",
    campaign.subject,
    campaign.preview_text,
    "",
    bodyText,
    "",
    "---",
    "これはHitoriBIZ Newsletterのテスト送信です。",
    `${newsletterConfig.footerName} / ${newsletterConfig.replyTo}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildCampaignEmailHtml(
  campaign: SupabaseCampaignRow,
  recipient: NewsletterRecipientRow,
  unsubscribeToken: string
) {
  if (isHtmlEmailBody(campaign.body)) {
    return injectBeforeBodyEnd(
      campaign.body,
      buildCampaignFooterHtml(unsubscribeToken)
    );
  }

  const body = escapeHtml(campaign.body).replace(/\n/g, "<br />");
  const recipientName = recipient.name ? `${escapeHtml(recipient.name)} 様` : "";

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.8; color: #0f172a;">
      ${recipientName ? `<p>${recipientName}</p>` : ""}
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
      ${buildCampaignFooterHtml(unsubscribeToken)}
    </div>
  `;
}

function buildCampaignEmailText(
  campaign: SupabaseCampaignRow,
  recipient: NewsletterRecipientRow,
  unsubscribeToken: string
) {
  const unsubscribeUrl = buildUnsubscribeUrl(unsubscribeToken);
  const bodyText = isHtmlEmailBody(campaign.body)
    ? stripHtmlToText(campaign.body)
    : campaign.body;

  return [
    recipient.name ? `${recipient.name} 様` : "",
    campaign.subject,
    campaign.preview_text,
    "",
    bodyText,
    "",
    "---",
    newsletterConfig.footerName,
    `返信先: ${newsletterConfig.replyTo}`,
    `${newsletterConfig.unsubscribeText}: ${unsubscribeUrl}`,
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
      "Resendの環境変数が未設定です。RESEND_API_KEY を .env.local に設定してください。"
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

export async function sendNewsletterCampaignEmail({
  campaign,
  recipient,
  unsubscribeToken,
}: SendNewsletterCampaignEmailInput) {
  const config = getResendConfig();

  if (!config) {
    throw new Error(
      "Resendの環境変数が未設定です。RESEND_API_KEY を .env.local に設定してください。"
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
      to: [recipient.email],
      subject: campaign.subject,
      html: buildCampaignEmailHtml(campaign, recipient, unsubscribeToken),
      text: buildCampaignEmailText(campaign, recipient, unsubscribeToken),
      reply_to: config.replyTo,
      tags: [
        { name: "source", value: "hitoribiz_newsletter" },
        { name: "mode", value: "production_limited" },
        { name: "campaign_id", value: campaign.id },
      ],
    }),
    cache: "no-store",
  });

  const result = (await response.json()) as { id?: string; message?: string };

  if (!response.ok) {
    throw new Error(
      `Resend本配信に失敗しました。${result.message ?? response.statusText}`
    );
  }

  return result.id ?? null;
}
