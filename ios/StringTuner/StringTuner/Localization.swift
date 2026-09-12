import Foundation

enum L10n {
    private static var japanese: Bool {
        Locale.preferredLanguages.first?.hasPrefix("ja") == true
    }

    static func text(_ english: String, _ japanese: String) -> String {
        self.japanese ? japanese : english
    }

    static let appName = text("String Tuner", "弦楽チューナー")
    static let ready = text("Ready", "準備完了")
    static let listening = text("Listening...", "検出中…")
    static let holdingTone = text("Holding tone", "音程を確認中")
    static let pitchDetected = text("Pitch detected", "音程を検出")
    static let noInput = text("No input detected", "音が検出されません")
    static let microphoneOff = text("Microphone access is off", "マイクへのアクセスがオフです")
    static let microphoneUnavailable = text("Microphone permission is unavailable", "マイクを使用できません")
    static let requestingMicrophone = text("Requesting microphone access", "マイクの使用許可を確認中")
    static let microphoneFailed = text("Could not start microphone", "マイクを開始できませんでした")
    static let microphoneSetupFailed = text("Audio session setup failed", "オーディオを設定できませんでした")
    static let microphoneRequired = text("Microphone access is required", "マイクへのアクセスが必要です")
    static let microphoneHelp = text(
        "Open Settings and allow microphone access for String Tuner, then return and tap Listen.",
        "設定で「弦楽チューナー」のマイクを許可し、アプリに戻って「聴く」をタップしてください。"
    )
    static let listen = text("Listen", "聴く")
    static let stop = text("Stop", "停止")
    static let tone = text("Tone", "基準音")
    static let stopTone = text("Stop Tone", "基準音を停止")
    static let target = text("Target", "目標音")
    static let detected = text("Detected", "検出")
    static let inTune = text("IN TUNE", "合っています")
    static let tooLow = text("Too low — tune up", "低い — 音程を上げてください")
    static let tooHigh = text("Too high — tune down", "高い — 音程を下げてください")
    static let playSteady = text("Play a steady open string", "開放弦をまっすぐ伸ばして弾いてください")
    static let stable = text("Stable tone", "音程が安定しています")
    static let micInput = text("Mic Input", "マイク入力")
    static let setup = text("Tuning Setup", "調弦設定")
    static let instrument = text("Instrument", "楽器")
    static let openString = text("Open String", "開放弦")
    static let a4Reference = text("A4 Reference", "A4基準音")
    static let privacy = text(
        "Audio is analyzed only on this device. It is never recorded, stored, or uploaded.",
        "音声はこの端末内だけで解析され、録音・保存・送信されません。"
    )
    static let toneStopsMic = text(
        "Playing a reference tone stops microphone listening.",
        "基準音の再生中はマイク検出を停止します。"
    )
}
