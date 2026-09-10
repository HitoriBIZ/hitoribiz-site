import Image from "next/image";
import Link from "next/link";
import type { SiteDictionary } from "@/dictionaries/ja";
import type { Locale, MarketingPath } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";

type PageProps = { dictionary: SiteDictionary; locale: Locale };

function LocalLink({ locale, href, className, children }: { locale: Locale; href: MarketingPath; className?: string; children: React.ReactNode }) {
  return <Link href={localizedPath(href, locale)} className={className}>{children}</Link>;
}

export function HomePageContent({ dictionary: d, locale }: PageProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-0 sm:pt-16">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-widest text-slate-500">{d.home.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {d.home.title[0]}<br className="hidden sm:block" /> {d.home.title[1]}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-slate-600">{d.home.lead}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <LocalLink locale={locale} href="/booking" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">{d.home.primaryCta}</LocalLink>
            <LocalLink locale={locale} href="/services" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50">{d.home.secondaryCta}</LocalLink>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <Image src="/hero-home.png" alt={d.home.imageAlt} width={1200} height={900} priority className="h-auto w-full rounded-2xl border border-slate-200 shadow-sm" />
        </div>
      </section>
      <section className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {d.home.services.map((item) => <div key={item.title}><h2 className="text-lg font-bold text-slate-900">{item.title}</h2><p className="mt-3 text-sm leading-relaxed text-slate-600">{item.body}</p></div>)}
      </section>
      <section className="mt-24 rounded-2xl bg-slate-50 px-6 py-10 text-center">
        <h2 className="text-xl font-bold text-slate-900">{d.home.closingTitle}</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600">{d.home.closingBody}</p>
        <div className="mt-6"><LocalLink locale={locale} href="/booking" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">{d.home.closingCta}</LocalLink></div>
      </section>
    </main>
  );
}

export function ServicesPageContent({ dictionary: d, locale }: PageProps) {
  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:py-14">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-slate-500">{d.services.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">{d.services.title[0]}<span className="block text-slate-700">{d.services.title[1]}</span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-700">{d.services.lead}</p>
            <div className="mt-8"><LocalLink locale={locale} href="/booking" className="inline-flex items-center rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-700">{d.services.cta}</LocalLink></div>
          </div>
          <div className="flex justify-center"><Image src="/hero-kaito.png" alt={d.services.imageAlt} width={420} height={420} className="h-auto w-full max-w-sm" priority /></div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">{d.services.items.map((item) => <div key={item.title}><h2 className="text-lg font-semibold text-slate-900">{item.title}</h2><p className="mt-3 text-sm leading-6 text-slate-700">{item.body}</p></div>)}</div>
      </section>
    </main>
  );
}

export function WorksPageContent({ dictionary: d, locale }: PageProps) {
  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-white"><div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:py-14"><div><h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{d.works.title}</h1><p className="mt-4 max-w-xl text-slate-600">{d.works.lead}</p></div><div className="flex justify-center"><Image src="/hero-kaito.png" alt={d.works.imageAlt} width={420} height={420} priority /></div></div></section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">{d.works.items.map((work) => <article key={work.title} className="rounded-lg border border-slate-200 p-6"><h2 className="text-xl font-semibold">{work.title}</h2><p className="mt-2 text-slate-600">{work.purpose}</p><ul className="mt-4 list-disc pl-5 text-slate-600">{work.points.map((point) => <li key={point}>{point}</li>)}</ul><p className="mt-4 text-sm text-slate-500">{d.works.statusLabel}: {work.status}</p></article>)}</div>
        <div className="mt-12 text-center"><LocalLink locale={locale} href="/booking" className="inline-block rounded-md bg-slate-900 px-6 py-3 text-white hover:bg-slate-800">{d.works.cta}</LocalLink></div>
      </section>
    </main>
  );
}

