import { PricingPageContent } from "@/app/components/MarketingPages";
import { ja } from "@/dictionaries/ja";
import { pageMetadata } from "@/lib/i18n";

export const metadata = pageMetadata("ja", "/pricing", ja.metadata.pricing.title, ja.metadata.pricing.description);
export default function PricingPage() { return <PricingPageContent dictionary={ja} locale="ja" />; }
