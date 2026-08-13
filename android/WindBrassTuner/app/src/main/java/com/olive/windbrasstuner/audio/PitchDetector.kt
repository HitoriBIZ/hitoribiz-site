package com.olive.windbrasstuner.audio

import android.annotation.SuppressLint
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlin.concurrent.thread
import kotlin.math.abs
import kotlin.math.log2
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sqrt
import java.util.concurrent.atomic.AtomicInteger

data class PitchDetectorState(
    val detectedFrequency: Double? = null,
    val isRunning: Boolean = false,
    val statusMessage: String = "Ready",
)

class PitchDetector {
    private val sampleRate = 44_100
    private val frameSize = 4096
    private val _state = MutableStateFlow(PitchDetectorState())
    val state: StateFlow<PitchDetectorState> = _state.asStateFlow()
    private val generation = AtomicInteger(0)

    @Volatile private var running = false
    private var audioRecord: AudioRecord? = null
    private var smoothedFrequency: Double? = null
    private var missedFrameCount = 0

    @SuppressLint("MissingPermission")
    fun start(targetFrequency: Double) {
        stop()
        val session = generation.incrementAndGet()
        val minimumBuffer = AudioRecord.getMinBufferSize(
            sampleRate,
            AudioFormat.CHANNEL_IN_MONO,
            AudioFormat.ENCODING_PCM_FLOAT,
        )
        if (minimumBuffer <= 0) {
            _state.value = PitchDetectorState(statusMessage = "Could not start microphone")
            return
        }

        val recorder = AudioRecord(
            MediaRecorder.AudioSource.DEFAULT,
            sampleRate,
            AudioFormat.CHANNEL_IN_MONO,
            AudioFormat.ENCODING_PCM_FLOAT,
            max(minimumBuffer, frameSize * Float.SIZE_BYTES * 2),
        )
        if (recorder.state != AudioRecord.STATE_INITIALIZED) {
            recorder.release()
            _state.value = PitchDetectorState(statusMessage = "Could not start microphone")
            return
        }

        audioRecord = recorder
        smoothedFrequency = null
        missedFrameCount = 0
        running = true
        recorder.startRecording()
        _state.value = PitchDetectorState(isRunning = true, statusMessage = "Listening...")

        thread(name = "WindBrassPitchDetector", isDaemon = true) {
            val samples = FloatArray(frameSize)
            while (running && generation.get() == session) {
                val count = recorder.read(samples, 0, samples.size, AudioRecord.READ_BLOCKING)
                if (count > 32 && generation.get() == session) {
                    publishStableFrequency(detectPitch(samples, count, sampleRate.toDouble(), targetFrequency))
                }
            }
        }
    }

    fun stop() {
        generation.incrementAndGet()
        running = false
        audioRecord?.let { recorder ->
            runCatching { recorder.stop() }
            recorder.release()
        }
        audioRecord = null
        smoothedFrequency = null
        missedFrameCount = 0
        _state.value = PitchDetectorState()
    }

    private fun publishStableFrequency(frequency: Double?) {
        if (frequency == null || frequency <= 0) {
            missedFrameCount++
            val held = smoothedFrequency.takeIf { missedFrameCount <= 5 }
            _state.value = PitchDetectorState(
                detectedFrequency = held,
                isRunning = running,
                statusMessage = if (held != null) "Holding tone" else "Listening...",
            )
            return
        }

        missedFrameCount = 0
        smoothedFrequency = smoothedFrequency?.let { previous ->
            val distanceInCents = abs(1200 * log2(frequency / previous))
            if (distanceInCents < 700) previous * 0.72 + frequency * 0.28 else frequency
        } ?: frequency
        _state.value = PitchDetectorState(smoothedFrequency, running, "Pitch detected")
    }

    companion object {
        internal fun detectPitch(samples: FloatArray, count: Int, sampleRate: Double, targetFrequency: Double): Double? {
            if (count <= 32 || sampleRate <= 0 || targetFrequency <= 0) return null
            var energy = 0.0
            var sum = 0.0
            for (index in 0 until count) {
                val value = samples[index].toDouble()
                energy += value * value
                sum += value
            }
            if (sqrt(energy / count) <= 0.01) return null

            val mean = sum / count
            val centered = DoubleArray(count) { samples[it] - mean }
            val minLag = max(8, (sampleRate / 1_200.0).toInt())
            val maxLag = min(count - 2, (sampleRate / 70.0).toInt())
            if (minLag >= maxLag) return null

            val scores = DoubleArray(maxLag + 1)
            var bestLag = minLag
            var bestScore = Double.NEGATIVE_INFINITY
            for (lag in minLag..maxLag) {
                var correlation = 0.0
                var energyA = 0.0
                var energyB = 0.0
                for (index in 0 until count - lag) {
                    val a = centered[index]
                    val b = centered[index + lag]
                    correlation += a * b
                    energyA += a * a
                    energyB += b * b
                }
                val denominator = sqrt(energyA * energyB)
                if (denominator <= 0) continue
                val score = correlation / denominator
                scores[lag] = score
                if (score > bestScore) {
                    bestScore = score
                    bestLag = lag
                }
            }
            if (bestScore <= 0.45) return null

            var refinedLag = bestLag.toDouble()
            if (bestLag > minLag && bestLag < maxLag) {
                val curvature = scores[bestLag - 1] - 2 * scores[bestLag] + scores[bestLag + 1]
                if (abs(curvature) > 0.000_001) {
                    refinedLag += (0.5 * (scores[bestLag - 1] - scores[bestLag + 1]) / curvature).coerceIn(-0.5, 0.5)
                }
            }
            return sampleRate / refinedLag
        }
    }
}
