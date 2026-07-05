# HitoriBIZ Orchestra Tools
# Wind & Brass Tuner 取扱説明書・仕様書

管楽器・金管楽器奏者が、移調楽器の Written Pitch（記譜音）と Concert Pitch（実音）を確認しながら調音するためのWebチューナーです。

- App URL: https://www.hitori-biz.com/wind-brass-tuner
- Version: 1.0
- Publisher: HitoriBIZ by Olive Co., Ltd.
- Contact: contact@hitori-biz.com

---

## 1. このアプリでできること

Wind & Brass Tuner は、スマートフォンやPCのマイクを使って、演奏している音の高さを確認するWebアプリです。

通常のチューナーと違う点は、B♭管、E♭管、F管などの移調楽器に対応していることです。画面上で「楽譜に書かれている音」と「実際に鳴っている音」を同時に確認できます。

### 主な用途

| 用途 | 説明 |
| --- | --- |
| 練習前のチューニング | A4 Reference を選び、基準音に合わせて音程を確認します。 |
| ロングトーン練習 | 音を長く伸ばしたときに、音程が安定しているか確認します。 |
| 移調楽器の確認 | Written Pitch と Concert Pitch の関係を見ながら調音できます。 |
| セクション練習前の確認 | パート内で基準音や音程感をそろえる補助として使えます。 |
| 初心者の音程学習 | 「自分が楽譜上で吹いている音」と「実際に鳴っている音」の違いを学べます。 |

---

## 2. 初心者向け：まず覚える言葉

### Written Pitch / 記譜音

楽譜に書かれている音です。

例：B♭クラリネットやB♭トランペットの楽譜に「C」と書かれていた場合、その奏者にとっての Written Pitch は C です。

### Concert Pitch / 実音

実際に鳴っている音です。ピアノ、チューナー、録音機器などが聞いている音はこちらです。

例：B♭ Instrument で Written Pitch C を吹くと、Concert Pitch は B♭ になります。

### cents / セント

音程のずれを細かく表す単位です。

- 0 cents: 目標の音に合っている
- + の値: 目標より高い
- - の値: 目標より低い
- ±5 cents 以内: このアプリでは In Tune と表示

### A4 Reference

基準にする A4（ラ）の周波数です。オーケストラや吹奏楽では 442 Hz を使うことが多いため、このアプリの初期値は 442 Hz です。

---

## 3. 対応する楽器タイプ

アプリでは、以下の Transposition / Instrument Type を選べます。

| 選択肢 | 意味 | 代表的な楽器 |
| --- | --- | --- |
| Concert Pitch | 記譜音と実音が同じ | フルート、オーボエ、ファゴット、トロンボーン、ユーフォニアム、チューバ |
| B♭ Instrument | 記譜Cを吹くと実音B♭が鳴る | B♭クラリネット、B♭トランペット、テナーサックス、ソプラノサックス |
| E♭ Instrument | 記譜Cを吹くと実音E♭が鳴る | アルトサックス、バリトンサックス、E♭クラリネット |
| F Instrument | 記譜Cを吹くと実音Fが鳴る | ホルン |

---

## 4. 基本的な使い方

### Step 1: アプリを開く

スマートフォンまたはPCで以下を開きます。

https://www.hitori-biz.com/wind-brass-tuner

### Step 2: Transposition / Instrument Type を選ぶ

自分の楽器に合ったタイプを選びます。

- フルート、トロンボーンなど: Concert Pitch
- B♭クラリネット、B♭トランペットなど: B♭ Instrument
- アルトサックスなど: E♭ Instrument
- ホルン: F Instrument

迷った場合は、先生や楽譜の表記で「B♭管」「E♭管」「F管」と書かれていないか確認してください。

### Step 3: Target Note を選ぶ

調音のために吹く「楽譜上の音」を選びます。

現在選べる Target Note:

- A4
- B♭4
- C5
- D5
- E♭5
- F5
- G5

Target Note は、奏者が吹く Written Pitch として扱われます。

### Step 4: A4 Reference を選ぶ

基準ピッチを選びます。

- 440 Hz
- 441 Hz
- 442 Hz
- 443 Hz
- 444 Hz

初期値は 442 Hz です。

### Step 5: Start Tuning を押す

ブラウザがマイクの使用許可を求めたら、許可してください。

音を出すと、画面中央に検出音、cents、周波数が表示されます。

### Step 6: 音程を調整する

画面の表示を見ながら、音程をゆっくり調整します。

- In Tune: 目標に近い
- Sharp: 高い
- Flat: 低い

