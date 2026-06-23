import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getNewsletterCampaign,
  isNewsletterDatabaseConfigured,
} from "../../../../../lib/newsletter/supabase";
import type { CampaignStatus } from "../../../../../lib/newsletter/types";
import {
  formatDate,
  PageHeader,
  StatusBadge,
} from "../../../../components/newsletter/AdminUi";
import CampaignEditForm from "./CampaignEditForm";

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

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const configured = isNewsletterDatabaseConfigured();

  if (!configured) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader
          title="キャンペーン詳細"
          description="Supabase環境変数が未設定のため、キャンペーンを表示できません。"
        />
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
          SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を .env.local に設定してください。
        </div>
      </div>
    );
  }

  const campaign = await getNewsletterCampaign(params.id);

  if (!campaign) {
    notFound();
  }

  const defaultTestEmail = process.env.NEWSLETTER_TEST_EMAIL ?? "";

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="キャンペーン詳細・編集"
        description="下書きキャンペーンの内容を確認・編集し、保存済み内容をテスト送信できます。"
      />

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
        <Link
          href="/admin/newsletter/campaigns"
          className="font-semibold text-blue-700 hover:text-blue-800"
        >
          ← キャンペーン一覧へ戻る
        </Link>
        <StatusBadge status={normalizeStatus(campaign.status)} />
        <span className="text-slate-500">
          作成: {formatDate(campaign.created_at, true)}
        </span>
        <span className="text-slate-500">
          更新: {formatDate(campaign.updated_at, true)}
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            送信者
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {campaign.sender_name}
          </p>
          <p className="mt-1 text-xs text-slate-500">{campaign.reply_to}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            配信予定日時
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {formatDate(campaign.scheduled_at, true)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            配信日時
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {formatDate(campaign.sent_at, true)}
          </p>
        </div>
      </div>

      <CampaignEditForm
        campaign={campaign}
        defaultTestEmail={defaultTestEmail}
      />
    </div>
  );
}
