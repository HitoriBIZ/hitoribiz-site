import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "メルマガ管理ログイン | HitoriBIZ",
};

export default function NewsletterAdminLoginPage({
  searchParams,
}: {
  searchParams?: { error?: string; next?: string; reason?: string };
}) {
  const nextPath = searchParams?.next ?? "/admin/newsletter";
  const isMissingPassword = searchParams?.reason === "missing-password";
  const isInvalid = searchParams?.error === "invalid";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-16 text-slate-950">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
          HitoriBIZ Newsletter
        </p>
        <h1 className="mt-4 text-2xl font-bold">管理画面ログイン</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          読者情報を保護するため、メルマガ管理画面にはパスワード認証を設定しています。
        </p>

        {isMissingPassword ? (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <code className="rounded bg-white px-1.5 py-0.5">
              ADMIN_NEWSLETTER_PASSWORD
            </code>
            が未設定です。.env.local に管理用パスワードを設定してください。
          </div>
        ) : null}

        {isInvalid ? (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
            パスワードが違います。
          </div>
        ) : null}

        <form
          action="/api/admin/newsletter/login"
          method="post"
          className="mt-6 space-y-5"
        >
          <input type="hidden" name="next" value={nextPath} />
          <div>
            <label
              htmlFor="password"
              className="text-sm font-semibold text-slate-800"
            >
              管理用パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            ログインする
          </button>
        </form>
      </div>
    </main>
  );
}
