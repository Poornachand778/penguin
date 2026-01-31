// swift-tools-version: 6.2
// Package manifest for the Penguin macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "Penguin",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "PenguinIPC", targets: ["PenguinIPC"]),
        .library(name: "PenguinDiscovery", targets: ["PenguinDiscovery"]),
        .executable(name: "Penguin", targets: ["Penguin"]),
        .executable(name: "penguin-mac", targets: ["PenguinMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.2.2"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.1.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.8.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.8.1"),
        .package(url: "https://github.com/steipete/Peekaboo.git", branch: "main"),
        .package(path: "../shared/PenguinKit"),
        .package(path: "../../Swabble"),
    ],
    targets: [
        .target(
            name: "PenguinIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "PenguinDiscovery",
            dependencies: [
                .product(name: "PenguinKit", package: "PenguinKit"),
            ],
            path: "Sources/PenguinDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "Penguin",
            dependencies: [
                "PenguinIPC",
                "PenguinDiscovery",
                .product(name: "PenguinKit", package: "PenguinKit"),
                .product(name: "PenguinChatUI", package: "PenguinKit"),
                .product(name: "PenguinProtocol", package: "PenguinKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/Penguin.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "PenguinMacCLI",
            dependencies: [
                "PenguinDiscovery",
                .product(name: "PenguinKit", package: "PenguinKit"),
                .product(name: "PenguinProtocol", package: "PenguinKit"),
            ],
            path: "Sources/PenguinMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "PenguinIPCTests",
            dependencies: [
                "PenguinIPC",
                "Penguin",
                "PenguinDiscovery",
                .product(name: "PenguinProtocol", package: "PenguinKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
