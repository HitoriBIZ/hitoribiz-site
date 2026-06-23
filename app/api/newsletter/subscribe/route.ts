import { NextRequest, NextResponse } from "next/server";
import { newsletterInterests } from "../../../../lib/newsletter/config";
import { upsertNewsletterSubscriber } from "../../../../lib/newsletter/supabase";

export const runtime = "nodejs";

type SubscribeRequestBody = {
  email?: unknown;
  name?: unknown;
  companyName?: unknown;
  interests?: unknown;
  mailConsent?: unknown;
  privacyConsent?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeInterests(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  const allowed = new Set<string>(newsletterInterests);
  return value
    .map((interest) => normalizeText(interest))
    .filter((interest) => allowed.has(interest));
}

export async function POST(request: NextRequest) {
  let body: SubscribeRequestBody;

  try {
    body = (await request.json()) as SubscribeRequestBody;
  } catch {
    return NextResponse.json(
      { message: "送信内容を読み取れませんでした。" },
      { status: 400 }
    );
  }

  const email = normalizeText(body.email).toLowerCase();
  const name = normalizeText(body.name);
  const companyName = normalizeText(body.companyName);
  const interests = normalizeInterests(body.interests);
  const mailConsent = body.mailConsent === true;
  const privacyConsent = body.privacyConsent === true;

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { message: "正しいメールアドレスを入力してください。" },
      { status: 400 }
    );
  }

  if (!mailConsent || !privacyConsent) {
    return NextResponse.json(
      { message: "メール配信とプライバシーポリシーへの同意が必要です。" },
      { status: 400 }
    );
  }

  try {
    const savedSubscriber = await upsertNewsletterSubscriber({
      email,
      name,
      companyName,
      interests,
      consentSource: "public_newsletter_form",
      consentAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message:
        "ご登録ありがとうございます。HitoriBIZメールマガジンの読者リストに登録しました。",
      subscriberId: savedSubscriber?.id ?? null,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "登録に失敗しました。時間をおいて再度お試しください。";

    const status = message.includes("環境変数が未設定") ? 503 : 500;
    return NextResponse.json({ message }, { status });
  }
}
