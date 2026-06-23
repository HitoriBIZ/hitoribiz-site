import type { Campaign, NewsletterTag, Subscriber } from "./types";

export const mockTags: NewsletterTag[] = [
  { id: "tag-1", name: "AI活用", slug: "ai", description: "AI活用や業務効率化に関心がある読者", subscriberCount: 86, createdAt: "2026-04-02", updatedAt: "2026-06-18" },
  { id: "tag-2", name: "Web制作", slug: "web", description: "ホームページ・ECサイト制作に関心がある読者", subscriberCount: 64, createdAt: "2026-04-02", updatedAt: "2026-06-20" },
  { id: "tag-3", name: "Orchestra Tools", slug: "orchestra-tools", description: "Orchestra Toolsの利用者・関係者", subscriberCount: 48, createdAt: "2026-04-05", updatedAt: "2026-06-21" },
  { id: "tag-4", name: "Score Reader", slug: "score-reader", description: "Score Readerに関心がある読者", subscriberCount: 31, createdAt: "2026-05-11", updatedAt: "2026-06-19" },
];

export const mockSubscribers: Subscriber[] = [
  { id: "sub-1", email: "aiko.sato@example.com", name: "佐藤 愛子", companyName: "佐藤音楽教室", interests: ["AI活用", "音楽関連サービス"], tags: [mockTags[0], mockTags[2]], status: "active", consentSource: "newsletter-form", consentAt: "2026-06-22T10:20:00+09:00", unsubscribedAt: null, createdAt: "2026-06-22T10:20:00+09:00", updatedAt: "2026-06-22T10:20:00+09:00" },
  { id: "sub-2", email: "tanaka@example.jp", name: "田中 健", companyName: "田中デザイン", interests: ["ホームページ制作", "ECサイト"], tags: [mockTags[1]], status: "active", consentSource: "event-qr", consentAt: "2026-06-20T15:05:00+09:00", unsubscribedAt: null, createdAt: "2026-06-20T15:05:00+09:00", updatedAt: "2026-06-20T15:05:00+09:00" },
  { id: "sub-3", email: "yamamoto@example.net", name: "山本 誠", companyName: "ヤマモト楽器", interests: ["Orchestra Tools", "Score Reader"], tags: [mockTags[2], mockTags[3]], status: "unsubscribed", consentSource: "csv-import", consentAt: "2026-05-18T09:00:00+09:00", unsubscribedAt: "2026-06-16T18:40:00+09:00", createdAt: "2026-05-18T09:00:00+09:00", updatedAt: "2026-06-16T18:40:00+09:00" },
  { id: "sub-4", email: "suzuki@example.org", name: "鈴木 直子", companyName: "", interests: ["HitoriBIZからのお知らせ"], tags: [], status: "inactive", consentSource: "newsletter-form", consentAt: "2026-06-14T12:30:00+09:00", unsubscribedAt: null, createdAt: "2026-06-14T12:30:00+09:00", updatedAt: "2026-06-14T12:30:00+09:00" },
];

export const mockCampaigns: Campaign[] = [
  { id: "cmp-1", name: "6月のHitoriBIZニュース", subject: "AIとWebの小さな改善アイデア", previewText: "今月のHitoriBIZからのお知らせです。", body: "", status: "scheduled", targetTags: [mockTags[0], mockTags[1]], scheduledAt: "2026-06-28T10:00:00+09:00", sentAt: null, sentCount: 0, createdAt: "2026-06-18T11:00:00+09:00", updatedAt: "2026-06-22T16:30:00+09:00" },
  { id: "cmp-2", name: "Orchestra Toolsアップデート", subject: "Orchestra Toolsの新機能をご紹介", previewText: "演奏・練習を支える新しい機能を追加しました。", body: "", status: "sent", targetTags: [mockTags[2]], scheduledAt: null, sentAt: "2026-06-12T10:00:00+09:00", sentCount: 46, createdAt: "2026-06-05T09:00:00+09:00", updatedAt: "2026-06-12T10:15:00+09:00" },
  { id: "cmp-3", name: "Score Reader活用ガイド", subject: "楽譜をもっと身近にする3つの使い方", previewText: "Score Readerの便利な活用方法をご案内します。", body: "", status: "draft", targetTags: [mockTags[3]], scheduledAt: null, sentAt: null, sentCount: 0, createdAt: "2026-06-21T14:00:00+09:00", updatedAt: "2026-06-21T14:00:00+09:00" },
];
