// app/contact/thanks/page.tsx
import Link from "next/link";

export default function ContactThanksPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          お問い合わせありがとうございました。
        </h1>
        <p className="mt-4 text-sm text-slate-600">
          内容を確認のうえ、通常1〜2営業日以内にご連絡いたします。
          <br />
          しばらくお待ちください。
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-sky-700 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-600"
          >
            トップページへ戻る
          </Link>
          <Link
            href="/contact"
            className="text-sm font-semibold text-sky-700 hover:underline"
          >
            もう一度問い合わせる
          </Link>
        </div>
      </section>
    </main>
  );
}
