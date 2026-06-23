"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SupabaseCampaignRow } from "../../../../../lib/newsletter/supabase";
import TestSendForm from "../TestSendForm";

type SubmitState = "idle" | "submitting" | "success" | "error";

type CampaignEditFormProps = {
  campaign: SupabaseCampaignRow;
  defaultTestEmail?: string;
};

function toDateTimeLocalValue(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export default function CampaignEditForm({
  campaign,
  defaultTestEmail = "",
}: CampaignEditFormProps) {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const scheduledAtDefaultValue = useMemo(
    () => toDateTimeLocalValue(campaign.scheduled_at),
    [campaign.scheduled_at]
  );
  const isDraft = campaign.status === "draft";
  const isSubmitting = submitState === "submitting";
  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500";

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
      const response = await fetch(
        `/api/admin/newsletter/campaigns/${campaign.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "下書き更新に失敗しました。");
      }

      setSubmitState("success");
      setMessage(result.message ?? "キャンペーン下書きを更新しました。");
      router.refresh();
    } catch (error) {
      setSubmitState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "下書き更新に失敗しました。時間をおいて再度お試しください。"
      );
    }
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
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

        {!isDraft ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
            このキャンペーンは下書きではないため編集できません。内容確認とテスト送信のみ利用できます。
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
            defaultValue={campaign.name}
            disabled={!isDraft}
            className={inputClass}
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
            defaultValue={campaign.subject}
            disabled={!isDraft}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="preview" className="text-sm font-semibold">
            プレビュー文
          </label>
          <input
            id="preview"
            name="previewText"
            defaultValue={campaign.preview_text}
            disabled={!isDraft}
            className={inputClass}
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
            rows={18}
            defaultValue={campaign.body}
            disabled={!isDraft}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="scheduled-at" className="text-sm font-semibold">
            配信予定日時メモ
          </label>
          <input
            id="scheduled-at"
            name="scheduledAt"
            type="datetime-local"
            defaultValue={scheduledAtDefaultValue}
            disabled={!isDraft}
            className={inputClass}
          />
          <p className="mt-2 text-xs text-slate-500">
            現時点では予定日時メモとして保存します。自動配信予約は未実装です。
          </p>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
          <button
            type="submit"
            disabled={!isDraft || isSubmitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "保存中..." : "変更を保存"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/newsletter/campaigns")}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            一覧へ戻る
          </button>
        </div>
      </form>

      <aside className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-950">テスト送信</h2>
          <p className="mt-2 text-xs leading-6 text-slate-500">
            保存済みの内容で、指定したメールアドレスへ1通だけ送信します。本配信ではありません。
          </p>
          <div className="mt-4">
            <TestSendForm
              campaignId={campaign.id}
              defaultTestEmail={defaultTestEmail}
            />
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-sm leading-7 text-blue-900">
          本配信ボタンはまだ追加していません。次の段階で、active読者のみ・配信停止者除外・最終確認画面を入れてから実装します。
        </div>
      </aside>
    </div>
  );
}
