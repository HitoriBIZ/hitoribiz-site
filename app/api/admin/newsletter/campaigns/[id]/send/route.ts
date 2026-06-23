import { NextRequest, NextResponse } from "next/server";
import {
  getExpectedNewsletterAdminToken,
  NEWSLETTER_ADMIN_COOKIE,
} from "../../../../../../../lib/newsletter/auth";
import { sendNewsletterCampaignEmail } from "../../../../../../../lib/newsletter/email";
import {
  createNewsletterUnsubscribeToken,
  getNewsletterCampaign,
  listActiveNewsletterRecipients,
  recordNewsletterCampaignRecipient,
  recordNewsletterEmailEvent,
  updateNewsletterCampaignStatus,
} from "../../../../../../../lib/newsletter/supabase";

export const runtime = "nodejs";

const MAX_RECIPIENTS_PER_SEND = 5;
const CONFIRM_TEXT = "本配信する";

type SendRequestBody = {
  confirmText?: unknown;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function isAuthorized(request: NextRequest) {
  const expectedToken = await getExpectedNewsletterAdminToken();
  const currentToken = request.cookies.get(NEWSLETTER_ADMIN_COOKIE)?.value;

  return Boolean(expectedToken && currentToken === expectedToken);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json(
      { message: "管理画面にログインしてください。" },
      { status: 401 }
    );
  }

  let body: SendRequestBody;

  try {
    body = (await request.json()) as SendRequestBody;
  } catch {
    return NextResponse.json(
      { message: "送信確認内容を読み取れませんでした。" },
      { status: 400 }
    );
  }

  if (normalizeText(body.confirmText) !== CONFIRM_TEXT) {
    return NextResponse.json(
      { message: `確認欄に「${CONFIRM_TEXT}」と入力してください。` },
      { status: 400 }
    );
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { message: "Resend APIキーが未設定です。" },
      { status: 503 }
    );
  }

  const campaignId = normalizeText(params.id);

  if (!campaignId) {
    return NextResponse.json(
      { message: "キャンペーンIDが必要です。" },
      { status: 400 }
    );
  }

  try {
    const campaign = await getNewsletterCampaign(campaignId);

    if (!campaign) {
      return NextResponse.json(
        { message: "キャンペーンが見つかりません。" },
        { status: 404 }
      );
    }

    if (campaign.status !== "draft") {
      return NextResponse.json(
        { message: "下書き状態のキャンペーンのみ本配信できます。" },
        { status: 409 }
      );
    }

    const recipients = await listActiveNewsletterRecipients(
      MAX_RECIPIENTS_PER_SEND
    );

    if (!recipients.length) {
      return NextResponse.json(
        { message: "配信対象のactive読者がいません。" },
        { status: 400 }
      );
    }

    await updateNewsletterCampaignStatus(campaign.id, "sending", null);

    const results = [];

    for (const recipient of recipients) {
      try {
        const unsubscribeToken = await createNewsletterUnsubscribeToken(
          recipient.id
        );
        const resendEmailId = await sendNewsletterCampaignEmail({
          campaign,
          recipient,
          unsubscribeToken,
        });
        const sentAt = new Date().toISOString();
        await recordNewsletterCampaignRecipient({
          campaignId: campaign.id,
          subscriberId: recipient.id,
          email: recipient.email,
          status: "sent",
          sentAt,
          errorMessage: null,
        });
        try {
          await recordNewsletterEmailEvent({
            campaignId: campaign.id,
            subscriberId: recipient.id,
            eventType: "sent",
            metadata: {
              resendEmailId,
              mode: "production_limited",
            },
          });
        } catch {
          // Email delivery succeeded; event persistence is best effort.
        }
        results.push({
          email: recipient.email,
          status: "sent" as const,
          resendEmailId,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "送信に失敗しました。";
        await recordNewsletterCampaignRecipient({
          campaignId: campaign.id,
          subscriberId: recipient.id,
          email: recipient.email,
          status: "failed",
          sentAt: null,
          errorMessage: message,
        });
        try {
          await recordNewsletterEmailEvent({
            campaignId: campaign.id,
            subscriberId: recipient.id,
            eventType: "failed",
            metadata: {
              errorMessage: message,
              mode: "production_limited",
            },
          });
        } catch {
          // Recipient result is already persisted; event persistence is best effort.
        }
        results.push({
          email: recipient.email,
          status: "failed" as const,
          errorMessage: message,
        });
      }
    }

    const sentCount = results.filter((result) => result.status === "sent").length;
    const failedCount = results.length - sentCount;

    await updateNewsletterCampaignStatus(
      campaign.id,
      "sent",
      sentCount > 0 ? new Date().toISOString() : null
    );

    return NextResponse.json({
      message: "安全制限付き本配信を実行しました。",
      sentCount,
      failedCount,
      attemptedCount: results.length,
      maxRecipients: MAX_RECIPIENTS_PER_SEND,
      results,
    });
  } catch (error) {
    try {
      await updateNewsletterCampaignStatus(campaignId, "draft", null);
    } catch {
      // Best effort rollback for visible status only.
    }

    const message =
      error instanceof Error ? error.message : "本配信に失敗しました。";
    const status = message.includes("Supabaseの環境変数") ? 503 : 500;

    return NextResponse.json({ message }, { status });
  }
}
