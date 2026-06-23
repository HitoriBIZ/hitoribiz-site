"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function TestSendForm({ campaignId }: { campaignId: string }) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      campaignId,
      testEmail: String(formData.get("testEmail") ?? ""),
    };

    try {
      const response = await fetch(
        "/api/admin/newsletter/campaigns/test-send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "テスト送信に失敗しました。");
      }

      setSubmitState("success");
      setMessage(result.message ?? "テストメールを送信しました。");
      form.reset();
    } catch (error) {
      setSubmitState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "テスト送信に失敗しました。時間をおいて再度お試しください。"
      );
    }
  }

  const isSubmitting = submitState === "submitting";

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex min-w-72 gap-2">
        <input
          name="testEmail"
          type="email"
          required
          placeholder="test@example.com"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "送信中" : "テスト送信"}
        </button>
      </div>
      {message ? (
        <p
          className={`text-xs ${
            submitState === "success" ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
