# HitoriBIZ Newsletter Resend test send setup

この段階では、本配信ではなく管理画面から指定した宛先へ1通だけ送るテスト送信を実装しています。

## 必要な環境変数

`.env.local` に以下を設定します。`.env.local` はGitにコミットしません。

```bash
RESEND_API_KEY="re_xxxxxxxxx"
RESEND_FROM_EMAIL="HitoriBIZ <newsletter@your-verified-domain.example>"
RESEND_REPLY_TO="info@hitori-biz.com"
```

`RESEND_REPLY_TO` は任意です。未設定の場合は `lib/newsletter/config.ts` の `replyTo` を使います。

## 送信元メールアドレス

Resendで本格運用する場合、送信元ドメインの認証が必要です。DNS設定が完了するまでは、Resendのテスト用送信元や検証済みドメインを使ってください。

## 現在できること

- `/admin/newsletter/campaigns` からテスト送信先を入力
- 管理ログイン済みの場合のみ送信APIを実行
- Resend APIへ1通だけ送信
- 件名には `[TEST]` を付与

## まだ行わないこと

- active読者への一斉配信
- 予約配信
- 配信結果保存
- 開封・クリック計測
- 自動の配信停止リンク挿入
