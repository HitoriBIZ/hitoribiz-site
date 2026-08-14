# Wind Brass Tuner 1.1 — Google Play release checklist

Last updated: 2026-08-14

## Release identity

- Application ID: `com.olive.windbrasstuner`
- Version name: `1.1`
- Version code: `3`
- Minimum Android: Android 8.0 / API 26
- Target Android: Android 16 / API 36
- Category: Music & Audio
- Publisher: Olive Co., Ltd.

## Prepared files

- Store icon: `outputs/google-play/app-icon-512.png` (512 × 512 PNG)
- Feature graphic: `outputs/google-play/feature-graphic.png` (1024 × 500 PNG)
- Phone screenshot: `outputs/google-play/phone-01-main.png` (1080 × 2400 PNG)
- Store descriptions and release notes: `docs/wind-brass-tuner-google-play-metadata.md`
- Public privacy policy: `https://www.hitori-biz.com/wind-brass-tuner/privacy`
- Public support page: `https://www.hitori-biz.com/wind-brass-tuner/support`

At least one additional phone screenshot should be captured after tapping **Tone**, so the screen shows **Stop Tone**. A third recommended screenshot should show the B-flat Instrument selection. Keep the status and navigation bars visible or crop them consistently; do not include notifications containing personal information.

## Data safety draft

- Data collected: No
- Data shared: No
- Microphone audio: processed temporarily on the device; not retained or transmitted
- Account creation: No
- Advertising: No
- Analytics or tracking SDKs: No
- Network permission: No
- Data deletion request: Not applicable because the app stores no account or user data

The Data safety form is still required in Play Console even when no data is collected.

## App content draft

- App access: All functionality is available without login or special access
- Ads: No
- Target audience: General audience; not specifically directed to children
- Content rating: Complete the Play Console questionnaire using the actual app content
- News app: No
- Health app: No
- Financial features: None
- Government app: No
- Sensitive permission: Microphone, used only for the user-initiated tuning function

## Signing and release

1. Create a dedicated upload keystore outside the Git repository.
2. Keep the keystore and both passwords in a secure password manager and backed-up secure storage.
3. Generate a signed Android App Bundle for the `release` build type.
4. Verify the AAB signature and record its SHA-256 checksum.
5. Create the app in Play Console and enroll it in Play App Signing.
6. Upload the signed AAB to the Internal testing track first.
7. Complete Store listing, App content, Data safety, content rating, pricing, and country availability.
8. Install the Play-generated build through Internal testing and retest microphone and Tone playback before production submission.

Never commit `.jks`, `.keystore`, `keystore.properties`, or passwords.
