import { HomePageContent } from "@/app/components/MarketingPages";
import { ja } from "@/dictionaries/ja";
import { pageMetadata } from "@/lib/i18n";

export const metadata = pageMetadata("ja", "/", ja.metadata.home.title, ja.metadata.home.description);
export default function HomePage() { return <HomePageContent dictionary={ja} locale="ja" />; }
