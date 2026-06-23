export type SubscriberStatus = "active" | "unsubscribed" | "bounced" | "inactive";

export interface Subscriber {
  id: string;
  email: string;
  name: string;
  companyName: string;
  interests: string[];
  tags: NewsletterTag[];
  status: SubscriberStatus;
  consentSource: string;
  consentAt: string;
  unsubscribedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterTag {
  id: string;
  name: string;
  slug: string;
  description: string;
  subscriberCount: number;
  createdAt: string;
  updatedAt: string;
}

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "sending"
  | "sent"
  | "cancelled";

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  previewText: string;
  body: string;
  status: CampaignStatus;
  targetTags: NewsletterTag[];
  scheduledAt: string | null;
  sentAt: string | null;
  sentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignReport {
  campaignId: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  openedCount: number;
  clickedCount: number;
  unsubscribedCount: number;
}
