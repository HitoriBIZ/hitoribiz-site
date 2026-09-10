import type { SiteDictionary } from "./ja";

export const en: SiteDictionary = {
  locale: "en",
  nav: {
    home: "Home", services: "Services", works: "Work", pricing: "Pricing", about: "About", company: "Company",
    booking: "Free consultation", menuOpen: "Open menu", menuClose: "Close menu", language: "English", switchLanguage: "日本語",
  },
  metadata: {
    home: { title: "HitoriBIZ | AI and Web Support for Small Businesses", description: "Practical, affordable website, e-commerce, AI, and digital support for solo business owners, freelancers, and small companies." },
    services: { title: "Services | HitoriBIZ", description: "Website and e-commerce development, practical AI adoption, workflow improvement, and ongoing digital support for small businesses." },
    works: { title: "Work | HitoriBIZ", description: "Selected website and digital support projects by HitoriBIZ." },
    about: { title: "About | HitoriBIZ", description: "Meet HitoriBIZ founder Shuzo Matsumura and learn about the experience and values behind the business." },
    pricing: { title: "Pricing | HitoriBIZ", description: "Indicative pricing for websites, e-commerce stores, and practical AI support for small businesses." },
    contact: { title: "Contact | HitoriBIZ", description: "Contact HitoriBIZ about website development, e-commerce, or practical AI support." },
    booking: { title: "Book a Free Consultation | HitoriBIZ", description: "Book a free 30-minute online consultation with HitoriBIZ." },
    privacy: { title: "Privacy Policy | HitoriBIZ", description: "How HitoriBIZ collects, uses, and protects personal information." },
    legal: { title: "Legal Information | HitoriBIZ", description: "Legal and operator information for HitoriBIZ." },
  },
  home: {
    eyebrow: "PROJECT",
    title: ["AI and Web Support", "for Small Businesses"],
    lead: "HitoriBIZ helps solo business owners, freelancers, and small companies build websites, online stores, and practical digital workflows. We keep things simple, affordable, and focused on what your business needs now.",
    primaryCta: "Book a consultation", secondaryCta: "View services", imageAlt: "HitoriBIZ digital support",
    services: [
      { title: "Website Development", body: "From clear structure and copy to launch, with a mobile-friendly experience included." },
      { title: "Shopify Stores", body: "Support with products, payments, delivery settings, and a practical workflow for day-to-day operation." },
      { title: "Practical AI", body: "Useful ways to apply AI to writing, planning, FAQs, and everyday business tasks." },
    ],
    closingTitle: "Not sure where to begin?", closingBody: "We will clarify your current situation and decide what matters most, together.", closingCta: "Start with a free consultation",
  },
  services: {
    eyebrow: "SERVICES", title: ["Practical digital support", "built for small businesses"],
    lead: "From websites and online stores to AI adoption and workflow improvements, we explain things clearly and work alongside you at every step.",
    cta: "Book a free 30-minute consultation", imageAlt: "Kaito, the HitoriBIZ ambassador",
    items: [
      { title: "Websites & E-commerce", body: "Purpose-built websites, blogs, and Shopify stores designed around your customers and goals." },
      { title: "AI & Workflow Improvement", body: "Practical use of ChatGPT and other AI tools to simplify daily work and organize information." },
      { title: "Ongoing Support", body: "We stay involved after launch to help with updates, improvements, and day-to-day operation." },
    ],
  },
  works: {
    title: "Work", lead: "A selection of websites and digital projects developed and supported by HitoriBIZ.", imageAlt: "Kaito, the HitoriBIZ ambassador", statusLabel: "Status", cta: "Book a free 30-minute consultation",
    items: [
      { title: "HitoriBIZ Official Website", purpose: "Presenting the full picture of a solo business in a clear, accessible way", points: ["Easy to read on mobile", "Clear paths to the blog and consultation booking", "An interface that makes key information easy to find"], status: "Live" },
      { title: "Crystal VantVert.com (in development)", purpose: "Bringing the story and character of a crystal jewelry studio online", points: ["Story-led structure", "Thoughtful presentation of the work and the ideas behind it"], status: "In development" },
    ],
  },
  about: {
    imageAlt: "Portrait of Shuzo Matsumura", imageCaption: "Photographed in Waikiki, Honolulu, August 2025", eyebrow: "PROFILE", title: "Founder Profile", name: "Shuzo Matsumura",
    details: ["Born in Tokyo in 1949", "Founder, HitoriBIZ / President, Olive Co., Ltd.", "Personal interest: violin"],
    intro: "From international logistics and manufacturing to practical digital support.",
    paragraphs: [
      "Shuzo Matsumura began his career in international business in 1971. At Taiun Company in Minato, Tokyo, he worked with the international operations team of a foreign measurement-instrument manufacturer, building a foundation in global logistics and trade operations.",
      "He joined HARIO Co., Ltd. in 1987 and helped establish its international trade operations. To manage quotations, contracts, and import-export documentation efficiently, he independently built a business system with FileMaker Pro. He later contributed to establishing local subsidiaries in six countries and supported global sales and procurement for many years.",
      "As e-commerce and online sales expanded in the 2000s, he launched an online business function within the company and led its e-commerce initiatives. Throughout his career, he has focused on a practical question: how can a good product reach the people who need it?",
      "After retiring from HARIO in 2025, he founded HitoriBIZ in 2026, combining decades of hands-on business experience with practical new technologies, including AI, to support solo and small businesses.",
    ],
    sectionTitle: "About HitoriBIZ", sectionBody: "HitoriBIZ supports solo business owners, freelancers, and small companies with websites, online stores, and practical digital tools. For businesses that want something professional without the scale or cost of a large agency, we offer careful, affordable support—starting with what matters most.", cta: "Talk with us",
  },
  pricing: {
    eyebrow: "PRICING", title: "How We Estimate Your Project", lead: "HitoriBIZ provides clear, practical support for website development and the use of AI and digital tools. We keep initial production costs manageable and agree on affordable maintenance and support based on what your business will actually need after launch.",
    primaryCta: "Book a free 30-minute consultation", secondaryCta: "View services", imageAlt: "Kaito, the HitoriBIZ ambassador", cardCta: "Discuss your project", notesTitle: "Notes",
    notes: ["Prices shown are indicative and vary with scope, page count, and available materials.", "A detailed estimate is provided after an initial conversation.", "Ongoing updates and improvement support are also available."],
    plans: [
      { name: "Light", desc: "Start with a focused one-page site that works like a digital business card.", price: "From ¥5,000", items: ["One-page landing page", "Mobile optimization", "Copy refinement and light editing", "Contact pathway setup"], badge: "Fastest launch" },
      { name: "Standard", desc: "Build trust with the essential pages for your services, work, and profile.", price: "From ¥30,000", items: ["Up to 5 pages (for example: Home, Services, Work, About, Contact)", "Mobile optimization", "Basic SEO titles and descriptions", "Minor adjustments after launch"], badge: "Recommended" },
      { name: "E-commerce (Shopify)", desc: "From product setup to payments and delivery, organized for straightforward daily operation.", price: "From ¥100,000", items: ["Initial Shopify setup", "Product registration support (up to about 10 products)", "Payment, shipping, and tax settings", "Basic operating guidance"], badge: "For online stores" },
    ],
  },
  contact: {
    title: "Contact", lead: "Tell us about your website, redesign, e-commerce, or practical AI needs. We are happy to discuss your situation.", responseNote: "We normally reply by email within one or two business days.",
    name: "Name", email: "Email address", subject: "Subject", subjectPlaceholder: "Select a subject",
    subjects: [
      { value: "サービスのご相談", label: "Service consultation" }, { value: "お見積りのご依頼", label: "Request an estimate" }, { value: "Webサイト制作について", label: "Website development" }, { value: "AI活用について", label: "Practical AI support" }, { value: "その他", label: "Other (please add details below)" },
    ],
    message: "Message", required: "required", submit: "Send message", completeNote: "After submitting, you will be taken to a confirmation page. That page confirms that your message has been sent.",
  },
  booking: {
    title: "Book a Free Online Consultation (about 30 minutes)", leadBefore: "Talk through the challenges facing your solo or small business in a ", leadStrong: "free 30-minute online consultation", leadAfter: ". Sessions are available via Zoom or Google Meet.", instruction: "Choose a convenient time from the calendar below.", iframeTitle: "HitoriBIZ consultation booking calendar", note: "After booking, you will receive an automatic email with the Zoom or Google Meet link.",
  },
  privacy: {
    title: "Privacy Policy", intro: "HitoriBIZ (referred to below as “we”) recognizes the protection and proper handling of personal information as an important responsibility. This policy explains what information we collect, why we use it, and how we protect it.",
    sections: [
      { title: "1. Information We Collect", body: "We may collect the following information as needed to provide and improve our services.", items: ["Your name, email address, and other information submitted through an inquiry", "Usage logs and access information generated when you use our services"] },
      { title: "2. How We Use Personal Information", body: "We use collected information for the following purposes.", items: ["Responding to support requests", "Improving our services and their quality", "Sharing information about new services and features", "Preventing misuse and maintaining security"] },
      { title: "3. Sharing with Third Parties", body: "We do not provide personal information to third parties except in the following circumstances.", items: ["When you have given consent", "When disclosure is required by law", "When information is provided only to service providers needed to operate the service, such as hosting providers"] },
      { title: "4. Security", body: "We take appropriate safeguards to prevent unauthorized access, disclosure, loss, or alteration of personal information.", items: [] },
      { title: "5. Contact", body: "Questions about this policy may be sent to HitoriBIZ Administration at contact@hitori-biz.com.", items: [] },
      { title: "6. Changes to This Policy", body: "We may revise this Privacy Policy when necessary. Any revision will be announced promptly on this page.", items: [] },
    ],
    updated: "Last updated: November 16, 2025",
  },
  legal: {
    title: "Legal Information", lead: "Basic information about the operation of HitoriBIZ and its services.",
    sections: [
      { title: "Operator", body: "HitoriBIZ / Olive Co., Ltd." }, { title: "Contact", body: "contact@hitori-biz.com" },
      { title: "Disclaimer", body: "We take reasonable care to keep the information on this website accurate. Except where required by law, we are not liable for losses arising from its use." },
      { title: "Copyright", body: "Text, images, and other works on this website may not be reproduced or republished without permission from the rights holder." },
    ],
  },
};
