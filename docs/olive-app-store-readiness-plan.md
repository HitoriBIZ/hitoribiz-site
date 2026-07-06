# Olive Co., Ltd. App Store Readiness Plan

This plan is for publishing a paid iOS version of Wind and Brass Tuner under Olive Co., Ltd. while keeping the existing web version unchanged.

## Ground Rules

- Do not change the current production web app:
  - https://www.hitori-biz.com/wind-brass-tuner
- Do not edit the existing string tuner unless a separate task explicitly requires it:
  - `/tuner-app`
  - `app/tuner-app/page.tsx`
- Treat the App Store version as a separate iOS app with its own source, metadata, testing, pricing, and review process.
- Use the web version as a reference for product behavior, not as something to modify.

## Recommended Direction

Use a native SwiftUI app for the App Store product.

Reason:

- Better fit for App Store review than a thin WebView wrapper.
- Cleaner microphone permission handling on iOS.
- More control over pitch detection, latency, audio session behavior, and future paid-app polish.
- The current web app can remain exactly as it is.

## Apple Developer Organization Enrollment

Prepare these before enrollment:

- Olive Co., Ltd. legal entity name exactly as registered.
- Apple Account with two-factor authentication enabled.
- Account Holder candidate who has legal authority to bind Olive Co., Ltd. to Apple agreements.
- D-U-N-S Number for Olive Co., Ltd.
- Company domain email address associated with Olive Co., Ltd.
- Public company website that is functional and associated with Olive Co., Ltd.
- Business phone number and business address.
- Annual Apple Developer Program fee budget: 99 USD per membership year, or local equivalent shown during enrollment.

Notes:

- Organization enrollment is important if the App Store seller name should appear as Olive Co., Ltd.
- Trade names, branch names, or unofficial names should not be used as the legal entity name.
- If the D-U-N-S record has outdated address or company-name information, update it before Apple enrollment.

## Paid App Setup

After the Apple Developer Program account is active:

- Sign in to App Store Connect.
- Accept the latest Paid Apps agreement.
- Add banking information.
- Add tax information.
- Confirm business/contact information.
- Decide whether to enroll in the App Store Small Business Program.

Recommended first business model:

- Paid upfront app.
- No in-app purchase for version 1.
- No advertising.
- No analytics SDK for version 1 unless there is a clear business need.

Why:

- Simpler review story.
- Cleaner privacy story.
- Easier for a first App Store release.
- Easier to explain to musicians and educators.

## App Identity

Working app metadata:

- App name: Wind and Brass Tuner
- Seller: Olive Co., Ltd.
- Subtitle idea: Concert pitch tuner for wind and brass
- Primary category: Music
- Secondary category: Utilities or Education
- Initial price candidates:
  - Low-friction: USD 1.99
  - Standard utility: USD 2.99
  - Specialist tool: USD 4.99

Final price should be chosen after tester feedback.

## Privacy And Legal Preparation

Version 1 privacy goal:

- Microphone audio is processed on device.
- No audio recording is saved.
- No audio is uploaded.
- No account creation.
- No ads.
- No third-party analytics.
- No tracking.

Prepare these URLs:

- Privacy Policy URL.
- Support URL.
- Marketing/product URL, optional.

Privacy policy must match the actual implementation. If the app later adds analytics, crash reporting, cloud sync, account login, payments, or support forms, update both the privacy policy and App Store privacy answers.

Minimum privacy policy topics:

- Who operates the app: Olive Co., Ltd.
- What the app does.
- Why microphone access is requested.
- Whether microphone audio is stored or transmitted.
- Whether personal data is collected.
- Whether third-party services are used.
- How users can contact support.
- Effective date.

## iOS Permission Text

Prepare the microphone usage description for `NSMicrophoneUsageDescription`.

Draft:

```text
Wind and Brass Tuner uses the microphone to analyze your instrument pitch in real time. Audio is processed on your device and is not uploaded.
```

Japanese draft:

```text
Wind and Brass Tunerは、楽器の音程をリアルタイムに解析するためにマイクを使用します。音声は端末上で処理され、アップロードされません。
```

## App Store Listing Assets

Prepare:

- App icon, 1024 x 1024.
- iPhone screenshots.
- Optional iPad screenshots if iPad is supported.
- App preview video, optional.
- App description.
- Keywords.
- What's New text for later updates.
- Review notes for Apple.
- Demo account information only if the app ever requires login.

Suggested screenshot set:

1. Main tuner screen with stable pitch reading.
2. Transposition selector showing Concert Pitch, B-flat, E-flat, and F instruments.
3. Target note selector with A4 reference set to 442 Hz.
4. Reference tone feature.
5. Short privacy-friendly message: on-device pitch analysis.

## Product Requirements For Native Version 1

Must have:

- Concert Pitch mode.
- B-flat Instrument mode.
- E-flat Instrument mode.
- F Instrument mode.
- Target notes:
  - A4
  - B-flat4
  - C5
  - D5
  - E-flat5
  - F5
  - G5
- A4 reference:
  - 440 Hz
  - 441 Hz
  - 442 Hz
  - 443 Hz
  - 444 Hz
- Default A4 reference: 442 Hz.
- Microphone pitch detection.
- Cents display.
- In-tune / sharp / flat indication.
- Reference tone for the selected concert pitch.

Required transposition checks:

- B-flat Instrument + C5 => Concert Pitch B-flat4.
- E-flat Instrument + C5 => Concert Pitch E-flat4.
- F Instrument + C5 => Concert Pitch F4.
- Concert Pitch + A4 => Concert Pitch A4.

Nice to have after TestFlight:

- Clarinet / trumpet / alto sax / horn labels.
- Better low-signal warning.
- Simple calibration help.
- Landscape or iPad layout.

## TestFlight Plan

Internal test group:

- Owner / developer.
- 1-3 trusted reviewers.

External test group:

- 5-15 wind and brass players at first.
- Include at least:
  - B-flat instrument player.
  - E-flat instrument player.
  - F horn player.
  - Concert pitch reference tester.

Tester questions:

- Did the app ask for microphone permission clearly?
- Was the displayed pitch stable enough?
- Was transposition understandable?
- Did A4 = 442 Hz feel natural?
- Were B-flat / E-flat / F instrument results correct?
- Did the reference tone stop/start as expected?
- Would you pay for this as a musician?

## First Milestone Checklist

- [ ] Confirm Olive Co., Ltd. legal details.
- [ ] Confirm D-U-N-S Number.
- [ ] Confirm company-domain email address.
- [ ] Confirm public website URL for Olive Co., Ltd.
- [ ] Enroll in Apple Developer Program as an organization.
- [ ] Accept Paid Apps agreement.
- [ ] Add banking information.
- [ ] Add tax information.
- [ ] Decide initial paid price.
- [ ] Prepare privacy policy URL.
- [ ] Prepare support URL.
- [ ] Build SwiftUI proof of concept.
- [ ] Test microphone permission on real iPhone.
- [ ] Test transposition examples.
- [ ] Prepare TestFlight metadata.
- [ ] Invite first internal testers.

## Current Repository Notes

The web version was already added in commit:

```text
e1153a4 Add wind and brass tuner
```

Mac handoff confirmed:

- TypeScript check passed.
- Next.js production build passed.
- `/wind-brass-tuner` appears in build output.
- `/tuner-app` remains present.

