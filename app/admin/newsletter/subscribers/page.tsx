import { listNewsletterSubscribers } from "../../../../lib/newsletter/supabase";
import type { SubscriberStatus } from "../../../../lib/newsletter/types";
import {
  formatDate,
  PageHeader,
  StatusBadge,
} from "../../../components/newsletter/AdminUi";

export const dynamic = "force-dynamic";

function normalizeStatus(status: string): SubscriberStatus {
  if (
    status === "active" ||
    status === "unsubscribed" ||
    status === "bounced" ||
    status === "inactive"
  ) {
    return status;
  }

  return "inactive";
}

export default async function SubscribersPage() {
  const result = await listNewsletterSubscribers();

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="読者一覧"
        description="Supabaseに保存されたメルマガ読者、同意情報、配信ステータスを確認します。"
      />

      {!result.configured ? (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
          Supabase環境変数が未設定のため、実データを表示できません。
          <code className="mx-1 rounded bg-white px-1.5 py-0.5">
            SUPABASE_URL
          </code>
          と
          <code className="mx-1 rounded bg-white px-1.5 py-0.5">
            SUPABASE_SERVICE_ROLE_KEY
          </code>
          を設定してください。
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                総読者数
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {result.subscribers.length.toLocaleString("ja-JP")}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                配信中
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-700">
                {result.subscribers
                  .filter((subscriber) => subscriber.status === "active")
                  .length.toLocaleString("ja-JP")}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                配信停止
              </p>
              <p className="mt-2 text-2xl font-bold text-rose-700">
                {result.subscribers
                  .filter((subscriber) => subscriber.status === "unsubscribed")
                  .length.toLocaleString("ja-JP")}
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                  <tr>
                    {[
                      "読者",
                      "会社名または屋号",
                      "関心テーマ",
                      "ステータス",
                      "登録日",
                      "同意日時・経路",
                      "更新日",
                    ].map((head) => (
                      <th key={head} className="px-4 py-3 font-semibold">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.subscribers.length ? (
                    result.subscribers.map((subscriber) => (
                      <tr
                        key={subscriber.id}
                        className="align-top hover:bg-slate-50"
                      >
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-900">
                            {subscriber.name || "氏名未登録"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {subscriber.email}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {subscriber.company_name || "—"}
                        </td>
                        <td className="max-w-72 px-4 py-4 text-xs leading-5 text-slate-600">
                          {subscriber.interests.length
                            ? subscriber.interests.join(" / ")
                            : "—"}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge
                            status={normalizeStatus(subscriber.status)}
                          />
                          {subscriber.unsubscribed_at ? (
                            <p className="mt-2 text-xs text-slate-500">
                              停止日: {formatDate(subscriber.unsubscribed_at, true)}
                            </p>
                          ) : null}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                          {formatDate(subscriber.created_at)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600">
                          {formatDate(subscriber.consent_at, true)}
                          <br />
                          <span className="text-slate-400">
                            {subscriber.consent_source}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                          {formatDate(subscriber.updated_at, true)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-12 text-center text-sm text-slate-500"
                      >
                        まだ読者が登録されていません。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            この画面はSupabaseの
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5">
              subscribers
            </code>
            テーブルを直接表示しています。編集、削除、CSV出力は今後のPhaseで追加します。
          </p>
        </>
      )}
    </div>
  );
}
