# HitoriBIZ Newsletter Resend test send setup

この段階では、本配信ではなく、管理画面から指定した宛先へ1通だけ送る「テスト送信」を実装しています。

## 必要な環境変数

`.env.local` に以下を設定します。`.env.local` はGitにコミットしません。

```bash
RESEND_API_KEY="re_xxxxxxxxx"
```

まずはこの1つがあれば、送信元にはResend公式のテスト送信用アドレスを使います。

```bash
HitoriBIZ <onboarding@resend.dev>
```

本番に近い送信元で送る場合は、Resendでドメイン認証を行ったうえで以下も設定します。

```bash
RESEND_FROM_EMAIL="HitoriBIZ <newsletter@your-verified-domain.example>"
RESEND_REPLY_TO="info@hitori-biz.com"
```

`RESEND_REPLY_TO` は任意です。未設定の場合は `lib/newsletter/config.ts` の `replyTo` を使います。

## テスト送信先の初期値

管理画面のテスト送信欄に初期表示するメールアドレスは以下で設定できます。

```bash
NEWSLETTER_TEST_EMAIL="matsumura@hitori-biz.com"
```

## 送信方法

1. `/admin/newsletter` にログインします。
2. `/admin/newsletter/campaigns` を開きます。
3. 対象キャンペーンの「テスト送信」欄でメールアドレスを確認します。
4. 「テスト送信」を押します。
5. 受信トレイを確認します。

## 現在できること

- 管理画面からキャンペーンごとに1通だけテスト送信
- 件名に `[TEST]` を付与
- HTML本文とテキスト本文をResendへ送信
- 未ログイン状態では送信不可
- Resend未設定時は画面にエラーメッセージを表示

## まだ行わないこと

- active読者への一斉配信
- 配信予約の実行
- 配信結果保存
- 開封・クリック計測
- 本配信用の配信停止リンク自動挿入
