import { HomePageContent } from "@/app/components/MarketingPages";
import { en } from "@/dictionaries/en";
import { pageMetadata } from "@/lib/i18n";

export const metadata = pageMetadata("en", "/", en.metadata.home.title, en.metadata.home.description);
export default function EnglishHomePage() { return <HomePageContent dictionary={en} locale="en" />; }
