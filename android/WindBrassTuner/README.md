# Wind Brass Tuner for Android

Native Android version of Wind Brass Tuner for Google Play. It matches the iOS version's core behavior and processes microphone audio only on the device.

## App identity

- App name: Wind Brass Tuner
- Application ID: `com.olive.windbrasstuner`
- Version: `1.0.0` (`versionCode 1`)
- Minimum Android: Android 8.0 / API 26
- Target Android: Android 16 / API 36
- Publisher: Olive Co., Ltd.

## Open and run

1. Install a current Android Studio release with JDK 17 and Android SDK 36.
2. Open this `android/WindBrassTuner` directory as the project.
3. Allow Gradle sync to download the declared dependencies.
4. Select an Android 8.0 or newer physical device.
5. Run the `app` configuration and allow microphone access.

A physical device is recommended because emulator microphone behavior and latency vary by host configuration.

## Release AAB

In Android Studio, use **Build > Generate Signed App Bundle or APK > Android App Bundle**. Create or select Olive Co., Ltd.'s upload key and store the keystore outside this repository.

The expected output is:

```text
app/build/outputs/bundle/release/app-release.aab
```

Never commit the upload keystore, its password, or `local.properties`.

## Privacy posture

- Microphone permission is used only while the user actively tunes.
- Audio samples are analyzed in memory on device.
- Audio is not recorded, saved, or uploaded.
- No account, ads, analytics, tracking, network permission, or third-party SDK is included.

If any of these properties change, update the privacy policy and Play Console Data safety answers before release.
