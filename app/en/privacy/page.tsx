import { PrivacyPageContent } from "@/app/components/MarketingPages";
import { en } from "@/dictionaries/en";
import { pageMetadata } from "@/lib/i18n";
export const metadata = pageMetadata("en", "/privacy", en.metadata.privacy.title, en.metadata.privacy.description);
export default function EnglishPrivacyPage() { return <PrivacyPageContent dictionary={en} locale="en" />; }
