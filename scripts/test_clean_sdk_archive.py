import hashlib
import json
import os
import subprocess
import sys
import tarfile
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).with_name("clean_sdk_archive.py")
REQUIRED = (
    "bin/rocketc", "bin/rocketc.bin", "bin/rocket-lsp",
    "bin/rocket-lsp.bin", "bin/clang", "bin/llvm-ar", "bin/lld",
    "lib/rocket_runtime.a", "lib/libraylib.a",
    "lib/librocket_raylib_adapter.a",
    "include/rocket/raylib/rocket_raylib_adapter.h",
    "share/rocket/target.txt", "stdlib/basic.rocket",
    "licenses/LLVM-LICENSE.txt",
)


class CleanSdkArchiveTest(unittest.TestCase):
    def test_keeps_sdk_and_rejects_wrong_original_hash(self):
        with tempfile.TemporaryDirectory() as temporary:
            base = Path(temporary)
            root = base / "rocket-3.0.0-linux-x64"
            for relative in REQUIRED + ("stage0/rocketc-stage0", "docs/old.md"):
                path = root / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                content = ("alias=linux-x64\n" if relative == "share/rocket/target.txt"
                           else "test payload\n")
                path.write_text(content, encoding="utf-8")
                if relative.startswith("bin/"):
                    os.chmod(path, 0o755)
            provenance = {
                "target": "linux-x64", "source_commit": "a" * 40,
                "source_commit_epoch": 1700000000,
                "compiler_sha256": "b" * 64,
            }
            (root / "RELEASE-PROVENANCE.json").write_text(json.dumps(provenance))
            checksums = "".join(
                f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.relative_to(root).as_posix()}\n"
                for path in sorted(root.rglob("*")) if path.is_file()
            )
            (root / "SHA256SUMS.txt").write_text(checksums)
            original = base / "rocket-3.0.0-linux-x64.tar.xz"
            with tarfile.open(original, "w:xz") as archive:
                archive.add(root, arcname=root.name)
            digest = hashlib.sha256(original.read_bytes()).hexdigest()
            manifest = base / "downloads.json"
            entry = {
                "target": "linux-x64", "filename": original.name,
                "source_commit": "a" * 40, "sha256": digest,
                "size": original.stat().st_size,
            }
            manifest.write_text(json.dumps([entry]))
            output = base / "output"
            command = [sys.executable, str(SCRIPT), "--input", str(original),
                       "--target", "linux-x64", "--manifest", str(manifest),
                       "--output-dir", str(output)]
            subprocess.run(command, check=True, capture_output=True, text=True)
            archive_path = output / "Rocket-SDK-3.0.0-linux-x64.tar.xz"
            self.assertTrue(archive_path.is_file())
            with tarfile.open(archive_path, "r:xz") as archive:
                names = {Path(member.name).relative_to("Rocket-SDK-3.0.0-linux-x64").as_posix()
                         for member in archive if member.isfile()}
            self.assertIn("bin/rocketc", names)
            self.assertIn("INSTALL.md", names)
            self.assertIn("RELEASE.json", names)
            self.assertNotIn("stage0/rocketc-stage0", names)
            self.assertNotIn("docs/old.md", names)
            entry["sha256"] = "0" * 64
            manifest.write_text(json.dumps([entry]))
            failed = subprocess.run(command[:-2] + ["--output-dir", str(base / "bad")],
                                    capture_output=True, text=True)
            self.assertNotEqual(failed.returncode, 0)
            self.assertIn("input archive hash", failed.stderr)


if __name__ == "__main__":
    unittest.main()
