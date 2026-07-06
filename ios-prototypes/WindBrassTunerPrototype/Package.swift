// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "WindBrassTunerPrototype",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .executable(
            name: "WindBrassTunerPrototype",
            targets: ["WindBrassTunerPrototype"]
        )
    ],
    targets: [
        .executableTarget(
            name: "WindBrassTunerPrototype"
        ),
        .testTarget(
            name: "WindBrassTunerPrototypeTests",
            dependencies: ["WindBrassTunerPrototype"]
        )
    ]
)
