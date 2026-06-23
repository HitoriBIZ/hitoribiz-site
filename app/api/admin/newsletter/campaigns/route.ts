import { NextRequest, NextResponse } from "next/server";
import {
  getExpectedNewsletterAdminToken,
  NEWSLETTER_ADMIN_COOKIE,
} from "../../../../../lib/newsletter/auth";
import { createNewsletterCampaignDraft } from "../../../../../lib/newsletter/supabase";

export const runtime = "nodejs";

type CampaignDraftRequestBody = {
  name?: unknown;
  subject?: unknown;
  previewText?: unknown;
  body?: unknown;
  scheduledAt?: unknown;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function isAuthorized(request: NextRequest) {
  const expectedToken = await getExpectedNewsletterAdminToken();
  const currentToken = request.cookies.get(NEWSLETTER_ADMIN_COOKIE)?.value;

  return Boolean(expectedToken && currentToken === expectedToken);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json(
      { message: "管理画面にログインしてください。" },
      { status: 401 }
    );
  }

  let body: CampaignDraftRequestBody;

  try {
    body = (await request.json()) as CampaignDraftRequestBody;
  } catch {
    return NextResponse.json(
      { message: "送信内容を読み取れませんでした。" },
      { status: 400 }
    );
  }

  const name = normalizeText(body.name);
  const subject = normalizeText(body.subject);
  const previewText = normalizeText(body.previewText);
  const campaignBody = normalizeText(body.body);
  const scheduledAtText = normalizeText(body.scheduledAt);
  const scheduledAt = scheduledAtText
    ? new Date(scheduledAtText).toISOString()
    : null;

  if (!name || !subject || !campaignBody) {
    return NextResponse.json(
      { message: "キャンペーン名、件名、本文は必須です。" },
      { status: 400 }
    );
  }

  try {
    const campaign = await createNewsletterCampaignDraft({
      name,
      subject,
      previewText,
      body: campaignBody,
      scheduledAt,
    });

    return NextResponse.json({
      message: "キャンペーン下書きを保存しました。",
      campaignId: campaign?.id ?? null,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "キャンペーン下書き保存に失敗しました。";
    const status = message.includes("環境変数が未設定") ? 503 : 500;

    return NextResponse.json({ message }, { status });
  }
}
