import Testing
@testable import WindBrassTunerPrototype

@Test func defaultA4ReferenceIs442Hz() {
    let model = TuningModel()

    #expect(model.transposition == .concert)
    #expect(model.writtenNote.label == "A4")
    #expect(model.a4Reference == 442)
    #expect(model.concertTarget.label == "A4")
    #expect(abs(model.concertTarget.frequency - 442) < 0.001)
}

@Test func bFlatInstrumentWrittenC5SoundsConcertBFlat4() {
    let model = TuningModel()
    model.transposition = .bFlat
    model.writtenNote = TunerNote.targetNotes.first { $0.label == "C5" }!

    #expect(model.concertTarget.label == "B-flat4")
}

@Test func eFlatInstrumentWrittenC5SoundsConcertEFlat4() {
    let model = TuningModel()
    model.transposition = .eFlat
    model.writtenNote = TunerNote.targetNotes.first { $0.label == "C5" }!

    #expect(model.concertTarget.label == "E-flat4")
}

@Test func fInstrumentWrittenC5SoundsConcertF4() {
    let model = TuningModel()
    model.transposition = .f
    model.writtenNote = TunerNote.targetNotes.first { $0.label == "C5" }!

    #expect(model.concertTarget.label == "F4")
}

