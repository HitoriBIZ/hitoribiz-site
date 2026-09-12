import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "String Tuner Support | HitoriBIZ",
  description: "Support for the String Tuner iOS app by Olive Co., Ltd.",
};

export default function StringTunerSupportPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b bg-white"><div className="mx-auto max-w-3xl px-5 py-12">
        <p className="font-semibold text-violet-700">弦楽チューナー / String Tuner</p>
        <h1 className="mt-2 text-4xl font-bold">Support / サポート</h1>
      </div></section>
      <section className="mx-auto max-w-3xl space-y-9 px-5 py-12">
        <div><h2 className="text-xl font-bold">Contact / お問い合わせ</h2><p className="mt-3 leading-7">不具合、ご質問、ご要望は <a className="font-semibold text-violet-700 underline" href="mailto:matsumura@hitori-biz.com">matsumura@hitori-biz.com</a> へお送りください。<br />For support, bug reports, or feedback, contact the email address above.</p></div>
        <div><h2 className="text-xl font-bold">Basic Use / 基本操作</h2><ol className="mt-3 list-decimal space-y-2 pl-6 leading-7"><li>Violin、Viola、Celloから楽器を選びます。</li><li>調弦する開放弦とA4基準値を選びます。</li><li>「聴く」をタップしてマイクを許可します。</li><li>開放弦を長く弾き、セント表示を確認します。</li></ol></div>
        <div><h2 className="text-xl font-bold">Microphone / マイク</h2><p className="mt-3 leading-7">反応しない場合は、iPhoneまたはiPadの「設定」で弦楽チューナーのマイクを許可してください。基準音の再生中はマイク検出が停止します。</p></div>
        <div className="flex gap-5"><Link className="text-violet-700 underline" href="/orchestra-tuner">Product</Link><Link className="text-violet-700 underline" href="/orchestra-tuner/privacy">Privacy</Link></div>
      </section>
    </main>
  );
}
