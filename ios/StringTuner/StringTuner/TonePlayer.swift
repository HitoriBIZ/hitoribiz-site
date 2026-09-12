@preconcurrency import AVFoundation
import Foundation

final class TonePlayer: ObservableObject, @unchecked Sendable {
    @Published private(set) var isPlaying = false
    private let engine = AVAudioEngine()
    private let player = AVAudioPlayerNode()
    private let sampleRate = 44_100.0

    func start(frequency: Double, midiNote: Int) {
        stop()
        let session = AVAudioSession.sharedInstance()
        try? session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
        try? session.setActive(true)

        guard let format = AVAudioFormat(commonFormat: .pcmFormatFloat32,
                                         sampleRate: sampleRate, channels: 1, interleaved: false),
              let buffer = makeBuffer(frequency: frequency, midiNote: midiNote, format: format) else { return }
        engine.attach(player)
        engine.connect(player, to: engine.mainMixerNode, format: format)
        do {
            try engine.start()
            player.scheduleBuffer(buffer, at: nil, options: [.loops])
            player.play()
            isPlaying = true
        } catch { stop() }
    }

    func stop() {
        player.stop()
        engine.stop()
        engine.reset()
        if player.engine != nil { engine.detach(player) }
        isPlaying = false
    }

    private func makeBuffer(frequency: Double, midiNote: Int, format: AVAudioFormat) -> AVAudioPCMBuffer? {
        let frameCount = AVAudioFrameCount(sampleRate)
        guard let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: frameCount),
              let channel = buffer.floatChannelData?[0] else { return nil }
        buffer.frameLength = frameCount
        let harmonics: [(Double, Double)] = midiNote <= 43
            ? [(1, 0.16), (2, 0.12), (3, 0.08), (4, 0.05)]
            : midiNote <= 50 ? [(1, 0.15), (2, 0.10), (3, 0.065), (4, 0.035)]
            : midiNote <= 57 ? [(1, 0.14), (2, 0.075), (3, 0.04)]
            : [(1, 0.12), (2, 0.035), (3, 0.018)]
        let fadeFrames = Int(sampleRate * 0.015)
        for frame in 0..<Int(frameCount) {
            let fade = min(1, min(Double(frame), Double(Int(frameCount) - frame)) / Double(fadeFrames))
            let time = Double(frame) / sampleRate
            channel[frame] = Float(harmonics.reduce(0) { sum, item in
                sum + sin(2 * .pi * frequency * item.0 * time) * item.1
            } * fade)
        }
        return buffer
    }
}
