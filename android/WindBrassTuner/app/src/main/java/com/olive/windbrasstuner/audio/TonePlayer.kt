package com.olive.windbrasstuner.audio

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlin.math.PI
import kotlin.math.sin

class TonePlayer {
    private val sampleRate = 44_100
    private var audioTrack: AudioTrack? = null
    private val _isPlaying = MutableStateFlow(false)
    val isPlaying: StateFlow<Boolean> = _isPlaying.asStateFlow()

    @Synchronized
    fun start(frequency: Double) {
        stop()
        val safeFrequency = frequency.coerceIn(40.0, 2_000.0)
        val samples = ShortArray(sampleRate) { frame ->
            val fadeFrames = sampleRate / 100
            val fadeIn = (frame.toDouble() / fadeFrames).coerceAtMost(1.0)
            val fadeOut = ((sampleRate - frame).toDouble() / fadeFrames).coerceAtMost(1.0)
            val envelope = minOf(fadeIn, fadeOut)
            (sin(2.0 * PI * frame * safeFrequency / sampleRate) * Short.MAX_VALUE * 0.35 * envelope).toInt().toShort()
        }
        val track = AudioTrack.Builder()
            .setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build(),
            )
            .setAudioFormat(
                AudioFormat.Builder()
                    .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                    .setSampleRate(sampleRate)
                    .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                    .build(),
            )
            .setTransferMode(AudioTrack.MODE_STATIC)
            .setBufferSizeInBytes(samples.size * 2)
            .build()
        track.write(samples, 0, samples.size)
        track.setLoopPoints(0, samples.size, -1)
        track.play()
        audioTrack = track
        _isPlaying.value = true
    }

    @Synchronized
    fun stop() {
        audioTrack?.let { track ->
            runCatching { track.stop() }
            track.release()
        }
        audioTrack = null
        _isPlaying.value = false
    }

    fun toggle(frequency: Double) {
        if (_isPlaying.value) stop() else start(frequency)
    }
}
