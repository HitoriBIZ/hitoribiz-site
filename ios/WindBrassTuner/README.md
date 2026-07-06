# Wind and Brass Tuner iOS App

This is the first Xcode iOS App project for a future App Store version under Olive Co., Ltd.

The existing web version must remain unchanged:

- https://www.hitori-biz.com/wind-brass-tuner

## Open In Xcode

Open:

```text
ios/WindBrassTuner/WindBrassTuner.xcodeproj
```

Before running on a real iPhone:

1. Select the `WindBrassTuner` target.
2. Set `Signing & Capabilities` to the correct Olive Co., Ltd. team.
3. Confirm the Bundle Identifier. Current placeholder:
   - `com.olive.windbrasstuner`
4. Connect and unlock the iPhone.
5. Trust this Mac on the iPhone if prompted.
6. Press Run in Xcode.

## Microphone Permission

The app includes:

```text
NSMicrophoneUsageDescription
```

Current message:

```text
Wind and Brass Tuner uses the microphone to analyze your instrument pitch in real time. Audio is processed on your device and is not uploaded.
```

## Command Line Checks

Simulator build:

```bash
xcodebuild -project ios/WindBrassTuner/WindBrassTuner.xcodeproj -scheme WindBrassTuner -destination 'generic/platform=iOS Simulator' build CODE_SIGNING_ALLOWED=NO
```

Connected iPhone build requires a valid Apple Developer team and signing setup.

