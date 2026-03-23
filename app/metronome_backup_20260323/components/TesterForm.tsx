"use client";

import { useMemo, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

type FormState = {
  email: string;
  name: string;
  instrument: string;
  platform: "ios" | "android" | "both" | "unknown";
  experience: "pro" | "hobby" | "student" | "other";
  notes: string;
  consent: boolean;
};

export default function TesterForm() {
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
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));

        // 重複登録メッセージを上品に
        if (typeof data?.error === "string" && data.error.includes("既に")) {
          setStatus("error");
          setMessage(
            "すでにご登録いただいております。\n公開開始まで今しばらくお待ちください。"
          );
          return;
        }

        throw new Error(
          data?.error || "送信に失敗しました。時間をおいて再度お試しください。"
        );
      }

      setStatus("success");
      setMessage("登録ありがとうございます。配布準備が整い次第、ご案内します。");

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
      setMessage(err?.message || "送信に失敗しました。");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="メールアドレス（必須）">
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="example@gmail.com"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </Field>

        <Field label="お名前（任意）">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="音楽太郎"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="主な楽器（任意）">
          <input
            type="text"
            value={form.instrument}
            onChange={(e) =>
              setForm((p) => ({ ...p, instrument: e.target.value }))
            }
            placeholder="Violin / Flute / Piano など"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </Field>

        <Field label="利用端末（任意）">
          <select
            value={form.platform}
            onChange={(e) =>
              setForm((p) => ({ ...p, platform: e.target.value as any }))
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="ios">iPhone / iPad（iOS）</option>
            <option value="android">Android</option>
            <option value="both">両方</option>
            <option value="unknown">未定</option>
          </select>
        </Field>

        <Field label="演奏経験（任意）">
          <select
            value={form.experience}
            onChange={(e) =>
              setForm((p) => ({ ...p, experience: e.target.value as any }))
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="pro">プロ/セミプロ</option>
            <option value="hobby">アマチュア/趣味</option>
            <option value="student">学生</option>
            <option value="other">その他</option>
          </select>
        </Field>
      </div>

      <Field label="要望・フィードバック（任意）">
        <textarea
          rows={4}
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          placeholder="例：暗い場所でも見やすい配色が良い、BPMの微調整が欲しい、など"
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
  <span>
    テスター募集・連絡の目的でのみ利用されることに同意します。（必須）
  </span>
</label>

{/* 👇 ここを追加 */}
{!form.consent && (
  <p className="text-sm text-slate-600">
    ※送信するには、同意チェックが必要です。
  </p>
)}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition"
        >
          {status === "loading" ? "送信中..." : "無料テスター登録する"}
        </button>

        {message && (
          <p
            className={`text-sm whitespace-pre-line ${
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