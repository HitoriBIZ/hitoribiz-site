import { ServicesPageContent } from "@/app/components/MarketingPages";
import { ja } from "@/dictionaries/ja";
import { pageMetadata } from "@/lib/i18n";

export const metadata = pageMetadata("ja", "/services", ja.metadata.services.title, ja.metadata.services.description);
export default function ServicesPage() { return <ServicesPageContent dictionary={ja} locale="ja" />; }
