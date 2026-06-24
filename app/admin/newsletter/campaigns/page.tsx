import Link from "next/link";
import { listNewsletterCampaigns } from "../../../../lib/newsletter/supabase";
import type { CampaignStatus } from "../../../../lib/newsletter/types";
import {
  formatDate,
  PageHeader,
  StatusBadge,
} from "../../../components/newsletter/AdminUi";
import TestSendForm from "./TestSendForm";

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

export default async function CampaignsPage() {
  const result = await listNewsletterCampaigns();
  const defaultTestEmail = process.env.NEWSLETTER_TEST_EMAIL ?? "";
  const isResendConfigured = Boolean(process.env.RESEND_API_KEY);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="キャンペーン"
        description="作成したメールマガジン原稿と配信ステータスを管理します。"
        action={{
          label: "キャンペーンを作成",
          href: "/admin/newsletter/campaigns/new",
        }}
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/admin/newsletter/campaigns/import-html"
          className="inline-flex rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
        >
          HTMLメルマガを取り込む
        </Link>
      </div>

      {!result.configured ? (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
          Supabase環境変数が未設定のため、キャンペーン実データを表示できません。
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                総数
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {result.campaigns.length.toLocaleString("ja-JP")}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                下書き
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-700">
                {result.campaigns
                  .filter((campaign) => campaign.status === "draft")
                  .length.toLocaleString("ja-JP")}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                配信予約
              </p>
              <p className="mt-2 text-2xl font-bold text-blue-700">
                {result.campaigns
                  .filter((campaign) => campaign.status === "scheduled")
                  .length.toLocaleString("ja-JP")}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                配信済み
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-700">
                {result.campaigns
                  .filter((campaign) => campaign.status === "sent")
                  .length.toLocaleString("ja-JP")}
              </p>
            </div>
          </div>

          {!isResendConfigured ? (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
              ResendのAPIキーが未設定です。実際にテスト送信するには{" "}
              <code className="rounded bg-white/70 px-1 py-0.5">
                RESEND_API_KEY
              </code>{" "}
              を .env.local に設定してください。送信元は未設定の場合、
              Resend公式のテスト送信用アドレスを使います。
            </div>
          ) : null}

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-[1050px] w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                  <tr>
                    {[
                      "キャンペーン",
                      "ステータス",
                      "作成日",
                      "配信予定日時",
                      "送信者",
                      "テスト送信",
                      "配信済み件数",
                    ].map((head) => (
                      <th key={head} className="px-4 py-3 font-semibold">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.campaigns.length ? (
                    result.campaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4">
                          <Link
                            href={`/admin/newsletter/campaigns/${campaign.id}`}
                            className="font-semibold text-slate-900 hover:text-blue-700"
                          >
                            {campaign.name}
                          </Link>
                          <p className="mt-1 text-xs text-slate-500">
                            件名: {campaign.subject}
                          </p>
                          {campaign.preview_text ? (
                            <p className="mt-1 max-w-xl truncate text-xs text-slate-400">
                              {campaign.preview_text}
                            </p>
                          ) : null}
                          <Link
                            href={`/admin/newsletter/campaigns/${campaign.id}`}
                            className="mt-2 inline-flex text-xs font-semibold text-blue-700 hover:text-blue-800"
                          >
                            詳細・編集
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={normalizeStatus(campaign.status)} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                          {formatDate(campaign.created_at, true)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                          {formatDate(campaign.scheduled_at, true)}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {campaign.sender_name}
                          <br />
                          <span className="text-xs text-slate-400">
                            {campaign.reply_to}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <TestSendForm
                            campaignId={campaign.id}
                            defaultTestEmail={defaultTestEmail}
                          />
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-800">
                          {campaign.sent_at ? "確認中" : "0"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-12 text-center text-sm text-slate-500"
                      >
                        まだキャンペーンが作成されていません。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            この画面はSupabaseの campaigns テーブルを表示しています。キャンペーン名から詳細・編集画面へ移動できます。本配信、配信レポートは次のPhaseで追加します。
          </p>
        </>
      )}
    </div>
  );
}
