"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type SubmitState = "idle" | "submitting" | "success" | "error";

type SendCampaignFormProps = {
  campaignId: string;
  disabled: boolean;
};

const confirmText = "本配信する";

export default function SendCampaignForm({
  campaignId,
  disabled,
}: SendCampaignFormProps) {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const canSubmit =
    !disabled && submitState !== "submitting" && inputValue.trim() === confirmText;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/newsletter/campaigns/${campaignId}/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirmText: inputValue }),
        }
      );
      const result = (await response.json()) as {
        message?: string;
        sentCount?: number;
        failedCount?: number;
        attemptedCount?: number;
      };

      if (!response.ok) {
        throw new Error(result.message ?? "本配信に失敗しました。");
      }

      setSubmitState("success");
      setMessage(
        `${result.message ?? "本配信を実行しました。"} 送信成功: ${
          result.sentCount ?? 0
        }件 / 失敗: ${result.failedCount ?? 0}件`
      );
      router.refresh();
    } catch (error) {
      setSubmitState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "本配信に失敗しました。時間をおいて再度お試しください。"
      );
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      <div>
        <label htmlFor="send-confirm-text" className="text-xs font-semibold">
          確認のため「{confirmText}」と入力してください
        </label>
        <input
          id="send-confirm-text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          disabled={disabled || submitState === "submitting"}
          className="mt-2 w-full rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 disabled:bg-slate-100"
          placeholder={confirmText}
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {submitState === "submitting"
          ? "本配信中..."
          : "最大5件まで本配信する"}
      </button>

      {message ? (
        <p
          className={`rounded-lg border p-3 text-xs leading-6 ${
            submitState === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-white text-rose-900"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
