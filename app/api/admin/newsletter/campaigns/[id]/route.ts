import { NextRequest, NextResponse } from "next/server";
import {
  getExpectedNewsletterAdminToken,
  NEWSLETTER_ADMIN_COOKIE,
} from "../../../../../../lib/newsletter/auth";
import {
  getNewsletterCampaign,
  updateNewsletterCampaignDraft,
} from "../../../../../../lib/newsletter/supabase";

export const runtime = "nodejs";

type CampaignUpdateRequestBody = {
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json(
      { message: "管理画面にログインしてください。" },
      { status: 401 }
    );
  }

  let body: CampaignUpdateRequestBody;

  try {
    body = (await request.json()) as CampaignUpdateRequestBody;
  } catch {
    return NextResponse.json(
      { message: "更新内容を読み取れませんでした。" },
      { status: 400 }
    );
  }

  const campaignId = normalizeText(params.id);
  const name = normalizeText(body.name);
  const subject = normalizeText(body.subject);
  const previewText = normalizeText(body.previewText);
  const campaignBody = normalizeText(body.body);
  const scheduledAtText = normalizeText(body.scheduledAt);
  const scheduledAt = scheduledAtText
    ? new Date(scheduledAtText).toISOString()
    : null;

  if (!campaignId) {
    return NextResponse.json(
      { message: "キャンペーンIDが必要です。" },
      { status: 400 }
    );
  }

  if (!name || !subject || !campaignBody) {
    return NextResponse.json(
      { message: "キャンペーン名、件名、本文は必須です。" },
      { status: 400 }
    );
  }

  try {
    const existingCampaign = await getNewsletterCampaign(campaignId);

    if (!existingCampaign) {
      return NextResponse.json(
        { message: "キャンペーンが見つかりません。" },
        { status: 404 }
      );
    }

    if (existingCampaign.status !== "draft") {
      return NextResponse.json(
        { message: "下書き以外のキャンペーンは編集できません。" },
        { status: 409 }
      );
    }

    const campaign = await updateNewsletterCampaignDraft({
      campaignId,
      name,
      subject,
      previewText,
      body: campaignBody,
      scheduledAt,
    });

    return NextResponse.json({
      message: "キャンペーン下書きを更新しました。",
      campaignId: campaign?.id ?? campaignId,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "キャンペーン下書き更新に失敗しました。";
    const status = message.includes("Supabaseの環境変数") ? 503 : 500;

    return NextResponse.json({ message }, { status });
  }
}
