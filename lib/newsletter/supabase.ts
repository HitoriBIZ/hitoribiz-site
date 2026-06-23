import { newsletterConfig } from "./config";
import type { CampaignStatus } from "./types";

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

type SupabaseUnsubscribeTokenRow = {
  id: string;
  subscriber_id: string;
  expires_at: string | null;
  used_at: string | null;
};

export type SupabaseCampaignRow = {
  id: string;
  name: string;
  subject: string;
  preview_text: string;
  body: string;
  status: CampaignStatus;
  scheduled_at: string | null;
  sent_at: string | null;
  sender_name: string;
  reply_to: string;
  created_at: string;
  updated_at: string;
};

type CreateCampaignDraftInput = {
  name: string;
  subject: string;
  previewText: string;
  body: string;
  scheduledAt: string | null;
};

async function hashUnsubscribeToken(token: string) {
  const data = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

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
  const subscriber = rows[0] ?? null;

  if (subscriber) {
    await createNewsletterUnsubscribeToken(subscriber.id);
  }

  return subscriber;
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

export async function listNewsletterCampaigns() {
  const config = getSupabaseConfig();

  if (!config) {
    return {
      configured: false as const,
      campaigns: [],
    };
  }

  const response = await fetch(
    `${config.url}/rest/v1/campaigns?select=id,name,subject,preview_text,body,status,scheduled_at,sent_at,sender_name,reply_to,created_at,updated_at&order=created_at.desc`,
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
    throw new Error(`キャンペーン一覧の取得に失敗しました。${errorText}`);
  }

  const campaigns = (await response.json()) as SupabaseCampaignRow[];

  return {
    configured: true as const,
    campaigns,
  };
}

export async function createNewsletterCampaignDraft(
  input: CreateCampaignDraftInput
) {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error(
      "Supabaseの環境変数が未設定です。SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください。"
    );
  }

  const response = await fetch(`${config.url}/rest/v1/campaigns`, {
    method: "POST",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      name: input.name,
      subject: input.subject,
      preview_text: input.previewText,
      body: input.body,
      status: "draft",
      scheduled_at: input.scheduledAt,
      sent_at: null,
      sender_name: newsletterConfig.senderName,
      reply_to: newsletterConfig.replyTo,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`キャンペーン下書き保存に失敗しました。${errorText}`);
  }

  const rows = (await response.json()) as SupabaseCampaignRow[];
  return rows[0] ?? null;
}

export async function createNewsletterUnsubscribeToken(subscriberId: string) {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error(
      "Supabaseの環境変数が未設定です。SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください。"
    );
  }

  const token = crypto.randomUUID();
  const tokenHash = await hashUnsubscribeToken(token);

  const response = await fetch(`${config.url}/rest/v1/unsubscribe_tokens`, {
    method: "POST",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      subscriber_id: subscriberId,
      token_hash: tokenHash,
      expires_at: null,
      used_at: null,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`配信停止トークンの作成に失敗しました。${errorText}`);
  }

  return token;
}

export async function unsubscribeNewsletterSubscriberByEmail(email: string) {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error(
      "Supabaseの環境変数が未設定です。SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください。"
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const now = new Date().toISOString();
  const response = await fetch(
    `${config.url}/rest/v1/subscribers?email=eq.${encodeURIComponent(
      normalizedEmail
    )}`,
    {
      method: "PATCH",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: "unsubscribed",
        unsubscribed_at: now,
        updated_at: now,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`配信停止処理に失敗しました。${errorText}`);
  }

  const rows = (await response.json()) as SupabaseSubscriberRow[];
  return rows[0] ?? null;
}

export async function unsubscribeNewsletterSubscriberByToken(token: string) {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error(
      "Supabaseの環境変数が未設定です。SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください。"
    );
  }

  const tokenHash = await hashUnsubscribeToken(token.trim());
  const tokenResponse = await fetch(
    `${config.url}/rest/v1/unsubscribe_tokens?select=id,subscriber_id,expires_at,used_at&token_hash=eq.${tokenHash}&limit=1`,
    {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
      cache: "no-store",
    }
  );

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`配信停止トークンの確認に失敗しました。${errorText}`);
  }

  const tokenRows =
    (await tokenResponse.json()) as SupabaseUnsubscribeTokenRow[];
  const tokenRow = tokenRows[0];

  if (!tokenRow || tokenRow.used_at) {
    return null;
  }

  if (tokenRow.expires_at && new Date(tokenRow.expires_at) < new Date()) {
    return null;
  }

  const now = new Date().toISOString();
  const subscriberResponse = await fetch(
    `${config.url}/rest/v1/subscribers?id=eq.${tokenRow.subscriber_id}`,
    {
      method: "PATCH",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: "unsubscribed",
        unsubscribed_at: now,
        updated_at: now,
      }),
      cache: "no-store",
    }
  );

  if (!subscriberResponse.ok) {
    const errorText = await subscriberResponse.text();
    throw new Error(`配信停止処理に失敗しました。${errorText}`);
  }

  await fetch(`${config.url}/rest/v1/unsubscribe_tokens?id=eq.${tokenRow.id}`, {
    method: "PATCH",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      used_at: now,
    }),
    cache: "no-store",
  });

  const subscribers = (await subscriberResponse.json()) as SupabaseSubscriberRow[];
  return subscribers[0] ?? null;
}
