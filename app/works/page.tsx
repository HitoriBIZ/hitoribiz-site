import { WorksPageContent } from "@/app/components/MarketingPages";
import { ja } from "@/dictionaries/ja";
import { pageMetadata } from "@/lib/i18n";

export const metadata = pageMetadata("ja", "/works", ja.metadata.works.title, ja.metadata.works.description);
export default function WorksPage() { return <WorksPageContent dictionary={ja} locale="ja" />; }
