@preconcurrency import AVFoundation
import Foundation

final class TonePlayer: ObservableObject, @unchecked Sendable {
    @Published private(set) var isPlaying = false

    private let engine = AVAudioEngine()
    private let playerNode = AVAudioPlayerNode()
    private let sampleRate = 44_100.0

    func start(frequency: Double) {
        if isPlaying {
            stop()
        }

        configureAudioSession()

        let safeFrequency = max(40, min(2_000, frequency))
        let format = AVAudioFormat(
            commonFormat: .pcmFormatFloat32,
            sampleRate: sampleRate,
            channels: 1,
            interleaved: false
        )

        guard let format, let buffer = makeToneBuffer(frequency: safeFrequency, format: format) else {
            isPlaying = false
            return
        }

        if playerNode.engine == nil {
            engine.attach(playerNode)
            engine.connect(playerNode, to: engine.mainMixerNode, format: format)
        }

        do {
            try engine.start()
            playerNode.scheduleBuffer(buffer, at: nil, options: [.loops])
            playerNode.play()
            isPlaying = true
        } catch {
            if playerNode.engine != nil {
                engine.detach(playerNode)
            }
            isPlaying = false
        }
    }

    func stop() {
        playerNode.stop()
        engine.stop()
        engine.reset()

        if playerNode.engine != nil {
            engine.detach(playerNode)
        }

        isPlaying = false
    }

    func toggle(frequency: Double) {
        if isPlaying {
            stop()
        } else {
            start(frequency: frequency)
        }
    }

    private func configureAudioSession() {
        let session = AVAudioSession.sharedInstance()

        do {
            try session.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker, .mixWithOthers])
            try session.overrideOutputAudioPort(.speaker)
            try session.setActive(true)
        } catch {
            // The button simply remains available if output setup fails.
        }
    }

    private func makeToneBuffer(frequency: Double, format: AVAudioFormat) -> AVAudioPCMBuffer? {
        let frameCount = AVAudioFrameCount(sampleRate)
        guard let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: frameCount) else {
            return nil
        }

        buffer.frameLength = frameCount

        guard let channel = buffer.floatChannelData?[0] else {
            return nil
        }

        let fadeFrames = Int(sampleRate * 0.01)
        let thetaIncrement = 2.0 * Double.pi * frequency / sampleRate

        for frame in 0..<Int(frameCount) {
            let fadeIn = min(1.0, Double(frame) / Double(fadeFrames))
            let fadeOut = min(1.0, Double(Int(frameCount) - frame) / Double(fadeFrames))
            let envelope = Float(min(fadeIn, fadeOut))
            channel[frame] = Float(sin(Double(frame) * thetaIncrement)) * 0.35 * envelope
        }

        return buffer
    }
}
