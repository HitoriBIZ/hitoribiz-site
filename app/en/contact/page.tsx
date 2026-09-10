import { ContactPageContent } from "@/app/components/MarketingPages";
import { en } from "@/dictionaries/en";
import { pageMetadata } from "@/lib/i18n";
export const metadata = pageMetadata("en", "/contact", en.metadata.contact.title, en.metadata.contact.description);
export default function EnglishContactPage() { return <ContactPageContent dictionary={en} locale="en" />; }
