# Rocket & RocketIDE — Official Website

The official web portal and release distribution platform for the **Rocket** systems programming language and its companion desktop studio, **RocketIDE**.

Built with React 19, TypeScript, Vite, and Tailwind CSS. Configured for zero-config automatic deployment to GitHub Pages.

---

## 🚀 Overview

- **Interactive Browser Studio**: An in-browser interactive simulator of RocketIDE with real code files (`fibonacci.rocket`, `test.rocket`, `language_tour.rocket`, `concurrency.rocket`), live compiling feedback, output panes, and AST diagnostics.
- **Bare-Metal Benchmark**: Side-by-side performance race demonstrating Rocket's LLVM `-O2` register optimization against standard Python bytecode execution on a 1,000,000-iteration loop.
- **Multi-Platform Distribution Matrix**: Direct download packages, SHA-256 checksums, and terminal installation commands for:
  - **Windows**: Windows Installer (`.exe`), Standalone Portable (`.zip`), and SDK toolchain.
  - **Linux**: AppImage (`.AppImage`), Standalone Tarball (`.tar.gz`), and compiler CLI.
  - **macOS**: Universal Disk Image (`.dmg`), Installer Package (`.pkg`), and Homebrew formulas.
- **Clean Aesthetic**: Obsidian dark theme, responsive navigation, zero AI-slop design, and complete legal licensing information.

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `bun`

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/USERNAME/REPO.git
cd REPO
npm install
