// app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog｜HitoriBIZ",
  description:
    "HitoriBIZのブログ。AI活用・Web制作・小規模事業のデジタル活用について発信します。",
};

export default function BlogPage() {
  return (
    <main className="bg-white text-slate-900">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <p className="text-xs font-semibold tracking-[0.25em] text-slate-500">
            BLOG
          </p>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Blog
            <span className="mt-2 block text-lg font-medium text-slate-700 sm:text-xl">
              HitoriBIZの制作ノートと、AI・Web活用のヒント
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
            現在、公開準備中です。まずは、HitoriBIZの考え方や制作の裏側、AI活用の
            コツなどを少しずつ更新していきます。
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
  href="/booking"
  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
>
  相談してみる
</Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
            >
              Homeに戻る
            </Link>
          </div>
        </div>
      </section>

      {/* Content (準備中の枠) */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">
              これから掲載する内容（予定）
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
              <li>小規模事業のための、無理のないWeb集客の考え方</li>
              <li>AIを「業務に効く形」で使うための具体例</li>
              <li>ホームページ制作のチェックリスト（失敗しない順番）</li>
              <li>HitoriBIZの制作事例・改善のプロセス</li>
            </ul>

            <p className="mt-6 text-sm text-slate-600">
              ※ 記事一覧の機能（ブログCMS/MDXなど）は、次のステップで追加できます。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
