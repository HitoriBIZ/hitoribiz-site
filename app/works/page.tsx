// app/works/page.tsx
import Image from "next/image";
import Link from "next/link";

const works = [
  {
    title: "HitoriBIZ 公式サイト",
    purpose: "ひとりビジネスの全体像を、わかりやすく伝える",
    points: [
      "スマホでも読みやすい構成",
      "Blog・相談予約への導線設計",
      "必要な情報を迷わず届けるUI",
    ],
    status: "運用中",
  },
  {
  title: "Crystal VantVert .com（準備中）",
  purpose: "クリスタルアクセサリー工房の世界観を伝える",
  points: [
    "ストーリー重視の構成",
    "作品と想いを丁寧に紹介",
  ],
},
];

export default function WorksPage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:py-14">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Works
            </h1>
            <p className="mt-4 max-w-xl text-slate-600">
              HitoriBIZで取り組んできた制作・支援の事例をご紹介します。
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/hero-kaito.png"
              alt="Kaitoくん"
              width={420}
              height={420}
              priority
            />
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {works.map((work, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 p-6"
            >
              <h2 className="text-xl font-semibold">{work.title}</h2>
              <p className="mt-2 text-slate-600">{work.purpose}</p>
              <ul className="mt-4 list-disc pl-5 text-slate-600">
                {work.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate-500">
                状態：{work.status}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/booking"
            className="inline-block rounded-md bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
          >
            オンライン相談のご予約（30分・無料）
          </Link>
        </div>
      </section>
    </main>
  );
}
