import SwiftUI

struct ContentView: View {
    @StateObject private var model = TuningModel()
    @StateObject private var detector = PitchDetector()
    @StateObject private var tonePlayer = TonePlayer()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 18) {
                    statusPanel
                    microphoneNotice
                    actionButtons
                    controlsPanel
                }
                .padding()
            }
            .background(Self.appBackground)
            .navigationTitle("Wind and Brass Tuner")
            .onReceive(detector.$detectedFrequency) { frequency in
                model.updateDetectedFrequency(frequency)
            }
            .onChange(of: model.concertTarget.frequency) { _, newValue in
                if detector.isRunning {
                    detector.start(targetFrequency: newValue)
                }

                if tonePlayer.isPlaying {
                    tonePlayer.start(frequency: newValue)
                }
            }
        }
    }

    private var statusPanel: some View {
        VStack(spacing: 20) {
            HStack {
                Label(detector.statusMessage, systemImage: statusIconName)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(statusColor)

                Spacer()

                Text(model.transposition.shortName)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.secondary)
            }

            VStack(spacing: 4) {
                Text(model.concertTarget.label)
                    .font(.system(size: 58, weight: .bold, design: .rounded))

                Text("Concert target  \(String(format: "%.2f Hz", model.concertTarget.frequency))")
                    .font(.headline.monospacedDigit())
                    .foregroundStyle(.secondary)
            }

            VStack(spacing: 8) {
                Text(detectedFrequencyText)
                    .font(.system(size: 32, weight: .semibold, design: .rounded).monospacedDigit())
                    .foregroundStyle(model.detectedFrequency == nil ? .secondary : .primary)

                HStack(alignment: .firstTextBaseline, spacing: 8) {
                    Text(centsValueText)
                        .font(.system(size: 46, weight: .bold, design: .rounded).monospacedDigit())
                        .foregroundStyle(centsColor(model.cents))

                    if model.cents != nil {
                        Text("cents")
                            .font(.headline.weight(.semibold))
                            .foregroundStyle(.secondary)
                    }
                }

                Text(centsDirectionText)
                    .font(.headline.weight(.semibold))
                    .foregroundStyle(centsColor(model.cents))

                stableToneBadge
            }

            tuningMeter
            inputLevelView
        }
        .frame(maxWidth: .infinity)
        .padding(22)
        .background(Self.panelBackground)
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }

    @ViewBuilder
    private var stableToneBadge: some View {
        if model.isStableTone {
            Label("Stable tone", systemImage: "checkmark.seal.fill")
                .font(.subheadline.weight(.bold))
                .foregroundStyle(.green)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(Color.green.opacity(0.12))
                .clipShape(Capsule())
        }
    }

    @ViewBuilder
    private var microphoneNotice: some View {
        if detector.microphonePermission == .denied {
            VStack(alignment: .leading, spacing: 8) {
                Label("Microphone access is required", systemImage: "mic.slash.fill")
                    .font(.headline.weight(.semibold))

                Text("Open iPhone Settings and allow microphone access for WindBrassTuner, then return and tap Start again.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(16)
            .background(Color.orange.opacity(0.12))
            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
        }
    }

    private var tuningMeter: some View {
        GeometryReader { proxy in
            let width = proxy.size.width
            let center = width / 2
            let indicatorX = max(11, min(width - 11, center + (center * meterPosition)))

            ZStack(alignment: .topLeading) {
                Capsule()
                    .fill(
                        LinearGradient(
                            colors: [.blue.opacity(0.65), .green.opacity(0.85), .orange.opacity(0.75)],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .frame(height: 12)
                    .position(x: center, y: 18)

                ForEach(Self.meterTicks, id: \.self) { tick in
                    Rectangle()
                        .fill(tick == 0 ? Color.primary.opacity(0.46) : Color.primary.opacity(0.26))
                        .frame(width: tick == 0 ? 2 : 1, height: meterTickHeight(tick))
                        .position(x: meterXPosition(for: tick, width: width), y: 18)
                }

                Circle()
                    .fill(centsColor(model.cents))
                    .frame(width: 22, height: 22)
                    .shadow(radius: 3)
                    .position(x: indicatorX, y: 18)

                ForEach(Self.meterLabelTicks, id: \.self) { tick in
                    Text(meterTickLabel(tick))
                        .font(.caption2.monospacedDigit().weight(tick == 0 ? .bold : .medium))
                        .foregroundStyle(tick == 0 ? Color.primary.opacity(0.75) : Color.secondary)
                        .position(x: meterLabelXPosition(for: tick, width: width), y: 44)
                }
            }
        }
        .frame(height: 58)
        .padding(.horizontal, 8)
    }

    private var inputLevelView: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text("Mic Input")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)

                Spacer()

                Text(inputLevelText)
                    .font(.caption.monospacedDigit().weight(.semibold))
                    .foregroundStyle(.secondary)
            }

            GeometryReader { proxy in
                ZStack(alignment: .leading) {
                    Capsule()
                        .fill(Color.secondary.opacity(0.16))

                    Capsule()
                        .fill(detector.inputLevel > 0.08 ? Color.green.opacity(0.85) : Color.orange.opacity(0.75))
                        .frame(width: max(4, proxy.size.width * detector.inputLevel))
                }
            }
            .frame(height: 8)
        }
    }

    private var actionButtons: some View {
        HStack(spacing: 12) {
            Button {
                toggleDetector()
            } label: {
                Label(detector.isRunning ? "Stop" : "Listen", systemImage: detector.isRunning ? "stop.fill" : "mic.fill")
                    .font(.headline.weight(.bold))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
            }
            .buttonStyle(.borderedProminent)
            .tint(detector.isRunning ? .red : .blue)

            Button {
                tonePlayer.toggle(frequency: model.concertTarget.frequency)
            } label: {
                Label(tonePlayer.isPlaying ? "Stop Tone" : "Tone", systemImage: tonePlayer.isPlaying ? "speaker.slash.fill" : "speaker.wave.2.fill")
                    .font(.headline.weight(.bold))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
            }
            .buttonStyle(.bordered)
            .tint(.green)
        }
    }

    private var controlsPanel: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Tuning Setup")
                .font(.headline.weight(.bold))

            Menu {
                Picker("Instrument", selection: $model.transposition) {
                    ForEach(Transposition.allCases) { option in
                        Text(option.displayName).tag(option)
                    }
                }
            } label: {
                ControlMenuRow(
                    title: "Instrument",
                    value: model.transposition.displayName,
                    systemImage: "music.note.list"
                )
            }

            Menu {
                Picker("Target Note", selection: $model.writtenNote) {
                    ForEach(TunerNote.targetNotes) { note in
                        Text(note.label).tag(note)
                    }
                }
            } label: {
                ControlMenuRow(
                    title: "Target Note",
                    value: model.writtenNote.label,
                    systemImage: "target"
                )
            }

            Menu {
                Picker("A4 Reference", selection: $model.a4Reference) {
                    ForEach([440, 441, 442, 443, 444], id: \.self) { value in
                        Text("\(value) Hz").tag(Double(value))
                    }
                }
            } label: {
                ControlMenuRow(
                    title: "A4 Reference",
                    value: "\(Int(model.a4Reference)) Hz",
                    systemImage: "slider.horizontal.3"
                )
            }

            Divider()

            LabeledContent("Concert Pitch") {
                Text(model.concertTarget.label)
                    .fontWeight(.semibold)
            }

            LabeledContent("Target Frequency") {
                Text(String(format: "%.2f Hz", model.concertTarget.frequency))
                    .fontWeight(.semibold)
                    .monospacedDigit()
            }
        }
        .padding(18)
        .background(Self.panelBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }

    private var detectedFrequencyText: String {
        guard let frequency = model.detectedFrequency else {
            return detector.isRunning ? "Listening..." : "-- Hz"
        }

        return String(format: "%.2f Hz", frequency)
    }

    private var centsValueText: String {
        guard let cents = model.cents else {
            return detector.isRunning ? "--" : "0.0"
        }

        if abs(cents) < 3 {
            return "0.0"
        }

        return String(format: "%+.1f", cents)
    }

    private var centsDirectionText: String {
        guard let cents = model.cents else {
            return detector.isRunning ? "Waiting for a steady tone" : "Ready to tune"
        }

        if abs(cents) < 3 {
            return "In Tune"
        }

        return cents > 0 ? "Sharp" : "Flat"
    }

    private var inputLevelText: String {
        detector.isRunning ? "\(Int(detector.inputLevel * 100))%" : "--"
    }

    private var meterPosition: CGFloat {
        guard let cents = model.cents else {
            return 0
        }

        return CGFloat(max(-1, min(1, cents / 50)))
    }

    private func meterXPosition(for tick: Double, width: CGFloat) -> CGFloat {
        let center = width / 2
        return center + (center * CGFloat(max(-1, min(1, tick / 50))))
    }

    private func meterLabelXPosition(for tick: Double, width: CGFloat) -> CGFloat {
        max(18, min(width - 18, meterXPosition(for: tick, width: width)))
    }

    private func meterTickHeight(_ tick: Double) -> CGFloat {
        if tick == 0 || abs(tick) == 50 {
            return 32
        }

        if abs(tick) == 25 {
            return 24
        }

        return 16
    }

    private func meterTickLabel(_ tick: Double) -> String {
        if tick == 0 {
            return "0"
        }

        return String(format: "%+.0f", tick)
    }

    private var statusIconName: String {
        if detector.microphonePermission == .denied {
            return "mic.slash.fill"
        }

        return detector.isRunning ? "waveform" : "checkmark.circle"
    }

    private var statusColor: Color {
        if detector.microphonePermission == .denied {
            return .orange
        }

        return detector.isRunning ? .green : .secondary
    }

    private func toggleDetector() {
        if detector.isRunning {
            detector.stop()
        } else {
            detector.start(targetFrequency: model.concertTarget.frequency)
        }
    }

    private func centsColor(_ cents: Double?) -> Color {
        guard let cents else {
            return .secondary
        }

        if abs(cents) < 3 {
            return .green
        }

        return cents > 0 ? .orange : .blue
    }

    private static let appBackground = Color(red: 0.95, green: 0.96, blue: 0.98)
    private static let panelBackground = Color(red: 1.0, green: 1.0, blue: 1.0)
    private static let meterTicks: [Double] = [-50, -25, -10, -5, 0, 5, 10, 25, 50]
    private static let meterLabelTicks: [Double] = [-50, -25, 0, 25, 50]
}

private struct ControlMenuRow: View {
    let title: String
    let value: String
    let systemImage: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: systemImage)
                .font(.title3.weight(.semibold))
                .foregroundStyle(.blue)
                .frame(width: 28)

            VStack(alignment: .leading, spacing: 3) {
                Text(title)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.secondary)

                Text(value)
                    .font(.body.weight(.semibold))
            }

            Spacer()

            Image(systemName: "chevron.up.chevron.down")
                .font(.caption.weight(.bold))
                .foregroundStyle(.secondary)
        }
        .contentShape(Rectangle())
        .padding(12)
        .background(Color(red: 0.96, green: 0.97, blue: 0.99))
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }
}

#Preview {
    ContentView()
}
