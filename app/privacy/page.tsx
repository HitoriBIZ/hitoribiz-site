import { PrivacyPageContent } from "@/app/components/MarketingPages";
import { ja } from "@/dictionaries/ja";
import { pageMetadata } from "@/lib/i18n";

export const metadata = pageMetadata("ja", "/privacy", ja.metadata.privacy.title, ja.metadata.privacy.description);
export default function PrivacyPage() { return <PrivacyPageContent dictionary={ja} locale="ja" />; }
