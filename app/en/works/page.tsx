import { WorksPageContent } from "@/app/components/MarketingPages";
import { en } from "@/dictionaries/en";
import { pageMetadata } from "@/lib/i18n";
export const metadata = pageMetadata("en", "/works", en.metadata.works.title, en.metadata.works.description);
export default function EnglishWorksPage() { return <WorksPageContent dictionary={en} locale="en" />; }
