import { ServicesPageContent } from "@/app/components/MarketingPages";
import { en } from "@/dictionaries/en";
import { pageMetadata } from "@/lib/i18n";

export const metadata = pageMetadata("en", "/services", en.metadata.services.title, en.metadata.services.description);
export default function EnglishServicesPage() { return <ServicesPageContent dictionary={en} locale="en" />; }
