import { LegalPageContent } from "@/app/components/MarketingPages";
import { en } from "@/dictionaries/en";
import { pageMetadata } from "@/lib/i18n";
export const metadata = pageMetadata("en", "/legal", en.metadata.legal.title, en.metadata.legal.description);
export default function EnglishLegalPage() { return <LegalPageContent dictionary={en} locale="en" />; }
