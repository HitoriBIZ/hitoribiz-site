// app/privacy/page.tsx
export const metadata = {
  title: "プライバシーポリシー - HitoriBIZ",
  description:
    "HitoriBIZ（Orchestra Metronome）のプライバシーポリシー。個人情報は収集・共有しません。お問い合わせ: contact@hitori-biz.com",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main style={{ padding: "40px", fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.8, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>プライバシーポリシー</h1>
      <p>最終更新日：2025年11月1日</p>

      <h2 style={{ marginTop: "24px", fontSize: "20px" }}>1. 収集する情報</h2>
      <p>本アプリ「Orchestra Metronome」は、ユーザーの個人情報を一切収集しません。</p>

      <h2 style={{ marginTop: "24px", fontSize: "20px" }}>2. データの共有・第三者提供</h2>
      <p>当社はユーザーデータを外部サービスや第三者に送信・共有しません。</p>

      <h2 style={{ marginTop: "24px", fontSize: "20px" }}>3. 保存・暗号化</h2>
      <p>サーバー側で個人情報を保存・処理しません。したがって暗号化や削除リクエストの対象となるデータはありません。</p>

      <h2 style={{ marginTop: "24px", fontSize: "20px" }}>4. お問い合わせ</h2>
      <p>
        本ポリシーに関するお問い合わせは、<a href="mailto:contact@hitori-biz.com">contact@hitori-biz.com</a> までご連絡ください。
      </p>
    </main>
  );
}
}
