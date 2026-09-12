import SwiftUI

struct ContentView: View {
    @StateObject private var model = TuningModel()
    @StateObject private var detector = PitchDetector()
    @StateObject private var tonePlayer = TonePlayer()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 18) {
                    tunerCard
                    if detector.microphonePermission == .denied { microphoneNotice }
                    actions
                    setupCard
                    Label(L10n.privacy, systemImage: "lock.shield.fill")
                        .font(.footnote).foregroundStyle(.secondary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                .frame(maxWidth: 760)
                .padding()
                .frame(maxWidth: .infinity)
            }
            .background(Color(red: 0.075, green: 0.055, blue: 0.09))
            .navigationTitle(L10n.appName)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .onReceive(detector.$detectedFrequency) { model.updateDetectedFrequency($0) }
            .onChange(of: model.targetFrequency) { _, _ in restartIfNeeded() }
            .onDisappear { detector.stop(); tonePlayer.stop() }
        }
        .preferredColorScheme(.dark)
    }

    private var tunerCard: some View {
        VStack(spacing: 18) {
            HStack {
                Label(detector.statusMessage, systemImage: detector.isRunning ? "waveform" : "circle")
                    .font(.subheadline.weight(.semibold)).foregroundStyle(statusColor)
                Spacer()
                Text(model.instrument.displayName).font(.subheadline.weight(.semibold)).foregroundStyle(.secondary)
            }
            HStack(alignment: .firstTextBaseline, spacing: 12) {
                Text(model.selectedString.label).font(.system(size: 72, weight: .bold, design: .rounded))
                VStack(alignment: .leading) {
                    Text(model.selectedString.scientificName).font(.title3.bold())
                    Text("\(L10n.target)  \(model.targetFrequency, specifier: "%.2f") Hz")
                        .font(.subheadline.monospacedDigit()).foregroundStyle(.secondary)
                }
            }
            Text(detectedText).font(.title2.monospacedDigit().weight(.semibold)).foregroundStyle(.secondary)
            HStack(alignment: .firstTextBaseline, spacing: 8) {
                Text(centsText).font(.system(size: 48, weight: .bold, design: .rounded).monospacedDigit())
                    .foregroundStyle(centsColor)
                if model.cents != nil { Text("cents").font(.headline).foregroundStyle(.secondary) }
            }
            Text(directionText).font(.headline.weight(.bold)).foregroundStyle(centsColor)
            if model.isStableTone {
                Label(L10n.stable, systemImage: "checkmark.seal.fill")
                    .font(.subheadline.bold()).foregroundStyle(.green)
            }
            meter
            inputLevel
        }
        .padding(22)
        .background(Color.white.opacity(0.075))
        .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 24).stroke(Color.white.opacity(0.09)))
    }

    private var meter: some View {
        GeometryReader { proxy in
            let width = proxy.size.width
            let position = max(0, min(1, ((model.cents ?? 0) + 50) / 100))
            ZStack(alignment: .leading) {
                Capsule().fill(LinearGradient(colors: [.orange, .green, .orange], startPoint: .leading, endPoint: .trailing)).frame(height: 10)
                Rectangle().fill(.white.opacity(0.5)).frame(width: 2, height: 24).offset(x: width / 2)
                Circle().fill(centsColor).frame(width: 24, height: 24).offset(x: max(0, min(width - 24, position * (width - 24))))
            }
        }.frame(height: 26).padding(.horizontal, 4)
    }

    private var inputLevel: some View {
        VStack(spacing: 6) {
            HStack { Text(L10n.micInput); Spacer(); Text("\(Int(detector.inputLevel * 100))%") }
                .font(.caption.weight(.semibold)).foregroundStyle(.secondary)
            GeometryReader { proxy in
                ZStack(alignment: .leading) {
                    Capsule().fill(.white.opacity(0.1))
                    Capsule().fill(.purple).frame(width: max(3, proxy.size.width * detector.inputLevel))
                }
            }.frame(height: 8)
        }
    }

    private var actions: some View {
        HStack(spacing: 12) {
            Button(action: toggleListening) {
                Label(detector.isRunning ? L10n.stop : L10n.listen,
                      systemImage: detector.isRunning ? "stop.fill" : "mic.fill")
                    .frame(maxWidth: .infinity).padding(.vertical, 13)
            }.buttonStyle(.borderedProminent).tint(detector.isRunning ? .red : .purple)
            Button(action: toggleTone) {
                Label(tonePlayer.isPlaying ? L10n.stopTone : L10n.tone,
                      systemImage: tonePlayer.isPlaying ? "speaker.slash.fill" : "speaker.wave.2.fill")
                    .frame(maxWidth: .infinity).padding(.vertical, 13)
            }.buttonStyle(.bordered).tint(.orange)
        }.font(.headline.bold())
    }

    private var setupCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(L10n.setup).font(.headline.bold())
            Picker(L10n.instrument, selection: $model.instrument) {
                ForEach(StringInstrument.allCases) { Text($0.displayName).tag($0) }
            }.pickerStyle(.segmented)
            VStack(alignment: .leading, spacing: 8) {
                Text(L10n.openString).font(.subheadline.bold()).foregroundStyle(.secondary)
                HStack {
                    ForEach(model.instrument.strings) { string in
                        Button {
                            model.selectedString = string
                        } label: {
                            VStack { Text(string.label).font(.title2.bold()); Text(string.scientificName).font(.caption) }
                                .frame(maxWidth: .infinity).padding(.vertical, 10)
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(model.selectedString == string ? .purple : .gray.opacity(0.35))
                    }
                }
            }
            Picker(L10n.a4Reference, selection: $model.a4Reference) {
                ForEach([440, 441, 442, 443, 444], id: \.self) { Text("\($0) Hz").tag(Double($0)) }
            }.pickerStyle(.segmented)
            Text(L10n.toneStopsMic).font(.footnote).foregroundStyle(.secondary)
        }
        .padding(20).background(Color.white.opacity(0.075))
        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
    }

    private var microphoneNotice: some View {
        VStack(alignment: .leading, spacing: 8) {
            Label(L10n.microphoneRequired, systemImage: "mic.slash.fill").font(.headline)
            Text(L10n.microphoneHelp).font(.subheadline).foregroundStyle(.secondary)
        }.frame(maxWidth: .infinity, alignment: .leading).padding().background(Color.orange.opacity(0.14)).clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private func toggleListening() {
        if detector.isRunning { detector.stop() }
        else {
            tonePlayer.stop()
            detector.start(targetFrequency: model.targetFrequency, rangeCents: model.searchRangeCents)
        }
    }

    private func toggleTone() {
        if tonePlayer.isPlaying { tonePlayer.stop() }
        else {
            detector.stop()
            tonePlayer.start(frequency: model.targetFrequency, midiNote: model.selectedString.midiNote)
        }
    }

    private func restartIfNeeded() {
        if detector.isRunning { detector.start(targetFrequency: model.targetFrequency, rangeCents: model.searchRangeCents) }
        if tonePlayer.isPlaying { tonePlayer.start(frequency: model.targetFrequency, midiNote: model.selectedString.midiNote) }
    }

    private var detectedText: String { model.detectedFrequency.map { "\(L10n.detected)  \(String(format: "%.2f Hz", $0))" } ?? L10n.playSteady }
    private var centsText: String { model.cents.map { String(format: "%+.1f", $0) } ?? "–" }
    private var directionText: String {
        guard let cents = model.cents else { return " " }
        if abs(cents) <= 5 { return L10n.inTune }
        return cents < 0 ? L10n.tooLow : L10n.tooHigh
    }
    private var centsColor: Color {
        guard let cents = model.cents else { return .secondary }
        return abs(cents) <= 5 ? .green : (cents < 0 ? .cyan : .orange)
    }
    private var statusColor: Color { detector.isRunning ? .purple : .secondary }
}
