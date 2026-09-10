import { ContactPageContent } from "@/app/components/MarketingPages";
import { ja } from "@/dictionaries/ja";
import { pageMetadata } from "@/lib/i18n";

export const metadata = pageMetadata("ja", "/contact", ja.metadata.contact.title, ja.metadata.contact.description);
export default function ContactPage() { return <ContactPageContent dictionary={ja} locale="ja" />; }
