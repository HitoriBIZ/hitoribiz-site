"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { newsletterInterests } from "../../lib/newsletter/config";

export default function SubscribeForm() {
  const [submitted, setSubmitted] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmitted(true); }

  if (submitted) return <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"><p className="text-lg font-bold text-emerald-900">ご登録ありがとうございます</p><p className="mt-3 text-sm leading-7 text-emerald-800">Phase 1のため、入力内容は保存・送信されていません。本番運用時には確認メールをお送りします。</p><button type="button" onClick={() => setSubmitted(false)} className="mt-6 text-sm font-semibold text-emerald-800 underline">フォームに戻る</button></div>;

  const inputClass = "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div><label htmlFor="email" className="text-sm font-semibold text-slate-800">メールアドレス <span className="text-rose-600">必須</span></label><input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputClass} /></div>
      <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="name" className="text-sm font-semibold text-slate-800">氏名</label><input id="name" name="name" autoComplete="name" className={inputClass} /></div><div><label htmlFor="company" className="text-sm font-semibold text-slate-800">会社名・屋号</label><input id="company" name="company" autoComplete="organization" className={inputClass} /></div></div>
      <fieldset><legend className="text-sm font-semibold text-slate-800">関心のあるテーマ</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{newsletterInterests.map((interest) => <label key={interest} className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700"><input type="checkbox" name="interests" value={interest} className="h-4 w-4 rounded border-slate-300 text-blue-600" />{interest}</label>)}</div></fieldset>
      <div className="space-y-3 border-t border-slate-200 pt-6"><label className="flex items-start gap-3 text-sm leading-6 text-slate-700"><input type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600" /><span>HitoriBIZからメールマガジンを受け取ることに同意します。<span className="text-rose-600">（必須）</span></span></label><label className="flex items-start gap-3 text-sm leading-6 text-slate-700"><input type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600" /><span><Link href="/privacy" className="font-medium text-blue-700 underline">プライバシーポリシー</Link>に同意します。<span className="text-rose-600">（必須）</span></span></label></div>
      <p className="text-xs leading-6 text-slate-500">いつでも配信停止できます。登録経路と同意日時は、安全な配信管理のため本番運用時に記録します。</p>
      <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">メールマガジンに登録する</button>
    </form>
  );
}
