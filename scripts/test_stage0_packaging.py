"""Regression: consumer SDKs must retain the runtime host used by IDE commands."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tarfile
import tempfile
import unittest
import zipfile


SCRIPTS = Path(__file__).parent


class StageZeroPackagingTest(unittest.TestCase):
    def package(self, base, target, omit=None):
        windows = target == "windows-x64"
        root = base / f"rocket-3.0.0-{target}"
        required = (
            ("bin/rocketc.exe", "bin/rocket-lsp.exe", "bin/clang.exe",
             "bin/lld-link.exe", "bin/llvm-lib.exe", "lib/rocket_runtime.lib",
             "lib/raylib.lib", "lib/rocket_raylib_adapter.lib",
             "stage0/rocketc-stage0.exe") if windows else
            ("bin/rocketc", "bin/rocketc.bin", "bin/rocket-lsp", "bin/rocket-lsp.bin",
             "bin/clang", "bin/llvm-ar", "bin/lld", "lib/rocket_runtime.a",
             "lib/libraylib.a", "lib/librocket_raylib_adapter.a",
             "stage0/rocketc-stage0", "stage0/rocketc-stage0.bin")
        ) + ("include/rocket/raylib/rocket_raylib_adapter.h", "share/rocket/target.txt",
             "stdlib/basic.rocket", "licenses/LLVM-LICENSE.txt", "docs/old.md")
        for relative in required:
            if relative == omit:
                continue
            path = root / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes((f"alias={target}\n" if relative == "share/rocket/target.txt"
                              else f"original bytes for {relative}\n").encode())
            if relative.startswith(("bin/", "stage0/")):
                os.chmod(path, 0o755)
        provenance = {"target": target, "source_commit": "a" * 40,
                      "source_commit_epoch": 1700000000, "compiler_sha256": "b" * 64}
        (root / "RELEASE-PROVENANCE.json").write_text(json.dumps(provenance))
        (root / "SHA256SUMS.txt").write_text("".join(
            f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(root).as_posix()}\n"
            for p in sorted(root.rglob("*")) if p.is_file()))
        original = base / (root.name + (".zip" if windows else ".tar.xz"))
        if windows:
            with zipfile.ZipFile(original, "w") as archive:
                for p in sorted(root.rglob("*")):
                    if p.is_file():
                        archive.write(p, root.name + "/" + p.relative_to(root).as_posix())
        else:
            with tarfile.open(original, "w:xz") as archive:
                archive.add(root, arcname=root.name)
        manifest = base / "manifest.json"
        manifest.write_text(json.dumps([{"filename": original.name, "target": target,
            "source_commit": "a" * 40, "size": original.stat().st_size,
            "sha256": hashlib.sha256(original.read_bytes()).hexdigest()}]))
        command = [sys.executable, str(SCRIPTS / ("clean_windows_sdk.py" if windows
                   else "clean_sdk_archive.py")), "--input", str(original),
                   "--manifest", str(manifest), "--output-dir", str(base / "output")]
        if not windows:
            command += ["--target", target]
        return subprocess.run(command, capture_output=True, text=True), root

    def test_runtime_host_survives_on_every_platform_with_checksums_and_modes(self):
        for target in ("windows-x64", "linux-x64", "linux-arm64", "macos-arm64"):
            with self.subTest(target=target), tempfile.TemporaryDirectory() as temp:
                base = Path(temp)
                result, original = self.package(base, target)
                self.assertEqual(result.returncode, 0, result.stderr)
                package = base / "output" / target / f"Rocket-SDK-3.0.0-{target}"
                hosts = (("stage0/rocketc-stage0.exe",) if target == "windows-x64"
                         else ("stage0/rocketc-stage0", "stage0/rocketc-stage0.bin"))
                checksums = (package / "SHA256SUMS.txt").read_text()
                for host in hosts:
                    self.assertTrue((package / host).is_file(), f"runtime host removed: {host}")
                    self.assertEqual((package / host).read_bytes(), (original / host).read_bytes())
                    self.assertIn(hashlib.sha256((original / host).read_bytes()).hexdigest()
                                  + "  " + host + "\n", checksums)
                self.assertFalse((package / "docs").exists())
                if target != "windows-x64" and os.name != "nt":
                    with tarfile.open(base / "output" / (package.name + ".tar.xz")) as archive:
                        for host in hosts:
                            self.assertEqual(archive.getmember(package.name + "/" + host).mode & 0o111,
                                             0o111)

    def test_incomplete_host_is_rejected_instead_of_publishing_a_broken_sdk(self):
        for target, host in (("windows-x64", "stage0/rocketc-stage0.exe"),
                             ("linux-x64", "stage0/rocketc-stage0"),
                             ("linux-x64", "stage0/rocketc-stage0.bin"),
                             ("linux-arm64", "stage0/rocketc-stage0.bin"),
                             ("macos-arm64", "stage0/rocketc-stage0.bin")):
            with self.subTest(target=target, host=host), tempfile.TemporaryDirectory() as temp:
                result, _ = self.package(Path(temp), target, omit=host)
                self.assertNotEqual(result.returncode, 0, "packaged without required runtime host")
                self.assertIn(host, result.stderr)


if __name__ == "__main__":
    unittest.main()
