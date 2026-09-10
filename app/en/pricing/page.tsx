import { PricingPageContent } from "@/app/components/MarketingPages";
import { en } from "@/dictionaries/en";
import { pageMetadata } from "@/lib/i18n";
export const metadata = pageMetadata("en", "/pricing", en.metadata.pricing.title, en.metadata.pricing.description);
export default function EnglishPricingPage() { return <PricingPageContent dictionary={en} locale="en" />; }
