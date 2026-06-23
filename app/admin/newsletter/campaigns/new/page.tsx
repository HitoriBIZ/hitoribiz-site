"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../../../components/newsletter/AdminUi";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function NewCampaignPage() {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      previewText: String(formData.get("previewText") ?? ""),
      body: String(formData.get("body") ?? ""),
      scheduledAt: String(formData.get("scheduledAt") ?? ""),
    };

    try {
      const response = await fetch("/api/admin/newsletter/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "下書き保存に失敗しました。");
      }

      setSubmitState("success");
      setMessage(result.message ?? "キャンペーン下書きを保存しました。");
      form.reset();
      router.refresh();
      setTimeout(() => router.push("/admin/newsletter/campaigns"), 700);
    } catch (error) {
      setSubmitState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "下書き保存に失敗しました。時間をおいて再度お試しください。"
      );
    }
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const isSubmitting = submitState === "submitting";

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="キャンペーン作成"
        description="メールマガジンの原稿を下書きとして保存します。本配信・テスト送信は次のPhaseで追加します。"
      />

      <form
        className="mt-6 space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={submit}
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
          <label htmlFor="campaign-name" className="text-sm font-semibold">
            キャンペーン名 <span className="text-rose-600">必須</span>
          </label>
          <input
            id="campaign-name"
            name="name"
            required
            className={inputClass}
            placeholder="例：7月のHitoriBIZニュース"
          />
        </div>

        <div>
          <label htmlFor="subject" className="text-sm font-semibold">
            メール件名 <span className="text-rose-600">必須</span>
          </label>
          <input
            id="subject"
            name="subject"
            required
            className={inputClass}
            placeholder="受信トレイに表示される件名"
          />
        </div>

        <div>
          <label htmlFor="preview" className="text-sm font-semibold">
            プレビュー文
          </label>
          <input
            id="preview"
            name="previewText"
            className={inputClass}
            placeholder="件名の横に表示される短い説明"
          />
        </div>

        <div>
          <label htmlFor="body" className="text-sm font-semibold">
            本文 <span className="text-rose-600">必須</span>
          </label>
          <textarea
            id="body"
            name="body"
            required
            rows={14}
            className={inputClass}
            placeholder="メール本文を入力してください。HTMLメール化やテンプレート化は次のPhaseで追加します。"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="test-email" className="text-sm font-semibold">
              テスト送信先
            </label>
            <input
              id="test-email"
              type="email"
              className={inputClass}
              placeholder="test@example.com"
              disabled
            />
            <p className="mt-2 text-xs text-slate-500">
              テスト送信は次のPhaseで実装します。
            </p>
          </div>
          <div>
            <label htmlFor="scheduled-at" className="text-sm font-semibold">
              配信予定日時メモ
            </label>
            <input
              id="scheduled-at"
              name="scheduledAt"
              type="datetime-local"
              className={inputClass}
            />
            <p className="mt-2 text-xs text-slate-500">
              今回は下書き内の予定日時として保存します。自動配信予約は未実装です。
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-7 text-blue-900">
          対象タグ選択、テスト送信、本配信は次のPhaseで追加します。現時点では原稿を安全に保存し、一覧で確認できる状態を優先しています。
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "保存中..." : "下書き保存"}
          </button>
          <button
            type="button"
            disabled
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 opacity-60"
          >
            テスト送信（次Phase）
          </button>
          <button
            type="button"
            disabled
            className="rounded-lg border border-rose-300 px-5 py-2.5 text-sm font-semibold text-rose-700 opacity-60"
          >
            本配信（次Phase）
          </button>
        </div>
      </form>
    </div>
  );
}
