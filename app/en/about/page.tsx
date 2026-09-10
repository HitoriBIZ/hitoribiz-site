import { AboutPageContent } from "@/app/components/MarketingPages";
import { en } from "@/dictionaries/en";
import { pageMetadata } from "@/lib/i18n";
export const metadata = pageMetadata("en", "/about", en.metadata.about.title, en.metadata.about.description);
export default function EnglishAboutPage() { return <AboutPageContent dictionary={en} locale="en" />; }
