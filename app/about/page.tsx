// app/about/page.tsx
export default function AboutPage() {
  return (
    <main>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            HitoriBIZ の背景
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-700 md:text-base">
            HitoriBIZ は、松村 衆三（Shu Matsumura）が運営する
            小さなデジタル伴走サービスです。
          </p>

          <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">
            IoT コーヒーメーカーの企画・販促、ガラスプロダクト、EC サイト運営、
            デジタルサイネージなど、いくつかのプロジェクトを横断して進める中で、
            「デジタルまわりを一人で抱えている人」が多いと感じてきました。
          </p>

          <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">
            制作会社に頼むほど大きな案件ではないけれど、自分だけでは進めづらい。
            そういった領域を、一緒に整理し、かたちにしていくパートナーとして
            HitoriBIZ を立ち上げています。
          </p>

          <h2 className="mt-8 text-lg font-semibold text-slate-900">
            スタイルについて
          </h2>

          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700 md:text-base">
            <li>・専門用語をできるだけ使わず、噛み砕いて説明します。</li>
            <li>・「こうすべき」ではなく、選択肢を一緒に検討します。</li>
            <li>・一度作って終わりではなく、運用して育てていく前提で考えます。</li>
          </ul>

          <p className="mt-6 text-sm leading-relaxed text-slate-700 md:text-base">
            相談のスタート地点は、ちいさくて大丈夫です。
            「今の状態だと、どこから手をつけたら良いか」を一緒に整理するところから
            始めましょう。
          </p>
        </div>
      </section>
    </main>
  );
}
