import { BookingPageContent } from "@/app/components/MarketingPages";
import { ja } from "@/dictionaries/ja";
import { pageMetadata } from "@/lib/i18n";

export const metadata = pageMetadata("ja", "/booking", ja.metadata.booking.title, ja.metadata.booking.description);
export default function BookingPage() { return <BookingPageContent dictionary={ja} locale="ja" />; }