最後は画面だけでなく、必ず自分の耳でも確認してください。

---

## 5. 移調楽器の例

### B♭ Instrument + Target Note C5

奏者は楽譜上の C5 を吹きます。

- Written Pitch: C5
- Concert Pitch: B♭4
- アプリが測定対象にする音: B♭4

### E♭ Instrument + Target Note C5

奏者は楽譜上の C5 を吹きます。

- Written Pitch: C5
- Concert Pitch: E♭4
- アプリが測定対象にする音: E♭4

### F Instrument + Target Note C5

奏者は楽譜上の C5 を吹きます。

- Written Pitch: C5
- Concert Pitch: F4
- アプリが測定対象にする音: F4

### Concert Pitch + Target Note A4

奏者は実音 A4 を吹きます。

- Written Pitch: A4
- Concert Pitch: A4
- アプリが測定対象にする音: A4

---

## 6. Reference Tone の使い方

Reference Tone は、選択中の Target Note と Transposition から計算される Concert Pitch を鳴らす機能です。

### 使い方

1. Transposition を選ぶ
2. Target Note を選ぶ
3. A4 Reference を選ぶ
4. Reference Tone Start を押す
5. 耳で基準音を確認する
6. Reference Tone Stop で止める

### 注意

Reference Tone 再生中は、スマートフォン自身の音をマイクが拾わないように、測定は自動停止します。

Start Tuning を押すと、Reference Tone は停止し、マイク測定に戻ります。

---

## 7. スマートフォンのホーム画面に追加する

Wind & Brass Tuner は、App Store や Google Play からインストールしなくても、ホーム画面に追加してアプリのように使えます。

| 端末 | 手順 |
| --- | --- |
| iPhone | Safariでアプリを開く → 共有ボタン → ホーム画面に追加 → 追加 |
| Android | Chromeでアプリを開く → メニュー → ホーム画面に追加、またはアプリをインストール → 追加 |

ホーム画面に追加すると、練習前にすぐ起動できます。

---

## 8. 練習で使うときのコツ

- スマートフォンのマイクを手やケースでふさがないでください。
- 楽器から20〜50cmほど離して試してください。
- 周囲が騒がしい場所では、他の音を拾って表示が不安定になることがあります。
- ロングトーンでは、音の出始めではなく、少し安定してから表示を見ると確認しやすくなります。
- 画面の表示だけに頼らず、必ず耳でも音程を確認してください。
- 合奏前は、チューナーで確認したあと、周囲の音にも合わせてください。

---

## 9. トラブルシューティング

### マイク許可が出ない

- HTTPSのURLで開いているか確認してください。
- iPhoneではSafariで開いてください。
- ブラウザや端末設定でマイクが許可されているか確認してください。

### 音が検出されない

- Start Tuning を押しているか確認してください。
- スマートフォンのマイク位置を確認してください。
- 楽器を少しスマートフォンに近づけてください。
- 無音や小さすぎる音では検出されないことがあります。

### 表示が揺れる

- 周囲の雑音を減らしてください。
- 音をまっすぐ長めに伸ばしてください。
- 音の出始めだけを見るのではなく、安定したところを見てください。

### Reference Tone が鳴らない

- スマートフォンの音量を確認してください。
- 消音モードやブラウザの音声再生設定を確認してください。
- もう一度 Reference Tone Start を押してください。

### ホーム画面アイコンが古い

iPhoneやAndroidでは、ホーム画面アイコンがキャッシュされることがあります。

古いアイコンが出る場合は、一度ホーム画面から削除し、SafariまたはChromeで開き直して再追加してください。

---

## 10. テスター向け確認項目

実際の管楽器・金管楽器奏者にテストしてもらう場合は、次の項目を確認してください。

### 表示確認

- 画面がスマホ縦画面で崩れない
- ボタンが押しやすい
- Detected Note が大きく読める
- cents と Frequency が読みやすい
- Written Pitch と Concert Pitch が混同しにくい

### 移調確認

- Concert Pitch + A4 → Concert Pitch: A4
- B♭ Instrument + C5 → Concert Pitch: B♭4
- E♭ Instrument + C5 → Concert Pitch: E♭4
- F Instrument + C5 → Concert Pitch: F4

### 演奏確認

- 実際の音に反応する
- 無音時に変な音名が出続けない
- ロングトーン中の表示が激しく揺れすぎない
- 高めに吹くと Sharp と表示される
- 低めに吹くと Flat と表示される
- ±5 cents 以内で In Tune と表示される

### Reference Tone 確認

