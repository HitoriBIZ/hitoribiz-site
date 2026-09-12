# String Tuner iOS App

Native SwiftUI tuner for violin, viola, and cello by Olive Co., Ltd.

The existing web tuner at `app/tuner-app/page.tsx` is intentionally independent
and must remain unchanged.

## Open in Xcode

Open `StringTuner.xcodeproj`, select the Olive Co., Ltd. development team, and
run on an iPhone or iPad with iOS 17 or later.

Suggested App Store configuration:

- English name: String Tuner
- Japanese name: 弦楽チューナー
- Bundle identifier: `com.olive.stringtuner`
- Price: JPY 600
- Support: https://www.hitori-biz.com/orchestra-tuner/support
- Privacy: https://www.hitori-biz.com/orchestra-tuner/privacy

The microphone is used only for real-time, on-device pitch analysis. Reference
tone playback and microphone listening are mutually exclusive.
