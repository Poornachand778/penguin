import PenguinKit
import PenguinProtocol
import Foundation

// Prefer the PenguinKit wrapper to keep gateway request payloads consistent.
typealias AnyCodable = PenguinKit.AnyCodable
typealias InstanceIdentity = PenguinKit.InstanceIdentity

extension AnyCodable {
    var stringValue: String? { self.value as? String }
    var boolValue: Bool? { self.value as? Bool }
    var intValue: Int? { self.value as? Int }
    var doubleValue: Double? { self.value as? Double }
    var dictionaryValue: [String: AnyCodable]? { self.value as? [String: AnyCodable] }
    var arrayValue: [AnyCodable]? { self.value as? [AnyCodable] }

    var foundationValue: Any {
        switch self.value {
        case let dict as [String: AnyCodable]:
            dict.mapValues { $0.foundationValue }
        case let array as [AnyCodable]:
            array.map(\.foundationValue)
        default:
            self.value
        }
    }
}

extension PenguinProtocol.AnyCodable {
    var stringValue: String? { self.value as? String }
    var boolValue: Bool? { self.value as? Bool }
    var intValue: Int? { self.value as? Int }
    var doubleValue: Double? { self.value as? Double }
    var dictionaryValue: [String: PenguinProtocol.AnyCodable]? { self.value as? [String: PenguinProtocol.AnyCodable] }
    var arrayValue: [PenguinProtocol.AnyCodable]? { self.value as? [PenguinProtocol.AnyCodable] }

    var foundationValue: Any {
        switch self.value {
        case let dict as [String: PenguinProtocol.AnyCodable]:
            dict.mapValues { $0.foundationValue }
        case let array as [PenguinProtocol.AnyCodable]:
            array.map(\.foundationValue)
        default:
            self.value
        }
    }
}