- 選択した Concert Pitch が鳴る
- 音量が大きすぎない
- スマートフォンのスピーカーでも聞き取りやすい
- 再生中は測定が止まる
- Start Tuning を押すと Reference Tone が止まる

---

## 11. 仕様書

### ページ情報

| 項目 | 内容 |
| --- | --- |
| アプリ名 | Wind & Brass Tuner |
| URL | /wind-brass-tuner |
| 公開URL | https://www.hitori-biz.com/wind-brass-tuner |
| フレームワーク | Next.js 14 App Router |
| UI | Tailwind CSS |
| 実装ファイル | app/wind-brass-tuner/page.tsx |
| レイアウト/メタ情報 | app/wind-brass-tuner/layout.tsx |
| Web Manifest | public/wind-brass-tuner.webmanifest |
| アイコン | public/icons/wind-brass-tuner/ |

### 対応 Transposition

| ID | 表示名 | Concert Pitchへの変換 |
| --- | --- | --- |
| concert | Concert Pitch | 0 semitones |
| bb | B♭ Instrument | -2 semitones |
| eb | E♭ Instrument | -9 semitones |
| f | F Instrument | -7 semitones |

### Target Note

| 表示 | MIDI |
| --- | --- |
| A4 | 69 |
| B♭4 | 70 |
| C5 | 72 |
| D5 | 74 |
| E♭5 | 75 |
| F5 | 77 |
| G5 | 79 |

### A4 Reference

選択可能値:

- 440 Hz
- 441 Hz
- 442 Hz
- 443 Hz
- 444 Hz

初期値:

- 442 Hz

### 周波数計算

12平均律で計算します。

```text
frequency = A4Reference * 2 ^ ((midi - 69) / 12)
```

### cents 計算

検出周波数と目標周波数の差を cents で表示します。

```text
cents = 1200 * log2(detectedFrequency / targetFrequency)
```

判定:

| 条件 | 表示 |
| --- | --- |
| 検出なし | Listening または Ready |
| -5 cents から +5 cents | In Tune |
| +5 cents より高い | Sharp |
| -5 cents より低い | Flat |

### 音程検出

| 項目 | 内容 |
| --- | --- |
| 入力 | Web Audio API / getUserMedia |
| 解析 | AnalyserNode の time domain data |
| 検出方式 | 目標周波数近辺の自己相関ベース検出 |
| fftSize | 16384 |
| smoothingTimeConstant | 0.62 |
| 最小音量 | RMS 0.004 |
| 最小明瞭度 | clarity 0.2 |
| 平滑化 | 直近履歴の中央値 |
| 履歴数 | 7 |
| 表示更新間隔 | 約180ms |
| 無音リセット | 約1200ms |

### Reference Tone

| 項目 | 内容 |
| --- | --- |
| 出力 | Web Audio API OscillatorNode |
| 再生音 | 選択中の Concert Pitch |
| 音色 | sine + triangle系倍音 |
| 音量 | スマートフォン向けに控えめ |
| 測定との関係 | 再生中はマイク測定を停止 |
| Start Tuning時 | Reference Toneを停止して測定開始 |

### PWA / ホーム画面

| 項目 | 内容 |
| --- | --- |
| manifest | /wind-brass-tuner.webmanifest |
| start_url | /wind-brass-tuner |
| display | standalone |
| theme_color | #b8872a |
| icons | 192px / 512px |
| apple touch icon | /icons/wind-brass-tuner/apple-touch-icon.png |

---

## 12. English Quick Guide

Wind & Brass Tuner is a browser-based tuner for wind and brass players. It supports transposing instruments and shows both Written Pitch and Concert Pitch.

### Basic Steps

1. Open https://www.hitori-biz.com/wind-brass-tuner
2. Choose your Transposition / Instrument Type.
3. Choose the Target Note you want to play as written.
4. Choose the A4 Reference.
5. Tap Start Tuning and allow microphone access.
6. Play the note and watch Detected Note, cents, and Frequency.
7. Adjust slowly, then confirm the pitch by ear.

### Important Terms

- Written Pitch: the note written in the music.
- Concert Pitch: the actual sounding pitch.
- Sharp: the sound is high.
- Flat: the sound is low.
- In Tune: within ±5 cents of the target pitch.

### Transposition Examples

- B♭ Instrument + Written C5 = Concert B♭4
- E♭ Instrument + Written C5 = Concert E♭4
- F Instrument + Written C5 = Concert F4
- Concert Pitch + A4 = Concert A4

### Notes

Use the display as a practice aid, but always listen carefully. In ensemble playing, tune to the musical context, not only to the screen.

