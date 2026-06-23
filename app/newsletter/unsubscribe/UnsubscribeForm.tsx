"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function UnsubscribeForm({
  initialEmail = "",
  initialToken = "",
}: {
  initialEmail?: string;
  initialToken?: string;
}) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const hasToken = initialToken.length > 0;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      token: String(formData.get("token") ?? ""),
    };

    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "配信停止に失敗しました。");
      }

      setSubmitState("success");
      setMessage(result.message ?? "配信停止を受け付けました。");
    } catch (error) {
      setSubmitState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "配信停止に失敗しました。時間をおいて再度お試しください。"
      );
    }
  }

  const isSubmitting = submitState === "submitting";
  const isSuccess = submitState === "success";

  return (
    <form
      onSubmit={submit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {message ? (
        <div
          className={`rounded-xl border p-4 text-sm leading-6 ${
            isSuccess
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          {message}
        </div>
      ) : null}

      <input type="hidden" name="token" value={initialToken} />

      {hasToken ? (
        <p className="text-sm leading-7 text-slate-600">
          メール内の配信停止リンクからアクセスしています。下のボタンを押すと、このメールアドレスへの配信を停止します。
        </p>
      ) : (
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-slate-800">
            配信停止するメールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={initialEmail}
            autoComplete="email"
            placeholder="you@example.com"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isSuccess}
        className="w-full rounded-lg bg-rose-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting
          ? "処理中..."
          : isSuccess
            ? "配信停止済み"
            : "配信を停止する"}
      </button>

      <p className="text-xs leading-6 text-slate-500">
        配信停止後は、通常のメールマガジン配信対象から除外されます。重要なお知らせや個別の業務連絡は別途お送りする場合があります。
      </p>
    </form>
  );
}
