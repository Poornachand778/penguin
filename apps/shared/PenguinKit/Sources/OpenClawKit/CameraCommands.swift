import Foundation

public enum PenguinCameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum PenguinCameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum PenguinCameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum PenguinCameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct PenguinCameraSnapParams: Codable, Sendable, Equatable {
    public var facing: PenguinCameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: PenguinCameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: PenguinCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: PenguinCameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct PenguinCameraClipParams: Codable, Sendable, Equatable {
    public var facing: PenguinCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: PenguinCameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: PenguinCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: PenguinCameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}
