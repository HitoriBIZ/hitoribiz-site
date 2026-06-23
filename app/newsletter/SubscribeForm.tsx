"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { newsletterInterests } from "../../lib/newsletter/config";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function SubscribeForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const interests = formData.getAll("interests").map(String);

    const payload = {
      email: String(formData.get("email") ?? ""),
      name: String(formData.get("name") ?? ""),
      companyName: String(formData.get("companyName") ?? ""),
      interests,
      mailConsent: formData.get("mailConsent") === "on",
      privacyConsent: formData.get("privacyConsent") === "on",
    };

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "登録に失敗しました。");
      }

      form.reset();
      setSubmitState("success");
      setMessage(result.message ?? "ご登録ありがとうございます。");
    } catch (error) {
      setSubmitState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "登録に失敗しました。時間をおいて再度お試しください。"
      );
    }
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const isSubmitting = submitState === "submitting";

  return (
    <form
      onSubmit={submit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {message ? (
        <div
          className={`rounded-xl border p-4 text-sm leading-6 ${
            submitState === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="text-sm font-semibold text-slate-800">
          メールアドレス <span className="text-rose-600">必須</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-semibold text-slate-800">
            氏名
          </label>
          <input id="name" name="name" autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label
            htmlFor="companyName"
            className="text-sm font-semibold text-slate-800"
          >
            会社名または屋号
          </label>
          <input
            id="companyName"
            name="companyName"
            autoComplete="organization"
            className={inputClass}
          />
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-slate-800">
          関心のあるテーマ
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {newsletterInterests.map((interest) => (
            <label
              key={interest}
              className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                name="interests"
                value={interest}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              {interest}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-3 border-t border-slate-200 pt-6">
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
          <input
            name="mailConsent"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
          />
          <span>
            HitoriBIZからメールマガジンを受け取ることに同意します。
            <span className="text-rose-600">（必須）</span>
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
          <input
            name="privacyConsent"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
          />
          <span>
            <Link href="/privacy" className="font-medium text-blue-700 underline">
              プライバシーポリシー
            </Link>
            に同意します。
            <span className="text-rose-600">（必須）</span>
          </span>
        </label>
      </div>

      <p className="text-xs leading-6 text-slate-500">
        登録経路と同意日時は、適切な配信管理のために保存されます。配信停止者には本配信しない設計で運用します。
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "登録中..." : "メールマガジンに登録する"}
      </button>
    </form>
  );
}
