# Wind Brass Tuner SwiftUI Prototype

This is a small native SwiftUI prototype for the future App Store version of Wind and Brass Tuner.

It is intentionally separate from the existing Next.js web app. The current production URL version should remain unchanged:

- https://www.hitori-biz.com/wind-brass-tuner

## Prototype Scope

This prototype explores:

- SwiftUI layout for a paid iOS tuner app.
- Concert pitch calculation.
- B-flat, E-flat, and F instrument transposition.
- A4 reference defaults to 442 Hz.
- Microphone pitch detection using `AVAudioEngine`.
- A simple target-centered autocorrelation detector.

It is not yet an App Store submission project.

## Files

- `Package.swift`
- `Sources/WindBrassTunerPrototype/WindBrassTunerPrototypeApp.swift`
- `Sources/WindBrassTunerPrototype/ContentView.swift`
- `Sources/WindBrassTunerPrototype/TuningModel.swift`
- `Sources/WindBrassTunerPrototype/PitchDetector.swift`

## Next Step To Make This An iOS App

Create a new Xcode iOS App project, then copy the Swift files into the app target.

Required iOS setting:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Wind and Brass Tuner uses the microphone to analyze your instrument pitch in real time. Audio is processed on your device and is not uploaded.</string>
```

## Verification

The pure Swift package can be type-checked from this directory with:

```bash
swift build
```

The key transposition examples can be checked with:

```bash
swift test
```

Real microphone behavior must be tested on an iPhone before TestFlight.
