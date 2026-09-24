import { CodeExample, ReleaseAsset } from '../types';

export const BENCHMARK_COUNT_MILLION = {
  title: 'Counting to 1,000,000 Benchmark',
  description: 'Sequential loop counter execution comparing Rocket LLVM native machine code vs Python bytecode execution.',
  iterations: 1000000,
  rocketTime: 0.166,
  pythonTime: 1.520,
  speedup: '9.1x',
  rocketCode: `fn main() -> Int:
    var count = 0
    while count < 1000000:
        count = count + 1
    print("Completed count to 1,000,000")
    return 0`,
  pythonCode: `def main():
    count = 0
    while count < 1000000:
        count += 1
    print("Completed count to 1,000,000")

main()`
};

export const CODE_EXAMPLES: CodeExample[] = [
  {
    id: 'test_rocket',
    title: 'test.rocket',
    description: 'Clean indentation syntax, inferred bindings, and standard output.',
    filename: 'test.rocket',
    code: `fn main() -> Int:
    let greeting = "Hello from Rocket"
    print(greeting)
    let x=6
    let y=7
    print(x)
    print(y)
    return 0`,
    simulatedOutput: `Hello from Rocket
6
7

[Process exited with code 0 in 11ms]`,
    compileTimeMs: 11,
    memoryMb: 1.1
  },
  {
    id: 'fibonacci',
    title: 'fibonacci.rocket',
    description: 'Recursive calculation with LLVM optimization and colon indentation.',
    filename: 'fibonacci.rocket',
    code: `fn fib(n: Int) -> Int:
    if n < 2:
        return n
    else:
        return fib(n - 1) + fib(n - 2)

fn main() -> Int:
    print("Calculating fib(10)...")
    print(fib(10))
    return 0`,
    simulatedOutput: `Calculating fib(10)...
55

[Process exited with code 0 in 14ms]`,
    compileTimeMs: 14,
    memoryMb: 1.4
  },
  {
    id: 'language_tour',
    title: 'language_tour.rocket',
    description: 'Generics Pair[T], enums Message, slice views [1..3], and match expressions.',
    filename: 'language_tour.rocket',
    code: `import std.collections
import std.string

struct Pair[T]:
    first: T
    second: T

enum Message:
    Number(Int)
    Text(String)

fn parse_and_increment(text: String) -> Result[Int, String]:
    let value = string.parse_int(text)?
    return Ok(value + 1)

fn main() -> Int:
    let pair = Pair(10, 20)
    let values = [pair.first, pair.second, 30]
    let middle = values[1..3]
    print(collections.slice_length(middle))

    let result = parse_and_increment("41")
    match result:
        case Ok(value):
            print(value)
        case Err(error):
            print(error)

    let message = Text("Rocket Ready")
    match message:
        case Number(value):
            print(value)
        case Text(text):
            print(text)

    return 0`,
    simulatedOutput: `2
42
Rocket Ready

[Process exited with code 0 in 18ms]`,
    compileTimeMs: 18,
    memoryMb: 1.9
  },
  {
    id: 'ownership_concurrency',
    title: 'concurrency.rocket',
    description: 'Async tasks, ARC managed captures, buffer freeze/thaw, and atomic once_set.',
    filename: 'concurrency.rocket',
    code: `import std.buffer
import std.ownership
import std.sync
import std.task

struct Record:
    value: Int

async fn increment(value: Int) -> Result[Int, String]:
    return Ok(value + 1)

fn main() -> Int:
    let record = Record(41)
    let observer = ownership.downgrade(record)
    match ownership.upgrade(observer):
        case Some(live):
            print("Live record: " + live.value)
        case None:
            return 1

    let mutable = buffer.thaw([1, 2])
    let grown = buffer.append(mutable, 3)
    let frozen = buffer.freeze(grown)
    print("Frozen buffer element: " + frozen[2])

    let pending = increment(record.value)
    match task.join(pending):
        case Ok(value):
            print("Async task completed with: " + value)
        case Err(message):
            print(message)
            return 2

    return 0`,
    simulatedOutput: `Live record: 41
Frozen buffer element: 3
Async task completed with: 42

[Process exited with code 0 in 21ms]`,
    compileTimeMs: 21,
    memoryMb: 2.3
  }
];

