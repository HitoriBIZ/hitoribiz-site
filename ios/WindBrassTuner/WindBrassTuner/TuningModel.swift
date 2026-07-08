import Foundation

enum Transposition: String, CaseIterable, Identifiable {
    case concert
    case bFlat
    case eFlat
    case f

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .concert:
            return "Concert Pitch"
        case .bFlat:
            return "B-flat Instrument"
        case .eFlat:
            return "E-flat Instrument"
        case .f:
            return "F Instrument"
        }
    }

    var shortName: String {
        switch self {
        case .concert:
            return "Concert"
        case .bFlat:
            return "B-flat"
        case .eFlat:
            return "E-flat"
        case .f:
            return "F"
        }
    }

    var concertOffsetFromWritten: Int {
        switch self {
        case .concert:
            return 0
        case .bFlat:
            return -2
        case .eFlat:
            return -9
        case .f:
            return -7
        }
    }
}

struct TunerNote: Hashable, Identifiable {
    let label: String
    let midiNote: Int

    var id: Int { midiNote }

    static let targetNotes: [TunerNote] = [
        TunerNote(label: "A4", midiNote: 69),
        TunerNote(label: "B-flat4", midiNote: 70),
        TunerNote(label: "C5", midiNote: 72),
        TunerNote(label: "D5", midiNote: 74),
        TunerNote(label: "E-flat5", midiNote: 75),
        TunerNote(label: "F5", midiNote: 77),
        TunerNote(label: "G5", midiNote: 79)
    ]

    static func label(for midiNote: Int) -> String {
        let names = ["C", "C-sharp", "D", "E-flat", "E", "F", "F-sharp", "G", "A-flat", "A", "B-flat", "B"]
        let octave = (midiNote / 12) - 1
        return "\(names[midiNote % 12])\(octave)"
    }
}

struct ConcertTarget {
    let label: String
    let frequency: Double
}

final class TuningModel: ObservableObject {
    @Published var transposition: Transposition = .concert
    @Published var writtenNote: TunerNote = TunerNote.targetNotes[0]
    @Published var a4Reference: Double = 442
    @Published private(set) var detectedFrequency: Double?
    @Published private(set) var cents: Double?
    @Published private(set) var isStableTone = false

    private var recentCents: [Double] = []

    var concertTarget: ConcertTarget {
        let concertMidi = writtenNote.midiNote + transposition.concertOffsetFromWritten
        return ConcertTarget(
            label: TunerNote.label(for: concertMidi),
            frequency: frequency(forMIDINote: concertMidi, a4: a4Reference)
        )
    }

    func updateDetectedFrequency(_ frequency: Double?) {
        detectedFrequency = frequency

        guard let frequency, frequency > 0 else {
            cents = nil
            isStableTone = false
            recentCents.removeAll()
            return
        }

        let newCents = 1200 * log2(frequency / concertTarget.frequency)
        cents = newCents
        updateStableToneState(with: newCents)
    }

    private func frequency(forMIDINote midiNote: Int, a4: Double) -> Double {
        a4 * pow(2, Double(midiNote - 69) / 12)
    }

    private func updateStableToneState(with cents: Double) {
        recentCents.append(cents)

        if recentCents.count > 8 {
            recentCents.removeFirst(recentCents.count - 8)
        }

        guard recentCents.count >= 6 else {
            isStableTone = false
            return
        }

        let average = recentCents.reduce(0, +) / Double(recentCents.count)
        let spread = recentCents.map { abs($0 - average) }.max() ?? 0
        isStableTone = abs(average) <= 5 && spread <= 3.5
    }
}