export function AboutPageContent({ dictionary: d, locale }: PageProps) {
  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-6xl px-4 py-12 sm:py-16"><div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="mx-auto w-full max-w-sm"><Image src="/profile-matsumura.jpg" alt={d.about.imageAlt} width={600} height={800} className="rounded-2xl object-cover shadow-sm" priority /><p className="mt-3 text-xs text-slate-500">{d.about.imageCaption}</p></div>
        <div><p className="text-xs font-semibold tracking-[0.25em] text-slate-500">{d.about.eyebrow}</p><h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{d.about.title}</h1><p className="mt-4 text-base leading-7 text-slate-700"><span className="font-medium">{d.about.name}</span>{d.about.details.map((detail) => <span key={detail}><br />{detail}</span>)}</p><div className="mt-6 space-y-4 text-base leading-7 text-slate-700"><p className="font-medium text-slate-900">{d.about.intro}</p>{d.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
      </div></div></section>
      <section className="bg-white"><div className="mx-auto max-w-6xl px-4 py-12 sm:py-16"><h2 className="text-2xl font-bold tracking-tight">{d.about.sectionTitle}</h2><p className="mt-6 max-w-3xl text-base leading-7 text-slate-700">{d.about.sectionBody}</p><div className="mt-10"><LocalLink locale={locale} href="/booking" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">{d.about.cta}</LocalLink></div></div></section>
    </main>
  );
}

