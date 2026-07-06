import SwiftUI

struct ContentView: View {
    @StateObject private var model = TuningModel()
    @StateObject private var detector = PitchDetector()

    var body: some View {
        NavigationStack {
            VStack(spacing: 18) {
                statusPanel
                controls
                Spacer(minLength: 0)
            }
            .padding()
            .navigationTitle("Wind and Brass Tuner")
            .toolbar {
                Button(detector.isRunning ? "Stop" : "Start") {
                    toggleDetector()
                }
            }
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
        VStack(spacing: 12) {
            Text(model.concertTarget.label)
                .font(.system(size: 46, weight: .bold, design: .rounded))

            Text(String(format: "%.2f Hz", model.concertTarget.frequency))
                .font(.title3)
                .foregroundStyle(.secondary)

            if let detected = model.detectedFrequency, let cents = model.cents {
                Text(String(format: "%.2f Hz", detected))
                    .font(.title2.monospacedDigit())

                Text(centsText(cents))
                    .font(.system(size: 34, weight: .semibold, design: .rounded))
                    .foregroundStyle(centsColor(cents))
            } else {
                Text(detector.isRunning ? "Listening..." : "Ready")
                    .font(.title2)
                    .foregroundStyle(.secondary)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(24)
        .background(.thinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }

    private var controls: some View {
        Form {
            Picker("Instrument", selection: $model.transposition) {
                ForEach(Transposition.allCases) { option in
                    Text(option.displayName).tag(option)
                }
            }

            Picker("Target Note", selection: $model.writtenNote) {
                ForEach(TunerNote.targetNotes) { note in
                    Text(note.label).tag(note)
                }
            }

            Picker("A4 Reference", selection: $model.a4Reference) {
                ForEach([440, 441, 442, 443, 444], id: \.self) { value in
                    Text("\(value) Hz").tag(Double(value))
                }
            }

            LabeledContent("Concert Pitch") {
                Text(model.concertTarget.label)
            }

            LabeledContent("Target Frequency") {
                Text(String(format: "%.2f Hz", model.concertTarget.frequency))
                    .monospacedDigit()
            }
        }
        .formStyle(.grouped)
    }

    private func toggleDetector() {
        if detector.isRunning {
            detector.stop()
        } else {
            detector.start(targetFrequency: model.concertTarget.frequency)
        }
    }

    private func centsText(_ cents: Double) -> String {
        if abs(cents) < 3 {
            return "In Tune"
        }

        return String(format: "%+.1f cents", cents)
    }

    private func centsColor(_ cents: Double) -> Color {
        if abs(cents) < 3 {
            return .green
        }

        return cents > 0 ? .orange : .blue
    }
}

#Preview {
    ContentView()
}

