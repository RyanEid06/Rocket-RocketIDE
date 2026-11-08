# Rocket & RocketIDE

The download portal for **Rocket 3.0.0**, a systems programming language and SDK, and **RocketIDE 1.0.0**, its Windows editor and debugger.

**[Open the download portal](https://ryaneid06.github.io/Rocket-RocketIDE/)** · [Latest GitHub release](https://github.com/RyanEid06/Rocket-RocketIDE/releases/latest)

## Official downloads

| Product | Platform | Download |
| --- | --- | --- |
| RocketIDE 1.0.0 | Windows x64 | [Installer](https://github.com/RyanEid06/Rocket-RocketIDE/releases/download/v3.0.0/RocketIDE-Setup-1.0.0.exe) · [Portable ZIP](https://github.com/RyanEid06/Rocket-RocketIDE/releases/download/v3.0.0/RocketIDE-win-x64-1.0.0.zip) |
| Rocket SDK 3.0.0 | Windows x64 | [ZIP](https://github.com/RyanEid06/Rocket-RocketIDE/releases/download/v3.0.0/Rocket-SDK-3.0.0-windows-x64.zip) |
| Rocket SDK 3.0.0 | Linux x64 | [TAR.XZ](https://github.com/RyanEid06/Rocket-RocketIDE/releases/download/v3.0.0/Rocket-SDK-3.0.0-linux-x64.tar.xz) |
| Rocket SDK 3.0.0 | Linux ARM64 | [TAR.XZ](https://github.com/RyanEid06/Rocket-RocketIDE/releases/download/v3.0.0/Rocket-SDK-3.0.0-linux-arm64.tar.xz) |
| Rocket SDK 3.0.0 | macOS Apple Silicon | [TAR.XZ](https://github.com/RyanEid06/Rocket-RocketIDE/releases/download/v3.0.0/Rocket-SDK-3.0.0-macos-arm64.tar.xz) |

Extract the entire SDK, keep `stage0/` alongside `bin/`, and follow the included `INSTALL.md` for system prerequisites. RocketIDE includes its .NET runtime and debugger. Install it or extract the complete portable ZIP and open `RocketIDE.exe`. In **Tools > Rocket SDK Settings**, select the extracted SDK's `bin/rocketc.exe` and `bin/rocket-lsp.exe`. The [getting-started guide](docs/GETTING_STARTED.md) walks through validation, a first program, and debugging.

The SDKs include third-party license notices. The [download manifest](public/downloads.json) records asset URLs, sizes, and SHA-256 checksums. [Release checksum file](https://github.com/RyanEid06/Rocket-RocketIDE/releases/download/v3.0.0/SHA256SUMS.txt)

## Website source

This static React, TypeScript, Vite, and Tailwind site runs on GitHub Pages. Its interactive examples simulate Rocket output in the browser. There is no hosted compiler or account service.

Use Node.js 24, then run `npm ci --legacy-peer-deps` and `npm run dev` for a local preview. `npm run build` outputs the static site to `dist/`.

[Rocket source](https://github.com/RyanEid06/Rocket) · [RocketIDE source](https://github.com/RyanEid06/RocketIDE)