export function PricingPageContent({ dictionary: d, locale }: PageProps) {
  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-white"><div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 lg:grid-cols-2 lg:items-center lg:py-14"><div><p className="text-xs font-semibold tracking-[0.25em] text-slate-500">{d.pricing.eyebrow}</p><h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">{d.pricing.title}</h1><p className="mt-5 max-w-xl text-base leading-7 text-slate-700">{d.pricing.lead}</p><div className="mt-7 flex flex-wrap items-center gap-3"><LocalLink locale={locale} href="/booking" className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">{d.pricing.primaryCta}</LocalLink><LocalLink locale={locale} href="/services" className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50">{d.pricing.secondaryCta}</LocalLink></div></div><div className="relative mx-auto w-full max-w-md"><div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm"><Image src="/hero-kaito.png" alt={d.pricing.imageAlt} fill className="object-cover" priority /></div></div></div></section>
      <section className="mx-auto max-w-6xl px-4 py-12"><div className="grid grid-cols-1 gap-4 md:grid-cols-3">{d.pricing.plans.map((plan) => <article key={plan.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-3"><h2 className="text-lg font-extrabold text-slate-900">{plan.name}</h2><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{plan.badge}</span></div><p className="mt-3 text-sm leading-6 text-slate-700">{plan.desc}</p><div className="mt-4 text-xl font-extrabold text-slate-900">{plan.price}</div><ul className="mt-4 space-y-2 text-sm text-slate-700">{plan.items.map((item) => <li key={item} className="flex gap-2"><span className="mt-[0.35rem] h-1.5 w-1.5 flex-none rounded-full bg-slate-400" /><span>{item}</span></li>)}</ul><div className="mt-6"><LocalLink locale={locale} href="/booking" className="inline-flex w-fit items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">{d.pricing.cardCta}</LocalLink></div></article>)}</div>
        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6"><h3 className="text-base font-bold text-slate-900">{d.pricing.notesTitle}</h3><ul className="mt-3 space-y-2 text-sm text-slate-700">{d.pricing.notes.map((note) => <li key={note} className="flex gap-2"><span className="mt-[0.35rem] h-1.5 w-1.5 flex-none rounded-full bg-slate-400" /><span>{note}</span></li>)}</ul><div className="mt-5"><LocalLink locale={locale} href="/booking" className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">{d.pricing.primaryCta}</LocalLink></div></div>
      </section>
    </main>
  );
}

export function ContactPageContent({ dictionary: d }: PageProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b bg-white"><div className="mx-auto max-w-3xl px-4 py-8 sm:py-10"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{d.contact.title}</h1><p className="mt-3 text-xs text-slate-600 sm:text-sm">{d.contact.lead}</p><p className="mt-1 text-[11px] text-slate-500 sm:text-xs">{d.contact.responseNote}</p></div></section>
      <section className="mx-auto max-w-3xl px-4 py-8 sm:py-10"><div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"><form action="https://submit-form.com/UWNAVrVsy" method="POST" className="space-y-6 sm:space-y-8"><input type="hidden" name="_redirect" value="https://hitori-biz.com/contact/thanks" /><input type="hidden" name="_append" value="false" />
        <div><label htmlFor="contact-name" className="block text-xs font-medium text-slate-700 sm:text-sm">{d.contact.name} <span className="text-rose-500" aria-label={d.contact.required}>*</span></label><input id="contact-name" type="text" name="name" required className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500" /></div>
        <div><label htmlFor="contact-email" className="block text-xs font-medium text-slate-700 sm:text-sm">{d.contact.email} <span className="text-rose-500" aria-label={d.contact.required}>*</span></label><input id="contact-email" type="email" name="email" required className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500" /></div>
        <div><label htmlFor="contact-subject" className="block text-xs font-medium text-slate-700 sm:text-sm">{d.contact.subject}</label><select id="contact-subject" name="subject" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500" defaultValue=""><option value="" disabled>{d.contact.subjectPlaceholder}</option>{d.contact.subjects.map((subject) => <option key={subject.value} value={subject.value}>{subject.label}</option>)}</select></div>
        <div><label htmlFor="contact-message" className="block text-xs font-medium text-slate-700 sm:text-sm">{d.contact.message} <span className="text-rose-500" aria-label={d.contact.required}>*</span></label><textarea id="contact-message" name="message" rows={6} required className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500" /></div>
        <button type="submit" className="w-full rounded-full bg-sky-700 py-3 text-sm font-semibold text-white transition hover:bg-sky-600">{d.contact.submit}</button></form><p className="mt-5 text-[11px] text-slate-400 sm:text-xs">{d.contact.completeNote}</p></div></section>
    </main>
  );
}

export function BookingPageContent({ dictionary: d }: PageProps) {
  return <main className="min-h-screen bg-slate-50 text-slate-900"><div className="mx-auto max-w-4xl px-4 py-12"><h1 className="text-2xl font-bold text-slate-900">{d.booking.title}</h1><p className="mb-6 text-sm leading-relaxed text-slate-600">{d.booking.leadBefore}<span className="font-semibold"> {d.booking.leadStrong}</span>{d.booking.leadAfter}<br />{d.booking.instruction}</p><div className="overflow-hidden rounded-xl border bg-white shadow-sm"><iframe title={d.booking.iframeTitle} src="https://calendly.com/contact-hitori-biz/30min?embed_domain=hitori-biz.com&embed_type=Inline" width="100%" height="700" frameBorder="0" /></div><p className="mt-4 text-xs text-slate-500">{d.booking.note}</p></div></main>;
}

export function CompanyPageContent({ dictionary: d, locale }: PageProps) {
  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <p className="text-xs font-semibold tracking-[0.25em] text-slate-500">{d.company.eyebrow}</p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{d.company.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700">{d.company.lead}</p>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <dl>
            {d.company.details.map(([label, value], index) => (
              <div key={label} className={`grid gap-2 px-5 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6 sm:px-8 ${index === 0 ? "" : "border-t border-slate-200"}`}>
                <dt className="text-sm font-semibold text-slate-900">{label}</dt>
                <dd className="text-sm leading-6 text-slate-700">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-10 rounded-2xl bg-slate-50 px-6 py-8 sm:px-8">
          <h2 className="text-xl font-bold tracking-tight">{d.company.contactTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">{d.company.contactBody}</p>
          <LocalLink locale={locale} href="/contact" className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">{d.company.contactCta}</LocalLink>
        </div>
      </section>
    </main>
  );
}

export function PrivacyPageContent({ dictionary: d }: PageProps) {
  return <main className="mx-auto max-w-3xl px-4 py-12 text-slate-900 sm:py-16"><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{d.privacy.title}</h1><p className="mt-6 leading-8 text-slate-700">{d.privacy.intro}</p>{d.privacy.sections.map((section) => <section key={section.title} className="mt-9"><h2 className="text-xl font-bold">{section.title}</h2><p className="mt-3 leading-8 text-slate-700">{section.body}</p>{section.items.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-6 leading-7 text-slate-700">{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}<p className="mt-10 text-sm text-slate-500">{d.privacy.updated}</p></main>;
}

export function LegalPageContent({ dictionary: d }: PageProps) {
  return <main className="mx-auto max-w-3xl px-4 py-12 text-slate-900 sm:py-16"><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{d.legal.title}</h1><p className="mt-5 leading-7 text-slate-700">{d.legal.lead}</p><div className="mt-10 space-y-8">{d.legal.sections.map((section) => <section key={section.title}><h2 className="text-xl font-bold">{section.title}</h2><p className="mt-3 leading-7 text-slate-700">{section.body}</p></section>)}</div></main>;
}
