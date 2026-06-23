import Link from "next/link";
import { newsletterConfig } from "../../../lib/newsletter/config";

const links = [
  ["ダッシュボード", "/admin/newsletter"],
  ["読者", "/admin/newsletter/subscribers"],
  ["タグ", "/admin/newsletter/tags"],
  ["キャンペーン", "/admin/newsletter/campaigns"],
  ["CSVインポート", "/admin/newsletter/import"],
] as const;

export default function AdminNav() {
  return (
    <aside className="border-b border-slate-200 bg-slate-950 text-white lg:min-h-[calc(100vh-4rem)] lg:w-64 lg:border-b-0 lg:border-r">
      <div className="px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">HitoriBIZ</p>
        <p className="mt-1 text-lg font-bold">Newsletter 管理</p>
        <p className="mt-2 text-xs text-slate-400">Phase 1 / モックデータ</p>
      </div>
      <nav aria-label="メルマガ管理" className="flex gap-1 overflow-x-auto px-3 pb-4 lg:block lg:space-y-1">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="block whitespace-nowrap rounded-lg px-3 py-2.5 text-sm text-slate-200 transition hover:bg-slate-800 hover:text-white">
            {label}
          </Link>
        ))}
      </nav>
      <div className="hidden border-t border-slate-800 px-5 py-5 text-xs text-slate-400 lg:block">
        送信者: {newsletterConfig.senderName}<br />
        {newsletterConfig.replyTo}
      </div>
    </aside>
  );
}
