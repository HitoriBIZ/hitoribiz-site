import { NextRequest, NextResponse } from "next/server";
import {
  getExpectedNewsletterAdminToken,
  NEWSLETTER_ADMIN_COOKIE,
} from "../../../../../../lib/newsletter/auth";
import { sendNewsletterTestEmail } from "../../../../../../lib/newsletter/email";
import { getNewsletterCampaign } from "../../../../../../lib/newsletter/supabase";

export const runtime = "nodejs";

type TestSendRequestBody = {
  campaignId?: unknown;
  testEmail?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  let body: TestSendRequestBody;

  try {
    body = (await request.json()) as TestSendRequestBody;
  } catch {
    return NextResponse.json(
      { message: "送信内容を読み取れませんでした。" },
      { status: 400 }
    );
  }

  const campaignId = normalizeText(body.campaignId);
  const testEmail = normalizeText(body.testEmail).toLowerCase();

  if (!campaignId) {
    return NextResponse.json(
      { message: "キャンペーンIDが必要です。" },
      { status: 400 }
    );
  }

  if (!emailPattern.test(testEmail)) {
    return NextResponse.json(
      { message: "正しいテスト送信先メールアドレスを入力してください。" },
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

    const resendEmailId = await sendNewsletterTestEmail({
      campaign,
      to: testEmail,
    });

    return NextResponse.json({
      message: "テストメールを送信しました。受信トレイをご確認ください。",
      resendEmailId,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "テスト送信に失敗しました。";
    const status = message.includes("Resendの環境変数") ? 503 : 500;

    return NextResponse.json({ message }, { status });
  }
}
