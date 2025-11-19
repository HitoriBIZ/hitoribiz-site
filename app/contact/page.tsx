export const metadata = {
  title: "Contact | HitoriBIZ",
  description: "無料相談・お見積りのご依頼はこちらから。1営業日以内に返信します。",
};

// ★ FormspreeのフォームIDを取得後に差し替え
const FORMSPREE_ENDPOINT = "https://formspree.io/f/FORM_ID_REPLACE";

export default function Contact() {
  return (
    <section className="container py-12">
      <h1 className="text-3xl md:text-4xl font-bold">Contact</h1>
      <p className="mt-4 text-neutral-600">
        無料相談・お見積りは下記よりお気軽に。1営業日以内にご連絡します。<br />
        メール：
        <a className="underline" href="mailto:contact@hitori-biz.com">
          contact@hitori-biz.com
        </a>
      </p>

      <div className="mt-8 rounded-2xl border p-6 shadow-soft max-w-2xl">
        <form action={FORMSPREE_ENDPOINT} method="POST" className="space-y-4">
          <div>
            <label className="block text-sm font-medium">お名前</label>
            <input
              name="name"
              required
              className="w-full border rounded-xl px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">メールアドレス</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border rounded-xl px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">ご相談種別</label>
            <select
              name="topic"
              className="w-full border rounded-xl px-3 py-2 mt-1"
            >
              <option>アプリ制作</option>
              <option>ホームページ制作</option>
              <option>EC構築（Shopify）</option>
              <option>SNS運用/広告</option>
              <option>デザイン/パンフレット</option>
              <option>その他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">ご相談内容</label>
            <textarea
              name="message"
              rows={6}
              required
              className="w-full border rounded-xl px-3 py-2 mt-1"
            />
          </div>

          {/* 必要に応じて Formspree のリダイレクトなどを指定 */}
          {/* <input type="hidden" name="_redirect" value="https://www.hitori-biz.com/thanks" /> */}

          <div className="text-xs text-neutral-500">
            送信によりプライバシーポリシーに同意したものとみなします。営業目的のご連絡はご遠慮ください。
          </div>

          <button className="btn-primary" type="submit">
            送信する
          </button>
        </form>
      </div>
    </section>
  );
}
