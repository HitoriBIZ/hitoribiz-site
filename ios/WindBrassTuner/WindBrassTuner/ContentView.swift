import SwiftUI

struct ContentView: View {
    @StateObject private var model = TuningModel()
    @StateObject private var detector = PitchDetector()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 18) {
                    statusPanel
                    startButton
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
            }
        }
    }

    private var statusPanel: some View {
        VStack(spacing: 18) {
            HStack {
                Label(detector.isRunning ? "Listening" : "Ready", systemImage: detector.isRunning ? "waveform" : "checkmark.circle")
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(detector.isRunning ? .green : .secondary)

                Spacer()

                Text(model.transposition.shortName)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.secondary)
            }

            VStack(spacing: 4) {
                Text(model.concertTarget.label)
                    .font(.system(size: 58, weight: .bold, design: .rounded))

                Text(String(format: "Target %.2f Hz", model.concertTarget.frequency))
                    .font(.headline.monospacedDigit())
                    .foregroundStyle(.secondary)
            }

            VStack(spacing: 6) {
                Text(detectedFrequencyText)
                    .font(.system(size: 34, weight: .semibold, design: .rounded).monospacedDigit())

                Text(centsStatusText)
                    .font(.system(size: 38, weight: .bold, design: .rounded).monospacedDigit())
                    .foregroundStyle(centsColor(model.cents))
            }

            tuningMeter
        }
        .frame(maxWidth: .infinity)
        .padding(22)
        .background(Self.panelBackground)
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }

    private var tuningMeter: some View {
        GeometryReader { proxy in
            let width = proxy.size.width
            let center = width / 2
            let offset = center * meterPosition

            ZStack(alignment: .center) {
                Capsule()
                    .fill(
                        LinearGradient(
                            colors: [.blue.opacity(0.65), .green.opacity(0.85), .orange.opacity(0.75)],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .frame(height: 12)

                Rectangle()
                    .fill(.primary.opacity(0.35))
                    .frame(width: 2, height: 34)

                Circle()
                    .fill(centsColor(model.cents))
                    .frame(width: 22, height: 22)
                    .shadow(radius: 3)
                    .offset(x: offset)
            }
        }
        .frame(height: 36)
        .padding(.horizontal, 8)
    }

    private var startButton: some View {
        Button {
            toggleDetector()
        } label: {
            HStack {
                Image(systemName: detector.isRunning ? "stop.fill" : "play.fill")
                Text(detector.isRunning ? "Stop" : "Start")
            }
            .font(.title3.weight(.bold))
            .frame(maxWidth: .infinity)
            .padding(.vertical, 15)
        }
        .buttonStyle(.borderedProminent)
        .tint(detector.isRunning ? .red : .blue)
    }

    private var controlsPanel: some View {
        VStack(spacing: 14) {
            PickerRow(title: "Instrument") {
                Picker("Instrument", selection: $model.transposition) {
                    ForEach(Transposition.allCases) { option in
                        Text(option.displayName).tag(option)
                    }
                }
                .pickerStyle(.menu)
            }

            PickerRow(title: "Target Note") {
                Picker("Target Note", selection: $model.writtenNote) {
                    ForEach(TunerNote.targetNotes) { note in
                        Text(note.label).tag(note)
                    }
                }
                .pickerStyle(.menu)
            }

            PickerRow(title: "A4 Reference") {
                Picker("A4 Reference", selection: $model.a4Reference) {
                    ForEach([440, 441, 442, 443, 444], id: \.self) { value in
                        Text("\(value) Hz").tag(Double(value))
                    }
                }
                .pickerStyle(.menu)
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
            return "-- Hz"
        }

        return String(format: "%.2f Hz", frequency)
    }

    private var centsStatusText: String {
        guard let cents = model.cents else {
            return detector.isRunning ? "Listening" : "Ready"
        }

        if abs(cents) < 3 {
            return "In Tune"
        }

        return String(format: "%+.1f cents", cents)
    }

    private var meterPosition: CGFloat {
        guard let cents = model.cents else {
            return 0
        }

        return CGFloat(max(-1, min(1, cents / 50)))
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
}

private struct PickerRow<Content: View>: View {
    let title: String
    @ViewBuilder let content: Content

    var body: some View {
        HStack {
            Text(title)
                .fontWeight(.medium)

            Spacer()

            content
        }
    }
}

#Preview {
    ContentView()
}
