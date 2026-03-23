// app/metronome/page.tsx
import Image from "next/image";
import TesterForm from "./components/TesterForm";

export default function MetronomePage() {
  return (
    <main className="bg-black">
      {/* HERO SECTION */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden text-white">
        {/* 背景画像 */}
        <div className="absolute inset-0">
          <Image
            src="/images/metronome-hero-stage.jpg"
            alt="Orchestra Metronome Stage"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* テキスト */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-wide">
            Orchestra Metronome
          </h1>

          <p className="text-lg md:text-2xl mb-8 leading-relaxed text-gray-200">
            舞台で、本当に使えるテンポ設計。<br />
            練習と本番をつなぐ、新しいリズム体験。
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="#tester"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-xl text-lg transition"
            >
              公開通知を受け取る（無料）
            </a>

            <div className="border border-gray-400 px-8 py-4 rounded-xl text-gray-300">
              App Store（近日公開）
            </div>

            <div className="border border-gray-400 px-8 py-4 rounded-xl text-gray-300">
              Google Play（近日公開）
            </div>
          </div>

          <p className="text-sm text-gray-400 mt-6">
            ※公開日は審査状況により前後する場合があります。
          </p>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="py-20 bg-white text-gray-800 text-center px-6">
        <h2 className="text-3xl font-bold mb-10">アプリの特長</h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-lg">
          <div>✓ 大きく見やすい BPM 表示</div>
          <div>✓ 舞台照明下でも視認性の高いUI</div>
          <div>✓ テンポ微調整・拍子設定対応</div>
          <div>✓ 本番を想定したシンプル設計</div>
        </div>
      </section>

      {/* TESTER SECTION */}
      <section id="tester" className="py-20 bg-gray-100 px-6 text-gray-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            無料テスター登録・公開通知
          </h2>

          <p className="text-center mb-10 text-gray-600">
            App Store / Google Play 公開開始時に優先案内します。
          </p>

          <TesterForm />
        </div>
      </section>
    </main>
  );
}