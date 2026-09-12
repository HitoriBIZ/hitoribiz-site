import Foundation

enum StringInstrument: String, CaseIterable, Identifiable {
    case violin
    case viola
    case cello

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .violin: return L10n.text("Violin", "バイオリン")
        case .viola: return L10n.text("Viola", "ビオラ")
        case .cello: return L10n.text("Cello", "チェロ")
        }
    }

    var strings: [OpenString] {
        switch self {
        case .violin:
            return [.init(label: "G", scientificName: "G3", midiNote: 55),
                    .init(label: "D", scientificName: "D4", midiNote: 62),
                    .init(label: "A", scientificName: "A4", midiNote: 69),
                    .init(label: "E", scientificName: "E5", midiNote: 76)]
        case .viola:
            return [.init(label: "C", scientificName: "C3", midiNote: 48),
                    .init(label: "G", scientificName: "G3", midiNote: 55),
                    .init(label: "D", scientificName: "D4", midiNote: 62),
                    .init(label: "A", scientificName: "A4", midiNote: 69)]
        case .cello:
            return [.init(label: "C", scientificName: "C2", midiNote: 36),
                    .init(label: "G", scientificName: "G2", midiNote: 43),
                    .init(label: "D", scientificName: "D3", midiNote: 50),
                    .init(label: "A", scientificName: "A3", midiNote: 57)]
        }
    }

    func searchRangeCents(for midi: Int) -> Double {
        switch (self, midi) {
        case (.violin, 69): return 220
        case (.violin, 76): return 320
        case (.violin, 62): return 430
        case (.violin, 55): return 520
        case (.viola, 69): return 240
        case (.viola, 62): return 420
        case (.viola, 55): return 520
        case (.viola, 48): return 600
        case (.cello, 57): return 420
        case (.cello, 50): return 560
        case (.cello, 43): return 700
        case (.cello, 36): return 820
        default: return 420
        }
    }
}

struct OpenString: Hashable, Identifiable {
    let label: String
    let scientificName: String
    let midiNote: Int
    var id: Int { midiNote }
}

@MainActor
final class TuningModel: ObservableObject {
    @Published var instrument: StringInstrument = .violin {
        didSet { selectedString = instrument.strings[2]; resetDetection() }
    }
    @Published var selectedString = StringInstrument.violin.strings[2] {
        didSet { resetDetection() }
    }
    @Published var a4Reference = 442.0 {
        didSet { resetDetection() }
    }
    @Published private(set) var detectedFrequency: Double?
    @Published private(set) var cents: Double?
    @Published private(set) var isStableTone = false

    private var recentCents: [Double] = []

    var targetFrequency: Double {
        Self.frequency(midi: selectedString.midiNote, a4: a4Reference)
    }

    var searchRangeCents: Double {
        instrument.searchRangeCents(for: selectedString.midiNote)
    }

    func updateDetectedFrequency(_ frequency: Double?) {
        detectedFrequency = frequency
        guard let frequency, frequency > 0 else {
            cents = nil
            isStableTone = false
            recentCents.removeAll()
            return
        }

        let newCents = 1200 * log2(frequency / targetFrequency)
        cents = newCents
        recentCents.append(newCents)
        if recentCents.count > 8 { recentCents.removeFirst(recentCents.count - 8) }

        guard recentCents.count >= 6 else {
            isStableTone = false
            return
        }
        let average = recentCents.reduce(0, +) / Double(recentCents.count)
        let spread = recentCents.map { abs($0 - average) }.max() ?? 0
        isStableTone = abs(average) <= 5 && spread <= 3.5
    }

    func resetDetection() {
        detectedFrequency = nil
        cents = nil
        isStableTone = false
        recentCents.removeAll()
    }

    static func frequency(midi: Int, a4: Double) -> Double {
        a4 * pow(2, Double(midi - 69) / 12)
    }
}
