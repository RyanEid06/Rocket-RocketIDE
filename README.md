# Rocket & RocketIDE website

The published website is [ryaneid06.github.io/Rocket-RocketIDE](https://ryaneid06.github.io/Rocket-RocketIDE/). This repository has one branch, **main**, and serves the completed site through GitHub Pages.

## Downloads

The [published release](https://github.com/RyanEid06/Rocket-RocketIDE/releases/tag/v3.0.0) provides:

- RocketIDE 1.0.0: Windows x64 installer, including the .NET runtime and native debugger. The standard wizard offers an install folder, Start menu and optional desktop shortcuts, launch on Finish, and normal uninstall support. The separately labeled Portable ZIP remains available.
- Rocket 3.0.0 SDK: Windows x64, Linux x64, Linux ARM64 and macOS Apple Silicon ARM64. There is no Intel macOS SDK or Linux/macOS RocketIDE package in this release.

Packages are hosted as GitHub Release assets, not inside the website source. The Windows compiler is named rocketc.exe; other platforms use rocketc. Package filenames, sizes, SHA-256 hashes and URLs are recorded in [public/downloads.json](public/downloads.json); page display data is in [src/data/rocketData.ts](src/data/rocketData.ts). RocketIDE does not bundle the Rocket SDK; configure it separately through Tools > Rocket SDK Settings.

All four published SDK entries record Rocket master commit `1f6ba76f16f3246095d5d573c28d825d8b9367e3`. Their release asset sizes and SHA-256 digests were checked against the GitHub release metadata on 2026-09-28. The website offers the verified full release archives and links to the [cross-platform consumer SDK branch](https://github.com/RyanEid06/Rocket/tree/consumer), which requires Git LFS when cloning. See the [named Rocket SDK roadmap](ROADMAP.md) for the game-platform features and remaining readiness gate.

The separate [RocketIDE repository](https://github.com/RyanEid06/RocketIDE) uses main for development and consumer for its minimal distribution. Frozen executable downloads and checksums are unchanged by repository cleanup.

## Publishing and local preview

Use Node.js 24 and npm:

```sh
npm ci --legacy-peer-deps
npm run lint
npm run build
npm run preview
```

The only retained workflow, [.github/workflows/deploy.yml](.github/workflows/deploy.yml), builds the site and publishes dist to Pages when main changes or an owner runs it manually. This workflow is required to reproduce and publish the site; it does not schedule UI updates or recurring tests. npm run lint checks TypeScript. npm run dev provides an optional local preview during maintenance.

This is a static browser application. It needs no API keys, Gemini service, Express server or environment file. Its interactive studio uses simulated example output, not a hosted Rocket compiler.

## Maintenance record

Completed release-upload and one-time download-verification workflows, unused AI Studio metadata, unused images and unused server/AI dependencies were removed from the current tree. Their original versions and successful runs remain in Git history and GitHub Actions. The published files were previously verified by [public download verification](https://github.com/RyanEid06/Rocket-RocketIDE/actions/runs/36341667905). Keep the retained source, build configuration, lockfile, active assets and download manifest: they are needed to reproduce the published site.
