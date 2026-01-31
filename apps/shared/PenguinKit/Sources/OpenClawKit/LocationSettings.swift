import Foundation

public enum PenguinLocationMode: String, Codable, Sendable, CaseIterable {
    case off
    case whileUsing
    case always
}
