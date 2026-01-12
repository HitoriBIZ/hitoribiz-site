// app/booking/page.tsx
import React from "react";

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-bold text-slate-900">
  オンライン相談のご予約（約30分・無料）
</h1>
        <p className="mb-6 text-sm leading-relaxed text-slate-600">
          ひとりビジネスや小規模ビジネスのお悩みを、
          <span className="font-semibold"> 無料のオンライン相談（約30分）</span>
          にて承ります。Zoom／Google Meet に対応しています。
          <br />
          下記のカレンダーから、ご希望の日時をご選択ください。
        </p>

        {/* ▼▼▼ Calendly 埋め込み ▼▼▼ */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <iframe
            src="https://calendly.com/contact-hitori-biz/30min?embed_domain=hitori-biz.com&embed_type=Inline"
            width="100%"
            height="700"
            frameBorder="0"
          ></iframe>
        </div>
        {/* ▲▲▲ ここまで ▼▼▼ */}

        <p className="mt-4 text-xs text-slate-500">
          ※ 予約完了後、自動返信メールにてオンラインミーティングのURL（ZoomまたはGoogle Meet）をお送りします。
        </p>
      </div>
    </main>
  );
}
