import { CompanyPageContent } from "@/app/components/MarketingPages";
import { en } from "@/dictionaries/en";
import { pageMetadata } from "@/lib/i18n";

export const metadata = pageMetadata("en", "/company", en.metadata.company.title, en.metadata.company.description);

export default function EnglishCompanyPage() {
  return <CompanyPageContent dictionary={en} locale="en" />;
}
