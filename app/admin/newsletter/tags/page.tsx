import { mockTags } from "../../../../lib/newsletter/mockData";
import { formatDate, PageHeader } from "../../../components/newsletter/AdminUi";

export default function TagsPage() {
  return <div className="mx-auto max-w-6xl"><PageHeader title="タグ管理" description="読者を関心や接点ごとに分類するためのタグです。" /><div className="mt-6 grid gap-4 md:grid-cols-2">{mockTags.map((tag) => <article key={tag.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="font-bold text-slate-950">{tag.name}</h2><p className="mt-1 font-mono text-xs text-slate-400">{tag.slug}</p></div><span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">{tag.subscriberCount}名</span></div><p className="mt-4 min-h-12 text-sm leading-6 text-slate-600">{tag.description}</p><p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">作成日 {formatDate(tag.createdAt)} ・ 更新日 {formatDate(tag.updatedAt)}</p></article>)}</div><p className="mt-4 text-xs text-slate-500">タグの作成・編集・削除および読者への付与はPhase 2で実装します。</p></div>;
}
