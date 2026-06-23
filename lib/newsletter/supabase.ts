import { newsletterConfig } from "./config";

type SubscribeInput = {
  email: string;
  name: string;
  companyName: string;
  interests: string[];
  consentSource: string;
  consentAt: string;
};

type SupabaseSubscriberRow = {
  id: string;
  email: string;
  name: string;
  company_name: string;
  interests: string[];
  status: string;
  consent_source: string;
  consent_at: string;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
};

export function getSupabaseConfig() {
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";

  if (!url || !key) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    key,
  };
}

export function isNewsletterDatabaseConfigured() {
  return getSupabaseConfig() !== null;
}

export async function upsertNewsletterSubscriber(input: SubscribeInput) {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error(
      "Supabaseの環境変数が未設定です。SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください。"
    );
  }

  const now = new Date().toISOString();
  const response = await fetch(
    `${config.url}/rest/v1/subscribers?on_conflict=email`,
    {
      method: "POST",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify({
        email: input.email.toLowerCase(),
        name: input.name,
        company_name: input.companyName,
        interests: input.interests,
        status: "active",
        consent_source: input.consentSource,
        consent_at: input.consentAt,
        unsubscribed_at: null,
        updated_at: now,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `${newsletterConfig.serviceName}の読者保存に失敗しました。${errorText}`
    );
  }

  const rows = (await response.json()) as SupabaseSubscriberRow[];
  return rows[0] ?? null;
}

export async function listNewsletterSubscribers() {
  const config = getSupabaseConfig();

  if (!config) {
    return {
      configured: false as const,
      subscribers: [],
    };
  }

  const response = await fetch(
    `${config.url}/rest/v1/subscribers?select=id,email,name,company_name,interests,status,consent_source,consent_at,unsubscribed_at,created_at,updated_at&order=created_at.desc`,
    {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`読者一覧の取得に失敗しました。${errorText}`);
  }

  const subscribers = (await response.json()) as SupabaseSubscriberRow[];

  return {
    configured: true as const,
    subscribers,
  };
}
