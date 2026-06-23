# HitoriBIZ Newsletter Phase 2 Supabase setup

Phase 2では、公開フォーム `/newsletter` から送信された読者情報をSupabaseの `subscribers` テーブルに保存します。

メール本配信、外部メールAPI連携、配信停止URL、管理画面のDB表示はまだこの段階では行いません。

## 1. SupabaseでSQLを実行

Supabaseプロジェクトを作成し、SQL Editorで以下を実行します。

```sql
-- このリポジトリの lib/newsletter/schema.sql を実行
```

`subscribers.email` はユニークです。同じメールアドレスで再登録された場合は、最新の同意日時・関心テーマで更新されます。

## 2. 環境変数を設定

`.env.local` に以下を設定します。`.env.local` はGitにコミットしません。

```bash
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

`SUPABASE_SERVICE_ROLE_KEY` はサーバー側API Routeだけで使用します。ブラウザへ渡さないでください。

## 3. 動作確認

```bash
npx tsc --noEmit
npm run build
```

ローカルで確認する場合は、`npm run dev` を起動して `/newsletter` から登録します。

## 4. 現在の保存内容

`app/api/newsletter/subscribe/route.ts` が以下を保存します。

- `email`
- `name`
- `company_name`
- `interests`
- `status = active`
- `consent_source = public_newsletter_form`
- `consent_at`
- `unsubscribed_at = null`

## 5. 次に実装する候補

- `/admin/newsletter/subscribers` をSupabase表示に切り替える
- 管理画面認証を追加する
- タグ付与を実データ化する
- CSVインポートをSupabase保存に接続する
- 配信停止済み読者の再登録ルールを明文化する
