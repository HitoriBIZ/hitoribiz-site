import Link from "next/link";
import { notFound } from "next/navigation";
import { newsletterConfig } from "../../../../../../lib/newsletter/config";
import {
  getNewsletterCampaign,
  getNewsletterDeliveryPreviewStats,
  isNewsletterDatabaseConfigured,
} from "../../../../../../lib/newsletter/supabase";
import type { CampaignStatus } from "../../../../../../lib/newsletter/types";
import {
  formatDate,
  PageHeader,
  StatusBadge,
} from "../../../../../components/newsletter/AdminUi";

export const dynamic = "force-dynamic";

function normalizeStatus(status: string): CampaignStatus {
  if (
    status === "draft" ||
    status === "scheduled" ||
    status === "sending" ||
    status === "sent" ||
    status === "cancelled"
  ) {
    return status;
  }

  return "draft";
}

function StatBox({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: number;
  tone?: "slate" | "blue" | "emerald" | "rose";
}) {
  const toneClass =
    tone === "blue"
      ? "text-blue-700"
      : tone === "emerald"
        ? "text-emerald-700"
        : tone === "rose"
          ? "text-rose-700"
          : "text-slate-950";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold ${toneClass}`}>
        {value.toLocaleString("ja-JP")}
      </p>
    </div>
  );
}

export default async function CampaignConfirmPage({
  params,
}: {
  params: { id: string };
}) {
  const configured = isNewsletterDatabaseConfigured();

  if (!configured) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader
          title="本配信前の最終確認"
          description="Supabase環境変数が未設定のため、配信対象を確認できません。"
        />
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
          SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を .env.local に設定してください。
        </div>
      </div>
    );
  }

  const [campaign, stats] = await Promise.all([
    getNewsletterCampaign(params.id),
    getNewsletterDeliveryPreviewStats(),
  ]);

  if (!campaign) {
    notFound();
  }

  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "HitoriBIZ <onboarding@resend.dev>";
  const replyTo = process.env.RESEND_REPLY_TO ?? newsletterConfig.replyTo;
  const canProceed =
    campaign.status === "draft" &&
    stats.activeSubscribers > 0 &&
    Boolean(process.env.RESEND_API_KEY);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="本配信前の最終確認"
        description="本配信の前に、対象読者数・除外者・送信元・件名・本文を確認します。まだ送信は実行しません。"
      />

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
        <Link
          href={`/admin/newsletter/campaigns/${campaign.id}`}
          className="font-semibold text-blue-700 hover:text-blue-800"
        >
          ← 詳細・編集へ戻る
        </Link>
        <StatusBadge status={normalizeStatus(campaign.status)} />
        <span className="text-slate-500">
          更新: {formatDate(campaign.updated_at, true)}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <StatBox
          label="配信予定読者"
          value={stats.activeSubscribers}
          tone="emerald"
        />
        <StatBox
          label="配信停止者"
          value={stats.unsubscribedSubscribers}
          tone="rose"
        />
        <StatBox
          label="除外合計"
          value={stats.excludedSubscribers}
          tone="blue"
        />
        <StatBox label="読者総数" value={stats.totalSubscribers} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">送信内容</h2>
            <dl className="mt-5 grid gap-4 text-sm">
              <div>
                <dt className="font-semibold text-slate-600">キャンペーン名</dt>
                <dd className="mt-1 text-slate-950">{campaign.name}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-600">メール件名</dt>
                <dd className="mt-1 text-slate-950">{campaign.subject}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-600">プレビュー文</dt>
                <dd className="mt-1 text-slate-950">
                  {campaign.preview_text || "—"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-600">配信予定日時メモ</dt>
                <dd className="mt-1 text-slate-950">
                  {formatDate(campaign.scheduled_at, true)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">本文プレビュー</h2>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-800">
                {campaign.body}
              </pre>
            </div>
          </section>
        </main>

        <aside className="space-y-4">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">送信設定</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-slate-600">送信元</dt>
                <dd className="mt-1 break-words text-slate-950">{fromEmail}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-600">返信先</dt>
                <dd className="mt-1 break-words text-slate-950">{replyTo}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-600">対象条件</dt>
                <dd className="mt-1 text-slate-950">
                  status が active の読者のみ
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-600">除外条件</dt>
                <dd className="mt-1 text-slate-950">
                  配信停止・エラー・停止中の読者
                </dd>
              </div>
            </dl>
          </section>

          <section
            className={`rounded-xl border p-5 text-sm leading-7 shadow-sm ${
              canProceed
                ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                : "border-amber-200 bg-amber-50 text-amber-950"
            }`}
          >
            <h2 className="font-bold">
              {canProceed ? "本配信準備OK" : "本配信前に確認が必要です"}
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                {process.env.RESEND_API_KEY
                  ? "Resend APIキーは設定済みです。"
                  : "Resend APIキーが未設定です。"}
              </li>
              <li>
                {campaign.status === "draft"
                  ? "キャンペーンは下書き状態です。"
                  : "下書き以外のキャンペーンです。"}
              </li>
              <li>
                {stats.activeSubscribers > 0
                  ? "配信対象読者がいます。"
                  : "配信対象読者が0件です。"}
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm leading-7 text-rose-950 shadow-sm">
            <h2 className="font-bold">安全のため、まだ送信しません</h2>
            <p className="mt-2">
              この画面は最終確認用です。次のステップで、本配信ボタン、二重確認、配信履歴保存、失敗時の記録を追加します。
            </p>
            <button
              type="button"
              disabled
              className="mt-4 w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white opacity-50"
            >
              本配信する（次ステップで実装）
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
