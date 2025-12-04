// app/contact/page.tsx
import React from "react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* ページタイトルセクション */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            お問い合わせ
          </h1>
          <p className="mt-3 text-xs text-slate-600 sm:text-sm">
            サービス内容のご相談、ホームページ制作やリニューアルのご相談、
            AI活用についてのご質問など、どうぞお気軽にお送りください。
          </p>
          <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
            ※ ご入力いただいた内容を確認のうえ、通常1〜2営業日以内にメールでご返信いたします。
          </p>
        </div>
      </section>

      {/* フォーム本体 */}
      <section className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <form
            action="https://submit-form.com/UWNAVrVsy"
            method="POST"
            className="space-y-6 sm:space-y-8"
          >
            {/* 送信後のリダイレクト先 */}
            <input
              type="hidden"
              name="_redirect"
              value="https://hitori-biz.com/contact/thanks"
            />
            <input type="hidden" name="_append" value="false" />

            {/* お名前 */}
            <div>
              <label className="block text-xs font-medium text-slate-700 sm:text-sm">
                お名前 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* メールアドレス */}
            <div>
              <label className="block text-xs font-medium text-slate-700 sm:text-sm">
                メールアドレス <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* 件名（セレクトボックス） */}
            <div>
              <label className="block text-xs font-medium text-slate-700 sm:text-sm">
                件名
              </label>
              <select
                name="subject"
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 bg-white"
                defaultValue=""
              >
                <option value="" disabled>
                  件名をお選びください
                </option>
                <option value="サービスのご相談">サービスのご相談</option>
                <option value="お見積りのご依頼">お見積りのご依頼</option>
                <option value="Webサイト制作について">Webサイト制作について</option>
                <option value="AI活用について">AI活用について</option>
                <option value="その他">
                  その他（下のお問い合わせ内容に詳細をご記入ください）
                </option>
              </select>
            </div>

            {/* お問い合わせ内容 */}
            <div>
              <label className="block text-xs font-medium text-slate-700 sm:text-sm">
                お問い合わせ内容 <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="message"
                rows={6}
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              className="w-full rounded-full bg-sky-700 py-3 text-sm font-semibold text-white hover:bg-sky-600 transition"
            >
              この内容で送信する
            </button>
          </form>

          <p className="mt-5 text-[11px] text-slate-400 sm:text-xs">
            送信後、自動的に確認ページへ移動します。そちらの表示をもって送信完了となります。
          </p>
        </div>
      </section>
    </main>
  );
}
