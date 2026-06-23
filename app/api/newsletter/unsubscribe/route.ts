import { NextRequest, NextResponse } from "next/server";
import {
  unsubscribeNewsletterSubscriberByEmail,
  unsubscribeNewsletterSubscriberByToken,
} from "../../../../lib/newsletter/supabase";

export const runtime = "nodejs";

type UnsubscribeRequestBody = {
  email?: unknown;
  token?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  let body: UnsubscribeRequestBody;

  try {
    body = (await request.json()) as UnsubscribeRequestBody;
  } catch {
    return NextResponse.json(
      { message: "送信内容を読み取れませんでした。" },
      { status: 400 }
    );
  }

  const token = normalizeText(body.token);
  const email = normalizeText(body.email).toLowerCase();

  if (!token && !emailPattern.test(email)) {
    return NextResponse.json(
      { message: "正しいメールアドレスを入力してください。" },
      { status: 400 }
    );
  }

  try {
    if (token) {
      const subscriber = await unsubscribeNewsletterSubscriberByToken(token);

      if (!subscriber) {
        return NextResponse.json(
          {
            message:
              "配信停止リンクが無効、期限切れ、またはすでに使用済みです。メールアドレスで配信停止をお試しください。",
          },
          { status: 400 }
        );
      }
    } else {
      await unsubscribeNewsletterSubscriberByEmail(email);
    }

    return NextResponse.json({
      message:
        "配信停止を受け付けました。今後のメールマガジン配信対象から除外します。",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "配信停止処理に失敗しました。時間をおいて再度お試しください。";
    const status = message.includes("環境変数が未設定") ? 503 : 500;

    return NextResponse.json({ message }, { status });
  }
}
