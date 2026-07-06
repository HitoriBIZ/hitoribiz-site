# Olive Co., Ltd. Apple Developer / App Store Connect Preparation Checklist

Last updated: 2026-07-06

## Purpose

Prepare 有限会社オリーブ to release the iOS version of Wind and Brass Tuner as a paid App Store app.

The existing web version at `https://www.hitori-biz.com/wind-brass-tuner` must remain unchanged unless a later task explicitly asks for web changes.

## Current Project State

- The SwiftUI iOS prototype runs on a physical iPhone.
- Microphone permission has been confirmed on the iPhone.
- Pitch detection responds to voice input, including Hz and cents display.
- The current local iOS milestone commits are:
  - `cea71c7 Add iOS Wind Brass Tuner prototype`
  - `3f0c7d0 Refine iOS Wind Brass Tuner UI`
- The existing web tuner files were not changed during the iOS prototype work.

## Apple Developer Organization Enrollment Requirements

Apple's organization enrollment requirements should be checked again at the time of enrollment, but the current preparation items are:

- Apple Account with two-factor authentication.
- A person with legal authority to bind 有限会社オリーブ to Apple agreements.
- 有限会社オリーブ must be a legal entity. Apple does not accept a DBA, trade name, or branch as the enrolling organization.
- The organization name is displayed as the seller name on the App Store.
- D-U-N-S Number for 有限会社オリーブ.
- Work email address associated with the organization's domain.
- Public, functional website whose domain is associated with the organization.
- Apple Developer Program annual membership fee. Apple currently lists this as 99 USD per membership year; local currency and taxes may vary.

## 有限会社オリーブ Items To Prepare

- Official legal entity name and spelling.
  - Confirmed Japanese registered name: `有限会社オリーブ`
  - English display candidate: `Olive Co., Ltd.`
  - Confirm this matches corporate registration and D-U-N-S records.
- Corporate registration information.
- D-U-N-S Number.
  - If Olive does not have one, request or update it before Apple enrollment.
- Company-domain email address for the Account Holder.
  - Prefer a company domain address over a personal email address.
- Public company website.
  - The domain should clearly belong to 有限会社オリーブ.
  - The site should be functional and not only a placeholder page.
- Company phone number and address.
  - These should match legal and D-U-N-S records as closely as possible.
- Authorized Account Holder.
  - This person must be allowed to accept Apple contracts for 有限会社オリーブ.
- Payment method for the annual Apple Developer Program membership.

## App Store Connect Paid App Requirements

Before selling a paid app, prepare:

- Apple Developer Program membership under 有限会社オリーブ.
- App Store Connect access for the Account Holder and any collaborators.
- Paid Apps Agreement.
- Banking information.
- Tax information.
- Compliance information.
  - Export compliance.
  - Age rating.
  - Any regional trader or business compliance requirements shown in App Store Connect.
- Price and availability settings.

## App Privacy Preparation

Current intended privacy posture for Wind and Brass Tuner:

- The app uses the microphone for pitch detection.
- Audio should be processed on device.
- The app should not store microphone audio.
- The app should not upload microphone audio.
- The current prototype does not require account login, ads, analytics, or cloud sync.

Prepare:

- Privacy Policy URL.
- Support URL.
- A short explanation that microphone access is used only for tuning and pitch detection.
- App privacy answers in App Store Connect that match the actual app behavior.

If analytics, crash reporting, ads, subscriptions, accounts, or server features are added later, update the privacy policy and App Store privacy answers before submission.

## App Store Product Page Materials

Prepare these before App Store submission:

- App name.
  - Current candidate: `Wind and Brass Tuner`
- Bundle ID.
  - Current prototype: `com.olive.windbrasstuner`
  - Confirm final ownership after the Olive developer team is created.
- Subtitle.
- Promotional text.
- App description.
- Keywords.
- Category.
  - Likely candidate: Music.
- Support URL.
- Marketing URL.
- Privacy Policy URL.
- App icon.
- iPhone screenshots.
- Optional preview video.
- Copyright text.
- Price tier for paid upfront sale.

## Xcode And Signing Workflow After Olive Enrollment

After the 有限会社オリーブ Apple Developer account is ready:

- Add or select the Olive developer team in Xcode.
- Change the Xcode signing team from the current Personal Team to the Olive team.
- Confirm the final Bundle ID is available under the Olive team.
- Create the App Store Connect app record.
- Archive the app from Xcode.
- Upload the build to App Store Connect.
- Run TestFlight internal testing.
- Decide whether to run external TestFlight testing.
- Submit for App Review after metadata, privacy, screenshots, pricing, and compliance are complete.

## Risks And Watch Points

- D-U-N-S name, address, or phone mismatch can delay enrollment.
- A personal email address can slow or complicate organization verification.
- A weak or unrelated website/domain can fail organization verification.
- Paid apps cannot be sold until agreements, banking, and tax are complete.
- App Review may ask for clarification if microphone use or privacy language is unclear.
- If the app is too minimal, App Review may question its value. Keep the current successful pitch detection, clear UI, and a focused use case for wind and brass players.

## Next Action Checklist

- [x] Confirm Japanese registered legal entity name: `有限会社オリーブ`.
- [ ] Confirm English spelling for Apple/D-U-N-S records.
- [ ] Confirm or request 有限会社オリーブ D-U-N-S Number.
- [ ] Prepare a company-domain Apple Account with two-factor authentication.
- [ ] Confirm who will be the legal Account Holder.
- [ ] Prepare or confirm 有限会社オリーブ public website.
- [ ] Prepare Privacy Policy URL.
- [ ] Prepare Support URL.
- [ ] Enroll in the Apple Developer Program as an organization.
- [ ] Complete App Store Connect paid app agreements, banking, and tax.
- [ ] Switch Xcode signing from Personal Team to Olive team.
- [ ] Create the App Store Connect app record.
- [ ] Prepare App Store metadata, screenshots, and app icon.
- [ ] Create a TestFlight plan.

## Official References

- Apple Developer Program enrollment: https://developer.apple.com/programs/enroll/
- App Store Connect agreements, tax, and banking: https://developer.apple.com/help/app-store-connect/manage-agreements/sign-and-update-agreements/
- App Store app privacy details: https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy
