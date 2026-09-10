import { BookingPageContent } from "@/app/components/MarketingPages";
import { en } from "@/dictionaries/en";
import { pageMetadata } from "@/lib/i18n";
export const metadata = pageMetadata("en", "/booking", en.metadata.booking.title, en.metadata.booking.description);
export default function EnglishBookingPage() { return <BookingPageContent dictionary={en} locale="en" />; }
