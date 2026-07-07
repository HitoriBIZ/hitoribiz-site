import AVFoundation
import Foundation

enum MicrophonePermissionState {
    case unknown
    case granted
    case denied
}

@MainActor
final class PitchDetector: ObservableObject, @unchecked Sendable {
    @Published private(set) var detectedFrequency: Double?
    @Published private(set) var isRunning = false
    @Published private(set) var microphonePermission: MicrophonePermissionState = .unknown
    @Published private(set) var statusMessage = "Ready"

    private let engine = AVAudioEngine()

    func start(targetFrequency: Double) {
        switch AVAudioApplication.shared.recordPermission {
        case .granted:
            microphonePermission = .granted
            startEngine(targetFrequency: targetFrequency)
        case .denied:
            microphonePermission = .denied
            detectedFrequency = nil
            isRunning = false
            statusMessage = "Microphone access is off"
        case .undetermined:
            microphonePermission = .unknown
            statusMessage = "Requesting microphone access"
            AVAudioApplication.requestRecordPermission { [weak self] granted in
                Task { @MainActor in
                    guard let self else {
                        return
                    }

                    self.microphonePermission = granted ? .granted : .denied
                    if granted {
                        self.startEngine(targetFrequency: targetFrequency)
                    } else {
                        self.detectedFrequency = nil
                        self.isRunning = false
                        self.statusMessage = "Microphone access is off"
                    }
                }
            }
        @unknown default:
            microphonePermission = .denied
            detectedFrequency = nil
            isRunning = false
            statusMessage = "Microphone permission is unavailable"
        }
    }

    func stop() {
        engine.inputNode.removeTap(onBus: 0)
        engine.stop()

        detectedFrequency = nil
        isRunning = false
        statusMessage = "Ready"
    }

    private func startEngine(targetFrequency: Double) {
        if isRunning {
            stop()
        }

        configureAudioSession()

        let inputNode = engine.inputNode
        let format = inputNode.outputFormat(forBus: 0)

        inputNode.removeTap(onBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 4096, format: format) { [weak self] buffer, _ in
            let frequency = Self.process(
                buffer: buffer,
                sampleRate: format.sampleRate,
                targetFrequency: targetFrequency
            )

            DispatchQueue.main.async { [weak self] in
                self?.detectedFrequency = frequency
                self?.statusMessage = frequency == nil ? "Listening..." : "Pitch detected"
            }
        }

        do {
            try engine.start()
            isRunning = true
            statusMessage = "Listening..."
        } catch {
            detectedFrequency = nil
            isRunning = false
            statusMessage = "Could not start microphone"
        }
    }

    private func configureAudioSession() {
        let session = AVAudioSession.sharedInstance()

        do {
            try session.setCategory(.record, mode: .measurement, options: [.allowBluetoothHFP])
            try session.setActive(true)
        } catch {
            // The UI remains usable even if the audio session cannot be configured.
            statusMessage = "Audio session setup failed"
        }
    }

    nonisolated private static func process(
        buffer: AVAudioPCMBuffer,
        sampleRate: Double,
        targetFrequency: Double
    ) -> Double? {
        guard let channel = buffer.floatChannelData?[0] else {
            return nil
        }

        let frameLength = Int(buffer.frameLength)
        guard frameLength > 0 else {
            return nil
        }

        let samples = Array(UnsafeBufferPointer(start: channel, count: frameLength))
        let rms = sqrt(samples.reduce(0) { $0 + Double($1 * $1) } / Double(samples.count))

        guard rms > 0.01 else {
            return nil
        }

        return Self.detectPitch(samples: samples, sampleRate: sampleRate, targetFrequency: targetFrequency)
    }

    nonisolated static func detectPitch(samples: [Float], sampleRate: Double, targetFrequency: Double) -> Double? {
        guard samples.count > 32, sampleRate > 0, targetFrequency > 0 else {
            return nil
        }

        let minimumFrequency = 70.0
        let maximumFrequency = 1_200.0
        let minLag = max(8, Int(sampleRate / maximumFrequency))
        let maxLag = min(samples.count - 2, Int(sampleRate / minimumFrequency))

        guard minLag < maxLag else {
            return nil
        }

        let mean = samples.reduce(0.0) { $0 + Double($1) } / Double(samples.count)
        let centeredSamples = samples.map { Double($0) - mean }
        var bestLag = minLag
        var bestScore = -Double.infinity

        for lag in minLag...maxLag {
            var correlation = 0.0
            var energyA = 0.0
            var energyB = 0.0
            let limit = samples.count - lag

            for index in 0..<limit {
                let a = centeredSamples[index]
                let b = centeredSamples[index + lag]
                correlation += a * b
                energyA += a * a
                energyB += b * b
            }

            let denominator = sqrt(energyA * energyB)
            guard denominator > 0 else {
                continue
            }

            let score = correlation / denominator

            if score > bestScore {
                bestScore = score
                bestLag = lag
            }
        }

        guard bestScore > 0.45 else {
            return nil
        }

        return sampleRate / Double(bestLag)
    }
}
