package com.olive.windbrasstuner.model

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class TuningModelTest {
    @Test fun defaultA4ReferenceIs442Hz() {
        val model = TuningModel()
        assertEquals(Transposition.CONCERT, model.transposition)
        assertEquals("A4", model.writtenNote.label)
        assertEquals("A4", model.concertTarget.label)
        assertEquals(442.0, model.concertTarget.frequency, 0.001)
    }

    @Test fun bFlatInstrumentWrittenC5SoundsConcertBFlat4() {
        val model = TuningModel().apply {
            transposition = Transposition.B_FLAT
            writtenNote = TunerNote.targetNotes.first { it.label == "C5" }
        }
        assertEquals("B-flat4", model.concertTarget.label)
    }

    @Test fun eFlatInstrumentWrittenC5SoundsConcertEFlat4() {
        val model = TuningModel().apply {
            transposition = Transposition.E_FLAT
            writtenNote = TunerNote.targetNotes.first { it.label == "C5" }
        }
        assertEquals("E-flat4", model.concertTarget.label)
    }

    @Test fun stableToneRequiresSixCloseReadings() {
        val model = TuningModel()
        repeat(6) { model.updateDetectedFrequency(442.0) }
        assertTrue(model.isStableTone)
    }
}
