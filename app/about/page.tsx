import { AboutPageContent } from "@/app/components/MarketingPages";
import { ja } from "@/dictionaries/ja";
import { pageMetadata } from "@/lib/i18n";

export const metadata = pageMetadata("ja", "/about", ja.metadata.about.title, ja.metadata.about.description);
export default function AboutPage() { return <AboutPageContent dictionary={ja} locale="ja" />; }
