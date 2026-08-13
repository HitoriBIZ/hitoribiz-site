@preconcurrency import AVFoundation
import Foundation

final class TonePlayer: ObservableObject, @unchecked Sendable {
    @Published private(set) var isPlaying = false

    private let engine = AVAudioEngine()
    private lazy var sourceNode = AVAudioSourceNode { [weak self] _, _, frameCount, audioBufferList -> OSStatus in
        guard let self else { return noErr }

        let ablPointer = UnsafeMutableAudioBufferListPointer(audioBufferList)
        let thetaIncrement = 2.0 * Double.pi * self.frequency / self.sampleRate
        let amplitude: Float = 0.18

        for frame in 0..<Int(frameCount) {
            let sample = Float(sin(self.phase)) * amplitude
            self.phase += thetaIncrement

            if self.phase >= 2.0 * Double.pi {
                self.phase -= 2.0 * Double.pi
            }

            for buffer in ablPointer {
                let pointer = buffer.mData?.assumingMemoryBound(to: Float.self)
                pointer?[frame] = sample
            }
        }

        return noErr
    }
    private var phase = 0.0
    private var frequency = 440.0
    private var sampleRate = 44_100.0

    func start(frequency: Double) {
        self.frequency = max(40, min(2_000, frequency))

        if isPlaying {
            return
        }

        configureAudioSession()

        let outputFormat = engine.outputNode.inputFormat(forBus: 0)
        sampleRate = outputFormat.sampleRate > 0 ? outputFormat.sampleRate : 44_100

        engine.attach(sourceNode)
        engine.connect(sourceNode, to: engine.mainMixerNode, format: outputFormat)

        do {
            try engine.start()
            isPlaying = true
        } catch {
            engine.detach(sourceNode)
            isPlaying = false
        }
    }

    func stop() {
        engine.stop()
        engine.reset()

        if sourceNode.engine != nil {
            engine.detach(sourceNode)
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
            try session.setCategory(.playback, mode: .default, options: [.duckOthers])
            try session.setActive(true)
        } catch {
            // The button simply remains available if output setup fails.
        }
    }
}
