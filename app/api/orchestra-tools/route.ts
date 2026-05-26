import { NextResponse } from "next/server";

type OrchestraToolsPayload = {
  email?: string;
  nickname?: string;
  instrument?: string;
  organization?: string;
  consent?: boolean;
  source?: string;
  clientTimestamp?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as OrchestraToolsPayload;

    const email = body.email?.trim();
    const nickname = body.nickname?.trim() || "";
    const instrument = body.instrument?.trim() || "";
    const organization = body.organization?.trim() || "";
    const consent = body.consent === true;

    if (!email) {
      return NextResponse.json(
        { ok: false, message: "メールアドレスは必須です。" },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { ok: false, message: "メルマガ登録への同意が必要です。" },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.ORCHESTRA_TOOLS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("ORCHESTRA_TOOLS_WEBHOOK_URL is not set.");
      return NextResponse.json(
        { ok: false, message: "Webhook URLが設定されていません。" },
        { status: 500 }
      );
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "";

    const userAgent = req.headers.get("user-agent") || "";

    const payload = {
      at: new Date().toISOString(),
      email,
      nickname,
      instrument,
      organization,
      consent,
      source: body.source || "orchestra-tools-lp",
      clientTimestamp: body.clientTimestamp || "",
      userAgent,
      ip,
      lang: req.headers.get("accept-language") || "",
    };

    const gasRes = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const gasText = await gasRes.text();

    if (!gasRes.ok) {
      console.error("Google Apps Script webhook error:", gasText);

      return NextResponse.json(
        { ok: false, message: "webhookエラーが発生しました。" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "登録が完了しました。",
    });
  } catch (error) {
    console.error("orchestra-tools route error:", error);

    return NextResponse.json(
      { ok: false, message: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}