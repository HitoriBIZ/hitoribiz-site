import type { Metadata } from "next";
import SubscribeForm from "./SubscribeForm";

export const metadata: Metadata = { title: "メールマガジン登録 | HitoriBIZ", description: "AI、Web制作、音楽関連サービスの実用的な情報をお届けします。" };

export default function NewsletterPage() {
  return <div className="bg-gradient-to-b from-blue-50 to-white px-4 py-14 sm:py-20"><div className="mx-auto max-w-3xl"><div className="mb-10 text-center"><p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">HitoriBIZ Newsletter</p><h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">仕事とアイデアに役立つ、小さな便り</h1><p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">AI活用、Web制作、Orchestra ToolsやScore Readerなど、HitoriBIZの活動から生まれた実用的な情報をお届けします。</p></div><SubscribeForm /><p className="mt-6 text-center text-xs text-slate-500">現在はPhase 1の画面確認用です。フォームから実データは送信されません。</p></div></div>;
}
