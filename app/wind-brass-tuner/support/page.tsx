import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wind Brass Tuner Support | HitoriBIZ",
  description:
    "Support information for Wind Brass Tuner by Olive Co., Ltd.",
};

export default function WindBrassTunerSupportPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-sm font-semibold text-sky-700">
            Wind Brass Tuner
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Support</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Help and contact information for the iOS and Android apps by Olive Co., Ltd.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="space-y-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <section>
            <h2 className="text-xl font-semibold">Contact Support</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              For app support, bug reports, App Store questions, or Google Play
              questions, contact us by email at{" "}
              <a
                className="font-semibold text-sky-700 underline underline-offset-4"
                href="mailto:matsumura@hitori-biz.com"
              >
                matsumura@hitori-biz.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Basic Use</h2>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
              <li>Select your instrument transposition.</li>
              <li>Select the target note and A4 reference.</li>
              <li>Tap Start and allow microphone access.</li>
              <li>Play a steady tone and read the Hz and cents display.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Microphone Troubleshooting</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              If the tuner does not respond, confirm that microphone access is
              allowed for Wind Brass Tuner in your iPhone or Android settings.
              Use the app in a quiet place and play one clear sustained note.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Supported Transpositions</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Version 1 supports Concert Pitch, B-flat Instrument, E-flat
              Instrument, and F Instrument modes.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
