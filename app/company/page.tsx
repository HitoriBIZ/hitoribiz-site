import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "\u4f1a\u793e\u60c5\u5831 | HitoriBIZ",
  description:
    "HitoriBIZ\u3092\u904b\u55b6\u3059\u308b\u6709\u9650\u4f1a\u793e\u30aa\u30ea\u30fc\u30d6\u306e\u4f1a\u793e\u60c5\u5831\u3092\u3054\u6848\u5185\u3057\u307e\u3059\u3002",
};

const companyDetails = [
  ["\u4f1a\u793e\u540d", "\u6709\u9650\u4f1a\u793e\u30aa\u30ea\u30fc\u30d6"],
  ["\u82f1\u6587\u793e\u540d", "Olive Co., Ltd."],
  ["\u4ee3\u8868\u8005", "\u677e\u6751 \u79c0\u4e09"],
  ["\u6240\u5728\u5730", "\u3012215-0003 \u795e\u5948\u5ddd\u770c\u5ddd\u5d0e\u5e02\u9ebb\u751f\u533a\u9ad8\u77f31-17-11"],
  ["\u96fb\u8a71\u756a\u53f7", "090-8645-9908"],
  ["\u30e1\u30fc\u30eb", "matsumura@hitori-biz.com"],
  [
    "\u4e8b\u696d\u5185\u5bb9",
    "Web\u30b5\u30a4\u30c8\u30fbEC\u30b5\u30a4\u30c8\u5236\u4f5c\u3001AI\u6d3b\u7528\u30fb\u696d\u52d9\u52b9\u7387\u5316\u652f\u63f4\u3001\u30c7\u30b8\u30bf\u30eb\u30b5\u30fc\u30d3\u30b9\u30fb\u30a2\u30d7\u30ea\u958b\u767a",
  ],
];

export default function CompanyPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <p className="text-xs font-semibold tracking-[0.25em] text-slate-500">
            COMPANY
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {"\u4f1a\u793e\u60c5\u5831"}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700">
            {"HitoriBIZ\u306f\u3001\u6709\u9650\u4f1a\u793e\u30aa\u30ea\u30fc\u30d6\u304c\u904b\u55b6\u3059\u308b\u30c7\u30b8\u30bf\u30eb\u30d3\u30b8\u30cd\u30b9\u652f\u63f4\u30b5\u30fc\u30d3\u30b9\u3067\u3059\u3002"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <dl>
            {companyDetails.map(([label, value], index) => (
              <div
                key={label}
                className={`grid gap-2 px-5 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6 sm:px-8 ${
                  index === 0 ? "" : "border-t border-slate-200"
                }`}
              >
                <dt className="text-sm font-semibold text-slate-900">
                  {label}
                </dt>
                <dd className="text-sm leading-6 text-slate-700">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 rounded-2xl bg-slate-50 px-6 py-8 sm:px-8">
          <h2 className="text-xl font-bold tracking-tight">{"\u304a\u554f\u3044\u5408\u308f\u305b"}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {"\u30b5\u30fc\u30d3\u30b9\u3084\u304a\u4ed5\u4e8b\u306e\u3054\u76f8\u8ac7\u306f\u3001\u304a\u554f\u3044\u5408\u308f\u305b\u30da\u30fc\u30b8\u304b\u3089\u3054\u9023\u7d61\u304f\u3060\u3055\u3044\u3002"}
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            {"\u304a\u554f\u3044\u5408\u308f\u305b"}
          </Link>
        </div>
      </section>
    </main>
  );
}
