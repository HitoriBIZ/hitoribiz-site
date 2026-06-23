import Link from "next/link";
import type { CampaignStatus, SubscriberStatus } from "../../../lib/newsletter/types";

export function PageHeader({ title, description, action }: { title: string; description: string; action?: { label: string; href: string } }) {
  return <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h1><p className="mt-2 text-sm text-slate-600">{description}</p></div>{action && <Link href={action.href} className="inline-flex w-fit items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{action.label}</Link>}</div>;
}

export function StatCard({ label, value, note }: { label: string; value: number; note?: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-medium text-slate-600">{label}</p><p className="mt-2 text-3xl font-bold text-slate-950">{value.toLocaleString("ja-JP")}</p>{note && <p className="mt-2 text-xs text-slate-500">{note}</p>}</div>;
}

const labels: Record<SubscriberStatus | CampaignStatus, string> = { active: "配信中", unsubscribed: "配信停止", bounced: "エラー", inactive: "停止中", draft: "下書き", scheduled: "配信予定", sending: "配信中", sent: "配信済み", cancelled: "キャンセル" };

export function StatusBadge({ status }: { status: SubscriberStatus | CampaignStatus }) {
  const tone = status === "active" || status === "sent" ? "bg-emerald-50 text-emerald-700" : status === "scheduled" || status === "sending" ? "bg-blue-50 text-blue-700" : status === "unsubscribed" || status === "cancelled" || status === "bounced" ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-700";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{labels[status]}</span>;
}

export function formatDate(value: string | null, withTime = false) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}) }).format(new Date(value));
}
