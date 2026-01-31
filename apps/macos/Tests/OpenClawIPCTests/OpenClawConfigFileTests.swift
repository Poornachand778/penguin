import Foundation
import Testing
@testable import Penguin

@Suite(.serialized)
struct PenguinConfigFileTests {
    @Test
    func configPathRespectsEnvOverride() async {
        let override = FileManager().temporaryDirectory
            .appendingPathComponent("penguin-config-\(UUID().uuidString)")
            .appendingPathComponent("penguin.json")
            .path

        await TestIsolation.withEnvValues(["PENGUIN_CONFIG_PATH": override]) {
            #expect(PenguinConfigFile.url().path == override)
        }
    }

    @MainActor
    @Test
    func remoteGatewayPortParsesAndMatchesHost() async {
        let override = FileManager().temporaryDirectory
            .appendingPathComponent("penguin-config-\(UUID().uuidString)")
            .appendingPathComponent("penguin.json")
            .path

        await TestIsolation.withEnvValues(["PENGUIN_CONFIG_PATH": override]) {
            PenguinConfigFile.saveDict([
                "gateway": [
                    "remote": [
                        "url": "ws://gateway.ts.net:19999",
                    ],
                ],
            ])
            #expect(PenguinConfigFile.remoteGatewayPort() == 19999)
            #expect(PenguinConfigFile.remoteGatewayPort(matchingHost: "gateway.ts.net") == 19999)
            #expect(PenguinConfigFile.remoteGatewayPort(matchingHost: "gateway") == 19999)
            #expect(PenguinConfigFile.remoteGatewayPort(matchingHost: "other.ts.net") == nil)
        }
    }

    @MainActor
    @Test
    func setRemoteGatewayUrlPreservesScheme() async {
        let override = FileManager().temporaryDirectory
            .appendingPathComponent("penguin-config-\(UUID().uuidString)")
            .appendingPathComponent("penguin.json")
            .path

        await TestIsolation.withEnvValues(["PENGUIN_CONFIG_PATH": override]) {
            PenguinConfigFile.saveDict([
                "gateway": [
                    "remote": [
                        "url": "wss://old-host:111",
                    ],
                ],
            ])
            PenguinConfigFile.setRemoteGatewayUrl(host: "new-host", port: 2222)
            let root = PenguinConfigFile.loadDict()
            let url = ((root["gateway"] as? [String: Any])?["remote"] as? [String: Any])?["url"] as? String
            #expect(url == "wss://new-host:2222")
        }
    }

    @Test
    func stateDirOverrideSetsConfigPath() async {
        let dir = FileManager().temporaryDirectory
            .appendingPathComponent("penguin-state-\(UUID().uuidString)", isDirectory: true)
            .path

        await TestIsolation.withEnvValues([
            "PENGUIN_CONFIG_PATH": nil,
            "PENGUIN_STATE_DIR": dir,
        ]) {
            #expect(PenguinConfigFile.stateDirURL().path == dir)
            #expect(PenguinConfigFile.url().path == "\(dir)/penguin.json")
        }
    }
}