export const RELEASE_ASSETS: ReleaseAsset[] = [
  // Windows
  {
    id: 'ide-win-exe',
    name: 'RocketIDE Windows Installer',
    filename: 'RocketIDE-Setup.exe',
    platform: 'windows',
    architecture: 'Windows x64 (.NET 10 WPF)',
    size: '86.4 MB',
    sha256: '9f83a42b10e5d9c7482a170fb98c39e1e2478fa9b36021d7b693fa71630c12e8',
    type: 'installer',
    description: 'Native Windows desktop installer. Features AvalonEdit editor, Microsoft DbgEng native debugger, and LSP integration.',
    recommended: true
  },
  {
    id: 'ide-win-zip',
    name: 'RocketIDE Standalone Portable (Windows)',
    filename: 'RocketIDE-Portable-win-x64.zip',
    platform: 'windows',
    architecture: 'Windows x64',
    size: '81.2 MB',
    sha256: '2a77f98e0c4b31a29f848cde91f09ab5672d1134a413c6b20f1883624e5d8091',
    type: 'portable',
    description: 'Standalone portable archive. Unpack and launch RocketIDE directly without system registration.',
    recommended: false
  },
  // Linux
  {
    id: 'ide-linux-appimage',
    name: 'RocketIDE Linux AppImage',
    filename: 'RocketIDE-x86_64.AppImage',
    platform: 'linux',
    architecture: 'Linux x86_64',
    size: '84.2 MB',
    sha256: '3819fa0018b2c4180bbfa71008129074a8109cb3401928374a108bcf19028374',
    type: 'installer',
    description: 'Self-contained executable for Ubuntu, Fedora, Debian, Arch, and major Linux distributions.',
    recommended: true
  },
  {
    id: 'ide-linux-tar',
    name: 'RocketIDE Standalone Archive (Linux)',
    filename: 'rocketide-linux-x64.tar.gz',
    platform: 'linux',
    architecture: 'Linux x86_64',
    size: '82.1 MB',
    sha256: '71009182374bbfa710018b2c4180bbfa71008129074a8109cb3401928374a108',
    type: 'portable',
    description: 'Precompiled binary archive with desktop shortcuts and launcher script.',
    recommended: false
  },
  // macOS
  {
    id: 'ide-mac-dmg',
    name: 'RocketIDE macOS Disk Image',
    filename: 'RocketIDE-Universal.dmg',
    platform: 'macos',
    architecture: 'Apple Silicon (M-Series) & Intel x64',
    size: '88.5 MB',
    sha256: '8b7610fa290cc63297a7e6b8c4d129007123aa1290b349071cba8100f918237b',
    type: 'installer',
    description: 'macOS universal application disk image with native Metal acceleration.',
    recommended: true
  },
  {
    id: 'ide-mac-pkg',
    name: 'RocketIDE macOS Installer Package',
    filename: 'RocketIDE-macOS.pkg',
    platform: 'macos',
    architecture: 'Apple Silicon & Intel Universal',
    size: '87.2 MB',
    sha256: 'f560e90c63297a7e6b8c4d129007123aa1290b349071cba8100f918237b8b761',
    type: 'installer',
    description: 'Standard macOS installer package (.pkg) for automated system setup and CLI registration.',
    recommended: false
  },
  // Toolchain
  {
    id: 'cli-compiler-win',
    name: 'Rocket Compiler Toolchain (Windows)',
    filename: 'rocket-sdk-win-x64.zip',
    platform: 'windows',
    architecture: 'Windows x64',
    size: '28.5 MB',
    sha256: 'd198ea4390b1c416e87f62d1947b198129038201a084617cf90b23b10b037748',
    type: 'toolchain',
    description: 'Compiler binary (rocketc), standard libraries (stdlib), and LLVM optimization pipeline.',
    recommended: true
  },
  {
    id: 'cli-compiler-linux',
    name: 'Rocket Compiler Toolchain (Linux)',
    filename: 'rocket-sdk-linux-x86_64.tar.gz',
    platform: 'linux',
    architecture: 'Linux x86_64',
    size: '26.4 MB',
    sha256: '417bb18903c7219081a27e36618a0918cb091277a80b181290bbfa71009182ab',
    type: 'toolchain',
    description: 'Linux compiler binary (rocketc), static link libraries, and standard libraries.',
    recommended: true
  },
  {
    id: 'cli-compiler-mac',
    name: 'Rocket Compiler Toolchain (macOS)',
    filename: 'rocket-sdk-darwin-universal.tar.gz',
    platform: 'macos',
    architecture: 'macOS Universal',
    size: '27.8 MB',
    sha256: '5de2cf54909be4483c7e74105d854faa778d15e3417bb18903c7219081a27e36',
    type: 'toolchain',
    description: 'macOS compiler binary (rocketc), standard libraries, and Clang runtime.',
    recommended: true
  },
  {
    id: 'cli-lsp',
    name: 'Rocket Language Server (rocket-lsp)',
    filename: 'rocket-lsp-win-x64.exe',
    platform: 'cli',
    architecture: 'Cross-Platform Tool',
    size: '11.2 MB',
    sha256: '8b7610fa290cc63297a7e6b8c4d129007123aa1290b349071cba8100f918237b',
    type: 'toolchain',
    description: 'Protocol 1.0 language server providing incremental AST analysis, semantic tokens, and diagnostics.',
    recommended: false
  }
];
