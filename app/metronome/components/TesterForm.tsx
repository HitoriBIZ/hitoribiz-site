"use client";

import { useMemo, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";
type Lang = "ja" | "en";

type FormState = {
  email: string;
  name: string;
  instrument: string;
  platform: "ios" | "android" | "both" | "unknown";
  experience: "pro" | "hobby" | "student" | "other";
  notes: string;
  consent: boolean;
};

type TesterFormProps = {
  lang?: Lang;
};

const text = {
  ja: {
    emailLabel: "メールアドレス（必須）",
    emailPlaceholder: "example@gmail.com",
    nameLabel: "お名前（任意）",
    namePlaceholder: "音楽太郎",
    instrumentLabel: "主な楽器（任意）",
    instrumentPlaceholder: "Violin / Flute / Piano など",
    platformLabel: "利用端末（任意）",
    experienceLabel: "演奏経験（任意）",
    notesLabel: "要望・フィードバック（任意）",
    notesPlaceholder:
      "例：暗い場所でも見やすい配色が良い、BPMの微調整が欲しい、など",
    consentLabel:
      "テスター募集・連絡の目的でのみ利用されることに同意します。（必須）",
    consentNote: "※送信するには、同意チェックが必要です。",
    submit: "無料テスター登録する",
    submitting: "送信中...",
    success: "登録ありがとうございます。ご案内メールをお送りします。",
    duplicate:
      "すでにご登録いただいております。\n公開開始まで今しばらくお待ちください。",
    genericError: "送信に失敗しました。時間をおいて再度お試しください。",
    fallbackError: "送信に失敗しました。",
    platform_ios: "iPhone / iPad（iOS）",
    platform_android: "Android",
    platform_both: "両方",
    platform_unknown: "未定",
    exp_pro: "プロ/セミプロ",
    exp_hobby: "アマチュア/趣味",
    exp_student: "学生",
    exp_other: "その他",
  },
  en: {
    emailLabel: "Email (Required)",
    emailPlaceholder: "example@gmail.com",
    nameLabel: "Name (Optional)",
    namePlaceholder: "Taro Musician",
    instrumentLabel: "Main Instrument (Optional)",
    instrumentPlaceholder: "Violin / Flute / Piano etc.",
    platformLabel: "Device (Optional)",
    experienceLabel: "Experience (Optional)",
    notesLabel: "Requests / Feedback (Optional)",
    notesPlaceholder:
      "Example: I want a color scheme that is easy to see in dark places, or finer BPM adjustment.",
    consentLabel:
      "I agree that my information will be used only for tester registration and related communication. (Required)",
    consentNote: "*Consent is required before submitting.",
    submit: "Join Free Beta Testing",
    submitting: "Submitting...",
    success: "Thank you for registering. A confirmation email has been sent.",
    duplicate:
      "You are already registered.\nPlease wait a little longer for the release announcement.",
    genericError: "Submission failed. Please try again later.",
    fallbackError: "Submission failed.",
    platform_ios: "iPhone / iPad (iOS)",
    platform_android: "Android",
    platform_both: "Both",
    platform_unknown: "Not decided yet",
    exp_pro: "Professional / Semi-professional",
    exp_hobby: "Amateur / Hobby",
    exp_student: "Student",
    exp_other: "Other",
  },
};

export default function TesterForm({ lang = "ja" }: TesterFormProps) {
  const t = text[lang];

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  const [form, setForm] = useState<FormState>({
    email: "",
    name: "",
    instrument: "",
    platform: "ios",
    experience: "hobby",
    notes: "",
    consent: false,
  });

  const canSubmit = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    return emailOk && form.consent && status !== "loading";
  }, [form.email, form.consent, status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/testers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          instrument: form.instrument,
          platform: form.platform,
          experience: form.experience,
          notes: form.notes,
          lang: lang,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));

        if (typeof data?.error === "string" && data.error.includes("既に")) {
          setStatus("error");
          setMessage(t.duplicate);
          return;
        }

        throw new Error(data?.error || t.genericError);
      }

      setStatus("success");
      setMessage(t.success);

      setForm({
        email: "",
        name: "",
        instrument: "",
        platform: "ios",
        experience: "hobby",
        notes: "",
        consent: false,
      });
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || t.fallbackError);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t.emailLabel}>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder={t.emailPlaceholder}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </Field>

        <Field label={t.nameLabel}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder={t.namePlaceholder}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label={t.instrumentLabel}>
          <input
            type="text"
            value={form.instrument}
            onChange={(e) =>
              setForm((p) => ({ ...p, instrument: e.target.value }))
            }
            placeholder={t.instrumentPlaceholder}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </Field>

        <Field label={t.platformLabel}>
          <select
            value={form.platform}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                platform: e.target.value as FormState["platform"],
              }))
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="ios">{t.platform_ios}</option>
            <option value="android">{t.platform_android}</option>
            <option value="both">{t.platform_both}</option>
            <option value="unknown">{t.platform_unknown}</option>
          </select>
        </Field>

        <Field label={t.experienceLabel}>
          <select
            value={form.experience}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                experience: e.target.value as FormState["experience"],
              }))
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="pro">{t.exp_pro}</option>
            <option value="hobby">{t.exp_hobby}</option>
            <option value="student">{t.exp_student}</option>
            <option value="other">{t.exp_other}</option>
          </select>
        </Field>
      </div>

      <Field label={t.notesLabel}>
        <textarea
          rows={4}
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          placeholder={t.notesPlaceholder}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      </Field>

      <label className="flex items-start gap-3 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => setForm((p) => ({ ...p, consent: e.target.checked }))}
          className="mt-1 h-4 w-4 rounded border-slate-400"
        />
        <span>{t.consentLabel}</span>
      </label>

      {!form.consent && (
        <p className="text-sm text-slate-600">{t.consentNote}</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? t.submitting : t.submit}
        </button>

        {message && (
          <p
            className={`whitespace-pre-line text-sm ${
              status === "success" ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="text-sm font-medium text-slate-700">{label}</div>
      {children}
    </div>
  );
}