@preconcurrency import AVFoundation
import Foundation

enum MicrophonePermissionState { case unknown, granted, denied }

@MainActor
final class PitchDetector: ObservableObject, @unchecked Sendable {
    @Published private(set) var detectedFrequency: Double?
    @Published private(set) var inputLevel = 0.0
    @Published private(set) var isRunning = false
    @Published private(set) var microphonePermission: MicrophonePermissionState = .unknown
    @Published private(set) var statusMessage = L10n.ready

    private let engine = AVAudioEngine()
    private var smoothedFrequency: Double?
    private var missedFrameCount = 0

    func start(targetFrequency: Double, rangeCents: Double) {
        switch AVAudioApplication.shared.recordPermission {
        case .granted:
            microphonePermission = .granted
            startEngine(targetFrequency: targetFrequency, rangeCents: rangeCents)
        case .denied:
            microphonePermission = .denied
            clear(message: L10n.microphoneOff)
        case .undetermined:
            microphonePermission = .unknown
            statusMessage = L10n.requestingMicrophone
            AVAudioApplication.requestRecordPermission { [weak self] granted in
                Task { @MainActor in
                    self?.microphonePermission = granted ? .granted : .denied
                    if granted {
                        self?.startEngine(targetFrequency: targetFrequency, rangeCents: rangeCents)
                    } else {
                        self?.clear(message: L10n.microphoneOff)
                    }
                }
            }
        @unknown default:
            microphonePermission = .denied
            clear(message: L10n.microphoneUnavailable)
        }
    }

    func stop() {
        engine.inputNode.removeTap(onBus: 0)
        engine.stop()
        engine.reset()
        smoothedFrequency = nil
        missedFrameCount = 0
        clear(message: L10n.ready)
    }

    private func clear(message: String) {
        detectedFrequency = nil
        inputLevel = 0
        isRunning = false
        statusMessage = message
    }

    private func startEngine(targetFrequency: Double, rangeCents: Double) {
        if isRunning { stop() }
        smoothedFrequency = nil
        missedFrameCount = 0
        configureAudioSession()

        let input = engine.inputNode
        let format = input.outputFormat(forBus: 0)
        input.removeTap(onBus: 0)
        input.installTap(onBus: 0, bufferSize: 8192, format: format) { [weak self] buffer, _ in
            let result = Self.process(buffer: buffer,
                                      sampleRate: buffer.format.sampleRate,
                                      targetFrequency: targetFrequency,
                                      rangeCents: rangeCents)
            Task { @MainActor [weak self] in
                self?.inputLevel = result.level
                self?.publish(result.frequency)
            }
        }

        do {
            try engine.start()
            isRunning = true
            statusMessage = L10n.listening
        } catch {
            clear(message: L10n.microphoneFailed)
        }
    }

    private func configureAudioSession() {
        let session = AVAudioSession.sharedInstance()
        do {
            try session.setCategory(.record, mode: .measurement, options: [])
            try? session.setPreferredSampleRate(44_100)
            try? session.setPreferredIOBufferDuration(0.02)
            try session.setActive(true)
        } catch {
            statusMessage = L10n.microphoneSetupFailed
        }
    }

    private func publish(_ frequency: Double?) {
        guard let frequency else {
            missedFrameCount += 1
            if missedFrameCount <= 5, let smoothedFrequency {
                detectedFrequency = smoothedFrequency
                statusMessage = L10n.holdingTone
            } else {
                detectedFrequency = nil
                statusMessage = missedFrameCount > 12 ? L10n.noInput : L10n.listening
            }
            return
        }

        missedFrameCount = 0
        if let current = smoothedFrequency {
            let distance = abs(1200 * log2(frequency / current))
            smoothedFrequency = distance < 300 ? current * 0.72 + frequency * 0.28 : frequency
        } else {
            smoothedFrequency = frequency
        }
        detectedFrequency = smoothedFrequency
        statusMessage = L10n.pitchDetected
    }

    nonisolated private static func process(
        buffer: AVAudioPCMBuffer,
        sampleRate: Double,
        targetFrequency: Double,
        rangeCents: Double
    ) -> (frequency: Double?, level: Double) {
        guard let channel = buffer.floatChannelData?[0] else { return (nil, 0) }
        let samples = Array(UnsafeBufferPointer(start: channel, count: Int(buffer.frameLength)))
        guard samples.count > 64 else { return (nil, 0) }
        let rms = sqrt(samples.reduce(0) { $0 + Double($1 * $1) } / Double(samples.count))
        let level = min(1, rms * 24)
        guard rms >= 0.003 else { return (nil, level) }
        return (detectPitch(samples: samples, sampleRate: sampleRate,
                            targetFrequency: targetFrequency, rangeCents: rangeCents), level)
    }

    nonisolated static func detectPitch(
        samples: [Float],
        sampleRate: Double,
        targetFrequency: Double,
        rangeCents: Double
    ) -> Double? {
        guard sampleRate > 0, targetFrequency > 0 else { return nil }
        var bestFrequency: Double?
        var bestScore = -Double.infinity

        for harmonic in 1...6 {
            let expected = targetFrequency * Double(harmonic)
            guard expected <= 2_600 else { continue }
            let harmonicRange = harmonic == 1 ? rangeCents : rangeCents + 120
            guard let result = detectNear(samples: samples, sampleRate: sampleRate,
                                          center: expected, rangeCents: harmonicRange) else { continue }
            let fundamental = result.frequency / Double(harmonic)
            let cents = 1200 * log2(fundamental / targetFrequency)
            guard abs(cents) <= rangeCents + 100 else { continue }
            let weights = [1.0, 0.94, 0.88, 0.82, 0.78, 0.74]
            let score = result.correlation * weights[harmonic - 1] - abs(cents) / 1000
            if score > bestScore { bestScore = score; bestFrequency = fundamental }
        }
        return bestFrequency
    }

    nonisolated private static func detectNear(
        samples: [Float], sampleRate: Double, center: Double, rangeCents: Double
    ) -> (frequency: Double, correlation: Double)? {
        let low = center * pow(2, -rangeCents / 1200)
        let high = center * pow(2, rangeCents / 1200)
        let minLag = max(2, Int(floor(sampleRate / high)))
        let maxLag = min(samples.count - 2, Int(ceil(sampleRate / low)))
        guard minLag < maxLag else { return nil }

        var bestLag = minLag
        var best = -1.0
        for lag in minLag...maxLag {
            let value = correlation(samples, lag: lag)
            if value > best { best = value; bestLag = lag }
        }
        guard best >= 0.18 else { return nil }

        let previous = correlation(samples, lag: max(minLag, bestLag - 1))
        let current = correlation(samples, lag: bestLag)
        let next = correlation(samples, lag: min(maxLag, bestLag + 1))
        let divisor = previous - 2 * current + next
        let shift = divisor == 0 ? 0 : 0.5 * (previous - next) / divisor
        let refinedLag = Double(bestLag) + max(-0.5, min(0.5, shift))
        let frequency = sampleRate / refinedLag
        guard frequency >= low, frequency <= high else { return nil }
        return (frequency, best)
    }

    nonisolated private static func correlation(_ samples: [Float], lag: Int) -> Double {
        var cross = 0.0, energyA = 0.0, energyB = 0.0
        for index in 0..<(samples.count - lag) {
            let a = Double(samples[index]), b = Double(samples[index + lag])
            cross += a * b; energyA += a * a; energyB += b * b
        }
        let denominator = sqrt(energyA * energyB)
        return denominator == 0 ? 0 : cross / denominator
    }
}
