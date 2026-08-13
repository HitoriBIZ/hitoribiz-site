package com.olive.windbrasstuner.model

import kotlin.math.abs
import kotlin.math.log2
import kotlin.math.pow

enum class Transposition(
    val displayName: String,
    val shortName: String,
    val concertOffsetFromWritten: Int,
) {
    CONCERT("Concert Pitch", "Concert", 0),
    B_FLAT("B-flat Instrument", "B-flat", -2),
    E_FLAT("E-flat Instrument", "E-flat", -9),
    F("F Instrument", "F", -7),
}

data class TunerNote(val label: String, val midiNote: Int) {
    companion object {
        val targetNotes = listOf(
            TunerNote("A4", 69),
            TunerNote("B-flat4", 70),
            TunerNote("C5", 72),
            TunerNote("D5", 74),
            TunerNote("E-flat5", 75),
            TunerNote("F5", 77),
            TunerNote("G5", 79),
        )

        fun labelFor(midiNote: Int): String {
            val names = listOf("C", "C-sharp", "D", "E-flat", "E", "F", "F-sharp", "G", "A-flat", "A", "B-flat", "B")
            return "${names[midiNote.mod(12)]}${midiNote / 12 - 1}"
        }
    }
}

data class ConcertTarget(val label: String, val frequency: Double)

class TuningModel {
    var transposition = Transposition.CONCERT
    var writtenNote = TunerNote.targetNotes.first()
    var a4Reference = 442.0
    var detectedFrequency: Double? = null
        private set
    var cents: Double? = null
        private set
    var isStableTone = false
        private set

    private val recentCents = ArrayDeque<Double>()

    val concertTarget: ConcertTarget
        get() {
            val concertMidi = writtenNote.midiNote + transposition.concertOffsetFromWritten
            return ConcertTarget(
                label = TunerNote.labelFor(concertMidi),
                frequency = frequencyForMidiNote(concertMidi, a4Reference),
            )
        }

    fun updateDetectedFrequency(frequency: Double?) {
        detectedFrequency = frequency
        if (frequency == null || frequency <= 0) {
            cents = null
            isStableTone = false
            recentCents.clear()
            return
        }

        val newCents = 1200 * log2(frequency / concertTarget.frequency)
        cents = newCents
        recentCents.addLast(newCents)
        while (recentCents.size > 8) recentCents.removeFirst()

        if (recentCents.size < 6) {
            isStableTone = false
            return
        }

        val average = recentCents.average()
        val spread = recentCents.maxOf { abs(it - average) }
        isStableTone = abs(average) <= 5 && spread <= 3.5
    }

    private fun frequencyForMidiNote(midiNote: Int, a4: Double): Double =
        a4 * 2.0.pow((midiNote - 69) / 12.0)
}
