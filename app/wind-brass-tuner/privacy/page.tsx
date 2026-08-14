import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wind Brass Tuner Privacy Policy | HitoriBIZ",
  description:
    "Privacy policy for Wind Brass Tuner by Olive Co., Ltd.",
};

export default function WindBrassTunerPrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-sm font-semibold text-sky-700">
            Wind Brass Tuner
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Effective date: August 14, 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="space-y-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <section>
            <h2 className="text-xl font-semibold">Operator</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Wind Brass Tuner is operated by Olive Co., Ltd. This policy
              explains how the app handles microphone access and personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Microphone Access</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              The app uses the microphone to analyze instrument pitch in real
              time. Microphone audio is processed on your device for tuning
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Audio Handling</h2>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
              <li>Audio is not recorded or saved by the app.</li>
              <li>Audio is not uploaded to a server.</li>
              <li>Audio is not shared with Olive Co., Ltd. or third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Personal Data</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              The current iOS and Android apps do not require an account, do not include
              advertising, does not use third-party analytics, and does not
              track users across apps or websites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              For privacy questions or support requests, contact Olive Co.,
              Ltd. at{" "}
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
            <h2 className="text-xl font-semibold">Policy Updates</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              If the app later adds analytics, cloud features, accounts,
              advertising, or other data collection features, this policy and
              the relevant app-store privacy information will be updated before release.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
