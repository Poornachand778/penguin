// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "PenguinKit",
    platforms: [
        .iOS(.v18),
        .macOS(.v15),
    ],
    products: [
        .library(name: "PenguinProtocol", targets: ["PenguinProtocol"]),
        .library(name: "PenguinKit", targets: ["PenguinKit"]),
        .library(name: "PenguinChatUI", targets: ["PenguinChatUI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/steipete/ElevenLabsKit", exact: "0.1.0"),
        .package(url: "https://github.com/gonzalezreal/textual", exact: "0.3.1"),
    ],
    targets: [
        .target(
            name: "PenguinProtocol",
            path: "Sources/PenguinProtocol",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "PenguinKit",
            dependencies: [
                "PenguinProtocol",
                .product(name: "ElevenLabsKit", package: "ElevenLabsKit"),
            ],
            path: "Sources/PenguinKit",
            resources: [
                .process("Resources"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "PenguinChatUI",
            dependencies: [
                "PenguinKit",
                .product(
                    name: "Textual",
                    package: "textual",
                    condition: .when(platforms: [.macOS, .iOS])),
            ],
            path: "Sources/PenguinChatUI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "PenguinKitTests",
            dependencies: ["PenguinKit", "PenguinChatUI"],
            path: "Tests/PenguinKitTests",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
