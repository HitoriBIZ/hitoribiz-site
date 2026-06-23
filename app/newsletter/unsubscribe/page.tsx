import type { Metadata } from "next";
import Link from "next/link";
import UnsubscribeForm from "./UnsubscribeForm";

export const metadata: Metadata = {
  title: "メールマガジン配信停止 | HitoriBIZ",
  description: "HitoriBIZメールマガジンの配信停止手続きページです。",
};

export default function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams?: { email?: string; token?: string };
}) {
  return (
    <div className="bg-gradient-to-b from-rose-50 to-white px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-700">
            HitoriBIZ Newsletter
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            メールマガジン配信停止
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-600">
            配信停止をご希望の場合は、下記フォームからお手続きください。
          </p>
        </div>

        <UnsubscribeForm
          initialEmail={searchParams?.email ?? ""}
          initialToken={searchParams?.token ?? ""}
        />

        <p className="mt-6 text-center text-sm text-slate-500">
          再登録をご希望の場合は{" "}
          <Link href="/newsletter" className="font-semibold text-blue-700 underline">
            メルマガ登録ページ
          </Link>
          からお申し込みください。
        </p>
      </div>
    </div>
  );
}
