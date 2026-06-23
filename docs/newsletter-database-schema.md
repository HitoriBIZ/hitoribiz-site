# Newsletter database schema (Phase 1 proposal)

HitoriBIZ Newsletterの将来実装用DB設計案。Phase 1では接続・マイグレーションを行わない。PostgreSQLを想定し、日時はすべて`TIMESTAMPTZ`、主キーは`UUID`を推奨する。

## Tables

### `subscribers`

| column | type | rule |
|---|---|---|
| id | uuid | primary key |
| email | text | unique, not null, lowercaseで正規化 |
| name | text | not null, default `''` |
| company_name | text | not null, default `''` |
| interests | text[] | not null, default `{}` |
| status | text | `active`, `unsubscribed`, `bounced`, `inactive` |
| consent_source | text | not null |
| consent_at | timestamptz | not null |
| unsubscribed_at | timestamptz | nullable |
| created_at | timestamptz | not null, default now() |
| updated_at | timestamptz | not null, default now() |

`status = 'unsubscribed'`の読者は、管理画面からも自動処理からも配信対象へ戻さない。再登録時は新しい同意記録を別途監査できる設計をPhase 2で検討する。

### `tags`

`id uuid PK`, `name text NOT NULL`, `slug text UNIQUE NOT NULL`, `description text NOT NULL DEFAULT ''`, `created_at timestamptz`, `updated_at timestamptz`。

### `subscriber_tags`

`subscriber_id uuid FK subscribers(id) ON DELETE CASCADE`, `tag_id uuid FK tags(id) ON DELETE CASCADE`, `created_at timestamptz`。複合主キーは`(subscriber_id, tag_id)`。

### `campaigns`

`id uuid PK`, `name text NOT NULL`, `subject text NOT NULL`, `preview_text text`, `body text NOT NULL`, `status text`（`draft`, `scheduled`, `sending`, `sent`, `cancelled`）、`scheduled_at timestamptz`, `sent_at timestamptz`, `sender_name text NOT NULL`, `reply_to text NOT NULL`, `created_at timestamptz`, `updated_at timestamptz`。

対象タグは`campaign_tags(campaign_id, tag_id)`の中間テーブルで保存する。配信開始時に対象者を確定し、後のタグ変更が配信履歴へ影響しないようにする。

### `campaign_recipients`

| column | type | note |
|---|---|---|
| id | uuid | primary key |
| campaign_id | uuid | FK campaigns |
| subscriber_id | uuid | FK subscribers |
| email | text | 送信時点の宛先スナップショット |
| status | text | pending, sent, failed, skipped |
| sent_at | timestamptz | nullable |
| opened_at | timestamptz | nullable |
| clicked_at | timestamptz | nullable |
| unsubscribed_at | timestamptz | nullable |
| error_message | text | nullable |

`(campaign_id, subscriber_id)`にunique制約を置く。

### `unsubscribe_tokens`

`id uuid PK`, `subscriber_id uuid FK`, `token_hash text UNIQUE NOT NULL`, `expires_at timestamptz`, `used_at timestamptz`, `created_at timestamptz`。生トークンではなくハッシュを保存する。

### `email_events`

`id uuid PK`, `campaign_id uuid FK`, `subscriber_id uuid FK`, `event_type text`（sent, delivered, bounced, opened, clicked, unsubscribed等）、`url text`, `metadata jsonb`, `created_at timestamptz`。`campaign_id`, `subscriber_id`, `event_type`, `created_at`に検索用indexを検討する。

## Operational rules

- 配信対象は送信直前に`subscribers.status = 'active'`かつ`unsubscribed_at IS NULL`を再確認する。
- フォーム・CSVを問わず、同意日時と同意取得経路がない読者はactiveとして登録しない。
- CSVインポートは検証結果をプレビューし、重複、形式不正、配信停止済みを明示する。
- 管理操作は将来`admin_audit_logs`へ操作者、操作、対象、日時を記録する。
- 外部メールAPIのキーは環境変数で管理し、DBやGitへ保存しない。
- 管理画面は認証・認可で保護し、配信実行には再確認を設ける。
- 開封・クリック計測を導入する場合は、プライバシーポリシーと同意文言へ反映する。

## Recommended indexes

`subscribers(email) UNIQUE`, `subscribers(status)`, `tags(slug) UNIQUE`, `campaigns(status, scheduled_at)`, `campaign_recipients(campaign_id, status)`, `email_events(campaign_id, event_type, created_at)`。
