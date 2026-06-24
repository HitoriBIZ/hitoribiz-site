"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../../../components/newsletter/AdminUi";

type SubmitState = "idle" | "reading" | "submitting" | "success" | "error";

function extractTitleFromHtml(html: string) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const rawTitle = titleMatch?.[1] ?? h1Match?.[1] ?? "";

  return rawTitle.replace(/<[^>]+>/g, "").trim();
}

function extractPreviewTextFromHtml(html: string) {
  const hiddenDivMatch = html.match(
    /<div[^>]*display\s*:\s*none[^>]*>([\s\S]*?)<\/div>/i
  );
  const metaDescriptionMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i
  );
  const rawPreview = hiddenDivMatch?.[1] ?? metaDescriptionMatch?.[1] ?? "";

  return rawPreview
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

function buildDefaultCampaignName(fileName: string) {
  return fileName.replace(/\.html?$/i, "");
}

export default function ImportHtmlCampaignPage() {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [htmlBody, setHtmlBody] = useState("");
  const [fileName, setFileName] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");

  async function readHtmlFile(file: File) {
    setSubmitState("reading");
    setMessage("");

    const html = await file.text();
    const title = extractTitleFromHtml(html) || "公演スケジュールニュース";
    const preview =
      extractPreviewTextFromHtml(html) ||
      "クラシック、ジャズ、ロックの注目公演をお届けします。";

    setFileName(file.name);
    setHtmlBody(html);
    setCampaignName(buildDefaultCampaignName(file.name));
    setSubject(title);
    setPreviewText(preview);
    setSubmitState("idle");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");

    if (!htmlBody.trim()) {
      setSubmitState("error");
      setMessage("HTMLファイルを選択してください。");
      return;
    }

    const payload = {
      name: campaignName,
      subject,
      previewText,
      body: htmlBody,
      scheduledAt: "",
    };

    try {
      const response = await fetch("/api/admin/newsletter/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        message?: string;
        campaignId?: string | null;
      };

      if (!response.ok) {
        throw new Error(result.message ?? "HTML下書きの作成に失敗しました。");
      }

      setSubmitState("success");
      setMessage(result.message ?? "HTMLメルマガを下書きとして取り込みました。");
      router.refresh();

      if (result.campaignId) {
        setTimeout(
          () => router.push(`/admin/newsletter/campaigns/${result.campaignId}`),
          700
        );
      }
    } catch (error) {
      setSubmitState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "HTML下書きの作成に失敗しました。"
      );
    }
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const isBusy = submitState === "reading" || submitState === "submitting";

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="HTMLメルマガ取り込み"
        description="Google DriveからダウンロードしたHTMLメルマガを、キャンペーン下書きとして取り込みます。"
      />

      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5 text-sm leading-7 text-blue-900">
        Google DriveのHTMLファイルを開き、ダウンロードした `.html` ファイルをここで選択してください。
        取り込んだHTMLは、Resendテスト送信時にHTMLメールとして送信されます。
      </div>

      <form
        onSubmit={submit}
        className="mt-6 space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
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
          <label htmlFor="html-file" className="text-sm font-semibold">
            HTMLファイル <span className="text-rose-600">必須</span>
          </label>
          <input
            id="html-file"
            type="file"
            accept=".html,.htm,text/html"
            disabled={isBusy}
            className={inputClass}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void readHtmlFile(file);
              }
            }}
          />
          {fileName ? (
            <p className="mt-2 text-xs text-slate-500">
              選択中: {fileName} / {htmlBody.length.toLocaleString("ja-JP")}文字
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="campaign-name" className="text-sm font-semibold">
            キャンペーン名 <span className="text-rose-600">必須</span>
          </label>
          <input
            id="campaign-name"
            value={campaignName}
            onChange={(event) => setCampaignName(event.target.value)}
            required
            className={inputClass}
            placeholder="例：2026-06-23-公演スケジュールニュース-テスト版"
          />
        </div>

        <div>
          <label htmlFor="subject" className="text-sm font-semibold">
            メール件名 <span className="text-rose-600">必須</span>
          </label>
          <input
            id="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            required
            className={inputClass}
            placeholder="例：公演スケジュールニュース"
          />
        </div>

        <div>
          <label htmlFor="preview" className="text-sm font-semibold">
            プレビュー文
          </label>
          <input
            id="preview"
            value={previewText}
            onChange={(event) => setPreviewText(event.target.value)}
            className={inputClass}
            placeholder="受信トレイに表示される短い説明"
          />
        </div>

        <div>
          <label htmlFor="html-preview" className="text-sm font-semibold">
            HTML本文プレビュー
          </label>
          <textarea
            id="html-preview"
            value={htmlBody}
            onChange={(event) => setHtmlBody(event.target.value)}
            rows={12}
            className={`${inputClass} font-mono`}
            placeholder="HTMLファイルを選択すると、ここに本文が入ります。"
          />
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
          <button
            type="submit"
            disabled={isBusy}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {submitState === "submitting"
              ? "取り込み中..."
              : "HTML下書きを作成"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/newsletter/campaigns")}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            キャンペーン一覧へ戻る
          </button>
        </div>
      </form>
    </div>
  );
}
