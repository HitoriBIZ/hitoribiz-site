import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "String Tuner Privacy Policy | HitoriBIZ",
  description: "Privacy policy for String Tuner by Olive Co., Ltd.",
};

export default function StringTunerPrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b bg-white"><div className="mx-auto max-w-3xl px-5 py-12">
        <p className="font-semibold text-violet-700">弦楽チューナー / String Tuner</p>
        <h1 className="mt-2 text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-500">Effective date: September 12, 2026</p>
      </div></section>
      <section className="mx-auto max-w-3xl space-y-9 px-5 py-12 leading-7">
        <div><h2 className="text-xl font-bold">Operator / 運営者</h2><p className="mt-3">String Tuner is operated by Olive Co., Ltd. / 弦楽チューナーはOlive Co., Ltd.が運営します。</p></div>
        <div><h2 className="text-xl font-bold">Microphone and audio</h2><p className="mt-3">The app uses the microphone to analyze instrument pitch in real time. Processing takes place only on the device. Audio is not recorded, saved, uploaded, or shared.</p><p className="mt-3">本アプリは楽器の音程をリアルタイムで解析するためにマイクを使用します。処理は端末内だけで行われ、音声の録音、保存、送信、共有は行いません。</p></div>
        <div><h2 className="text-xl font-bold">Data collection / データ収集</h2><p className="mt-3">The app does not require an account, contain advertising, use third-party analytics, or track users. 本アプリはアカウント、広告、第三者解析、ユーザートラッキングを使用しません。</p></div>
        <div><h2 className="text-xl font-bold">Contact</h2><p className="mt-3"><a className="font-semibold text-violet-700 underline" href="mailto:matsumura@hitori-biz.com">matsumura@hitori-biz.com</a></p></div>
        <Link className="text-violet-700 underline" href="/orchestra-tuner">Back to product page</Link>
      </section>
    </main>
  );
}
