import Foundation

public enum PenguinChatTransportEvent: Sendable {
    case health(ok: Bool)
    case tick
    case chat(PenguinChatEventPayload)
    case agent(PenguinAgentEventPayload)
    case seqGap
}

public protocol PenguinChatTransport: Sendable {
    func requestHistory(sessionKey: String) async throws -> PenguinChatHistoryPayload
    func sendMessage(
        sessionKey: String,
        message: String,
        thinking: String,
        idempotencyKey: String,
        attachments: [PenguinChatAttachmentPayload]) async throws -> PenguinChatSendResponse

    func abortRun(sessionKey: String, runId: String) async throws
    func listSessions(limit: Int?) async throws -> PenguinChatSessionsListResponse

    func requestHealth(timeoutMs: Int) async throws -> Bool
    func events() -> AsyncStream<PenguinChatTransportEvent>

    func setActiveSessionKey(_ sessionKey: String) async throws
}

extension PenguinChatTransport {
    public func setActiveSessionKey(_: String) async throws {}

    public func abortRun(sessionKey _: String, runId _: String) async throws {
        throw NSError(
            domain: "PenguinChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "chat.abort not supported by this transport"])
    }

    public func listSessions(limit _: Int?) async throws -> PenguinChatSessionsListResponse {
        throw NSError(
            domain: "PenguinChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "sessions.list not supported by this transport"])
    }
}
