"""Native, isolated consumer contract checks; never uses a developer checkout."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import platform
import subprocess
import tempfile


def verify_inventory(sdk):
    expected = {}
    for line in (sdk / "SHA256SUMS.txt").read_text().splitlines():
        digest, relative = line.split("  ", 1)
        path = (sdk / relative).resolve()
        if not path.is_relative_to(sdk) or relative in expected:
            raise ValueError(f"unsafe or duplicate checksum path: {relative}")
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != digest:
            raise ValueError(f"package checksum mismatch: {relative}")
        expected[relative] = digest
    actual = {p.relative_to(sdk).as_posix() for p in sdk.rglob("*") if p.is_file()}
    if actual - {"SHA256SUMS.txt"} != expected.keys():
        raise ValueError("package contains files outside its checksum inventory")
    return len(actual)


def verify(sdk, target, report_path):
    sdk = sdk.resolve()
    windows = target == "windows-x64"
    machine = platform.machine().lower()
    host = {("Windows", "amd64"): "windows-x64", ("Linux", "x86_64"): "linux-x64",
            ("Linux", "aarch64"): "linux-arm64", ("Darwin", "arm64"): "macos-arm64"}
    if host.get((platform.system(), machine)) != target:
        raise ValueError("SDK smoke must execute on the matching native host")
    count = verify_inventory(sdk)
    suffix = ".exe" if windows else ""
    compiler = sdk / "bin" / ("rocketc" + suffix)
    stage0 = sdk / "stage0" / ("rocketc-stage0" + suffix)
    required = [compiler, stage0, sdk / "bin" / ("rocket-lsp" + suffix)]
    if not windows:
        required += [sdk / "stage0/rocketc-stage0.bin"]
    for path in required:
        if not path.is_file() or (not windows and not os.access(path, os.X_OK)):
            raise ValueError(f"missing or non-executable runtime tool: {path}")
    env = {k: v for k, v in os.environ.items() if not k.startswith("ROCKET_")}
    for key in ("INCLUDE", "LIB", "LIBPATH", "CPATH", "CPLUS_INCLUDE_PATH", "CMAKE_PREFIX_PATH",
                "LLVM_DIR", "LLVM_ROOT", "CLANG_PATH", "LD_LIBRARY_PATH", "DYLD_LIBRARY_PATH"):
        env.pop(key, None)
    system_root = env.get("SYSTEMROOT", env.get("SystemRoot", "C:/Windows"))
    env["PATH"] = (os.pathsep.join([str(Path(system_root) / "System32"), system_root])
                   if windows else "/usr/bin:/bin:/usr/sbin:/sbin")
    commands = []
    with tempfile.TemporaryDirectory(prefix="Rocket native smoke with spaces ") as temp:
        work = Path(temp)
        fixture = work / "fixture"
        (fixture / "src").mkdir(parents=True)
        (fixture / "tests").mkdir()
        (fixture / "rocket.toml").write_text('[package]\nname = "sdk_smoke"\nversion = "0.1.0"\nentry = "src/main.rocket"\n\n[test]\ndirectory = "tests"\n')
        source = 'fn main() -> Int:\n    let answer = 42\n    print("rocket-sdk-smoke-ok")\n    return 0\n'
        (fixture / "src/main.rocket").write_text(source)
        (fixture / "tests/basic.rocket").write_text('fn main() -> Int:\n    return 0\n')

        def run(executable, args=(), structured=None):
            result = subprocess.run([str(executable), *map(str, args)], cwd=sdk / "bin",
                                    env=env, capture_output=True, text=True, timeout=120)
            print(result.stdout, end="", flush=True)
            if result.stderr:
                print(result.stderr, end="", flush=True)
            commands.append({"tool": executable.name, "args": list(map(str, args)),
                             "exit": result.returncode})
            if result.returncode:
                raise RuntimeError(f"{executable.name} {args}: exit {result.returncode}")
            messages = []
            for line in result.stdout.splitlines():
                if line.startswith("{"):
                    messages.append(json.loads(line))
            if structured:
                matches = [m for m in messages if m.get("schema") == "rocket-message-1"
                           and m.get("reason") == structured and m.get("success") is True]
                if not matches:
                    raise RuntimeError(f"missing successful structured {structured}: {result.stdout}")
                return matches[-1]
            return result.stdout

        for tool in required[:3]:
            version = run(tool, ["--version"]).strip()
            if tool != required[2] and version != "rocketc 3.0.0":
                raise ValueError(f"wrong compiler version: {version}")
            if tool == required[2] and not version.startswith("rocket-lsp "):
                raise ValueError(f"wrong language server version: {version}")
        run(compiler, ["target", "--verbose"])
        run(compiler, ["check", fixture])
        for command in ("check", "build"):
            run(compiler, [command, fixture, "--message-format=json"], "build-finished")
        if "rocket-sdk-smoke-ok" not in run(compiler, ["run", fixture]):
            raise RuntimeError("compiled program did not produce expected output")
        test_output = run(compiler, ["test", fixture, "--message-format=json"])
        summaries = [json.loads(line) for line in test_output.splitlines() if line.startswith("{")]
        if not any(m.get("reason") == "test-summary" and m.get("failed") == 0
                   and m.get("passed") == 1 for m in summaries):
            raise RuntimeError("structured test did not report 1 passed / 0 failed")
        for command in ("resolve", "tree", "audit"):
            run(compiler, [command, fixture])
        debug = run(compiler, ["build", fixture, "--debug", "--message-format=json"], "build-finished")
        executable = Path(debug["artifact"])
        source_map = Path(debug["sourceMap"])
        if debug.get("optimized") is not False or not executable.is_file():
            raise RuntimeError("debug build did not report an unoptimized executable")
        if json.loads(source_map.read_text()).get("format") != "rocket-source-map-1":
            raise RuntimeError("missing Rocket debug source map")
        if windows and not executable.with_suffix(".pdb").is_file():
            raise RuntimeError("Windows debug build omitted PDB")
        if "rocket-sdk-smoke-ok" not in run(executable):
            raise RuntimeError("debug executable did not run")
    report_path.write_text(json.dumps({"target": target, "package_files": count,
                                      "passed": True, "commands": commands}, indent=2) + "\n")
    print(f"NATIVE SDK CONTRACT PASS: {target}, {count} files", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--sdk", type=Path, required=True)
    parser.add_argument("--target", required=True)
    parser.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()
    verify(args.sdk, args.target, args.report)
