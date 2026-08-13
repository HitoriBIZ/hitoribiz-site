@preconcurrency import AVFoundation
import Foundation

enum MicrophonePermissionState {
    case unknown
    case granted
    case denied
}

final class PitchDetector: ObservableObject, @unchecked Sendable {
    @Published private(set) var detectedFrequency: Double?
    @Published private(set) var inputLevel: Double = 0
    @Published private(set) var isRunning = false
    @Published private(set) var microphonePermission: MicrophonePermissionState = .unknown
    @Published private(set) var statusMessage = "Ready"

    private let engine = AVAudioEngine()
    private var smoothedFrequency: Double?
    private var missedFrameCount = 0

    func start(targetFrequency: Double) {
        let session = AVAudioSession.sharedInstance()

        switch session.recordPermission {
        case .granted:
            microphonePermission = .granted
            startEngine(targetFrequency: targetFrequency)
        case .denied:
            microphonePermission = .denied
            detectedFrequency = nil
            inputLevel = 0
            isRunning = false
            statusMessage = "Microphone access is off"
        case .undetermined:
            microphonePermission = .unknown
            statusMessage = "Requesting microphone access"
            session.requestRecordPermission { [weak self] granted in
                DispatchQueue.main.async {
                    guard let self else { return }

                    if granted {
                        self.microphonePermission = .granted
                        self.startEngine(targetFrequency: targetFrequency)
                    } else {
                        self.microphonePermission = .denied
                        self.detectedFrequency = nil
                        self.inputLevel = 0
                        self.isRunning = false
                        self.statusMessage = "Microphone access is off"
                    }
                }
            }
        @unknown default:
            microphonePermission = .denied
            detectedFrequency = nil
            inputLevel = 0
            isRunning = false
            statusMessage = "Microphone permission is unavailable"
        }
    }

    func stop() {
        engine.inputNode.removeTap(onBus: 0)
        engine.stop()
        engine.reset()

        resetStabilityState()
        detectedFrequency = nil
        inputLevel = 0
        isRunning = false
        statusMessage = "Ready"
    }

    private func startEngine(targetFrequency: Double) {
        if isRunning {
            stop()
        }

        resetStabilityState()
        configureAudioSession()

        let inputNode = engine.inputNode
        let format = inputNode.outputFormat(forBus: 0)

        inputNode.removeTap(onBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 4096, format: format) { [weak self] buffer, _ in
            let result = Self.process(
                buffer: buffer,
                sampleRate: buffer.format.sampleRate,
                targetFrequency: targetFrequency
            )

            DispatchQueue.main.async { [weak self] in
                self?.inputLevel = result.level
                self?.publishStableFrequency(result.frequency)
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

    private func publishStableFrequency(_ frequency: Double?) {
        guard let frequency, frequency > 0 else {
            missedFrameCount += 1

            if missedFrameCount <= 8, let smoothedFrequency {
                detectedFrequency = smoothedFrequency
                statusMessage = "Holding tone"
            } else {
                detectedFrequency = nil
                statusMessage = missedFrameCount > 24 ? "No input detected" : "Listening..."
            }

            return
        }

        missedFrameCount = 0

        if let smoothedFrequency {
            let distanceInCents = abs(1200 * log2(frequency / smoothedFrequency))

            if distanceInCents < 700 {
                self.smoothedFrequency = (smoothedFrequency * 0.72) + (frequency * 0.28)
            } else {
                self.smoothedFrequency = frequency
            }
        } else {
            smoothedFrequency = frequency
        }

        detectedFrequency = smoothedFrequency
        statusMessage = "Pitch detected"
    }

    private func resetStabilityState() {
        smoothedFrequency = nil
        missedFrameCount = 0
    }

    private func configureAudioSession() {
        let session = AVAudioSession.sharedInstance()

        do {
            try session.setCategory(.playAndRecord, mode: .measurement, options: [.defaultToSpeaker])
            try? session.setPreferredSampleRate(44_100)
            try? session.setPreferredIOBufferDuration(0.02)
            if let builtInMic = session.availableInputs?.first(where: { $0.portType == .builtInMic }) {
                try? session.setPreferredInput(builtInMic)
            }
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
    ) -> (frequency: Double?, level: Double) {
        guard let channel = buffer.floatChannelData?[0] else {
            return (nil, 0)
        }

        let frameLength = Int(buffer.frameLength)
        guard frameLength > 0 else {
            return (nil, 0)
        }

        let samples = Array(UnsafeBufferPointer(start: channel, count: frameLength))
        let rms = sqrt(samples.reduce(0) { $0 + Double($1 * $1) } / Double(samples.count))
        let level = min(1, rms * 22)

        guard rms > 0.0025 else {
            return (nil, level)
        }

        return (
            Self.detectPitch(samples: samples, sampleRate: sampleRate, targetFrequency: targetFrequency),
            level
        )
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
        var scores = Array(repeating: 0.0, count: maxLag + 1)
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
            scores[lag] = score

            if score > bestScore {
                bestScore = score
                bestLag = lag
            }
        }

        guard bestScore > 0.45 else {
            return nil
        }

        var refinedLag = Double(bestLag)

        if bestLag > minLag, bestLag < maxLag {
            let left = scores[bestLag - 1]
            let center = scores[bestLag]
            let right = scores[bestLag + 1]
            let curvature = left - (2 * center) + right

            if abs(curvature) > 0.000_001 {
                let adjustment = 0.5 * (left - right) / curvature
                refinedLag += max(-0.5, min(0.5, adjustment))
            }
        }

        return sampleRate / refinedLag
    }
}
