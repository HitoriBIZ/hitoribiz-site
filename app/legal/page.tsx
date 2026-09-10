import { LegalPageContent } from "@/app/components/MarketingPages";
import { ja } from "@/dictionaries/ja";
import { pageMetadata } from "@/lib/i18n";

export const metadata = pageMetadata("ja", "/legal", ja.metadata.legal.title, ja.metadata.legal.description);
export default function LegalPage() { return <LegalPageContent dictionary={ja} locale="ja" />; }
