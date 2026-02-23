import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("[TESTER_SIGNUP] SHEETS_WEBHOOK_URL is missing");
      return NextResponse.json(
        { error: "サーバ設定（WEBHOOK URL）が未設定です。" },
        { status: 500 }
      );
    }

    // フォームの内容をGASへ転送
    const forwarded = {
      email: body.email,
      name: body.name,
      instrument: body.instrument,
      platform: body.platform,
      experience: body.experience,
      notes: body.notes,
      userAgent: req.headers.get("user-agent") || "",
      ip:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "",
    };

    const r = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(forwarded),
      cache: "no-store",
    });

    const text = await r.text();
    console.log("[TESTER_SIGNUP] webhook status:", r.status);
    console.log("[TESTER_SIGNUP] webhook body:", text);

    let parsed: any = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      // JSONじゃない場合もある
    }

    if (!r.ok) {
      return NextResponse.json(
        { error: "保存に失敗しました（Webhookエラー）。" },
        { status: 502 }
      );
    }

    // ✅ GASが ok:false を返したら、フォームにエラーとして出す
    if (parsed && parsed.ok === false) {
      return NextResponse.json(
        { error: parsed.error || "登録できませんでした。" },
        { status: 400 }
      );
    }

    // ✅ GASが ok:true の場合のみ成功
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[TESTER_SIGNUP] exception:", e);
    return NextResponse.json(
      { error: "サーバ処理に失敗しました。" },
      { status: 500 }
    );
  }
}