import type { ReactNode } from "react";
import AdminNav from "../../components/newsletter/AdminNav";

export default function NewsletterAdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-[calc(100vh-4rem)] bg-slate-50 lg:flex"><AdminNav /><div className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</div></div>;
}
