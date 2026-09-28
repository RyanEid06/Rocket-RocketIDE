#!/usr/bin/env python3
"""Build the Windows consumer SDK from the verified Rocket 3.0.0 ZIP."""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import shutil
import stat
import zipfile
from pathlib import Path, PurePosixPath


VERSION = "3.0.0"
TARGET = "windows-x64"
OLD_ROOT = f"rocket-{VERSION}-{TARGET}"
NEW_ROOT = f"Rocket-SDK-{VERSION}-{TARGET}"
KEEP_DIRS = {"bin", "lib", "include", "stdlib", "share", "licenses"}
BIN_FILES = {"clang.exe", "lld-link.exe", "llvm-lib.exe", "rocketc.exe", "rocket-lsp.exe"}
REQUIRED = (
    "bin/rocketc.exe", "bin/rocket-lsp.exe", "bin/clang.exe",
    "bin/lld-link.exe", "bin/llvm-lib.exe", "lib/rocket_runtime.lib",
    "lib/raylib.lib", "lib/rocket_raylib_adapter.lib",
    "include/rocket/raylib/rocket_raylib_adapter.h",
    "share/rocket/target.txt",
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    args = parser.parse_args()
    originals = [entry for entry in json.loads(args.manifest.read_text(encoding="utf-8"))
                 if entry["target"] == TARGET and entry["filename"].startswith("rocket-")]
    if len(originals) != 1:
        raise ValueError("expected one original Windows SDK in the published manifest")
    original = originals[0]
    old_hash = sha256(args.input)
    if (args.input.name != original["filename"] or old_hash != original["sha256"]
            or args.input.stat().st_size != original["size"]):
        raise ValueError("original Windows SDK ZIP differs from the published manifest")

    target_dir = args.output_dir / TARGET
    package = target_dir / NEW_ROOT
    if target_dir.exists():
        raise ValueError(f"refusing to replace existing output: {target_dir}")
    package.mkdir(parents=True)
    removed: dict[str, int] = {}
    source_count = retained = 0
    with zipfile.ZipFile(args.input) as source:
        provenance = json.loads(source.read(f"{OLD_ROOT}/RELEASE-PROVENANCE.json"))
        if provenance["target"] != TARGET or provenance["source_commit"] != original["source_commit"]:
            raise ValueError("source provenance differs from the published manifest")
        source_checksums = {}
        for line in source.read(f"{OLD_ROOT}/SHA256SUMS.txt").decode("ascii").splitlines():
            digest, relative = line.split("  ", 1)
            if relative in source_checksums:
                raise ValueError(f"duplicate source checksum: {relative}")
            source_checksums[relative] = digest
        seen = set()
        for entry in source.infolist():
            if entry.is_dir():
                continue
            pure = PurePosixPath(entry.filename)
            if pure.is_absolute() or ".." in pure.parts or len(pure.parts) < 2 or pure.parts[0] != OLD_ROOT:
                raise ValueError(f"unsafe source ZIP member: {entry.filename}")
            relative = PurePosixPath(*pure.parts[1:]).as_posix()
            if relative in seen:
                raise ValueError(f"duplicate source ZIP member: {relative}")
            seen.add(relative)
            source_count += 1
            category = relative.split("/", 1)[0]
            if category not in KEEP_DIRS or (category == "bin" and pure.name not in BIN_FILES):
                removed[category] = removed.get(category, 0) + 1
                continue
            destination = package.joinpath(*PurePosixPath(relative).parts)
            destination.parent.mkdir(parents=True, exist_ok=True)
            with source.open(entry) as stream, destination.open("wb") as output:
                shutil.copyfileobj(stream, output)
            if sha256(destination) != source_checksums.get(relative):
                raise ValueError(f"source checksum mismatch: {relative}")
            retained += 1

    missing = [name for name in REQUIRED if not (package / name).is_file()]
    if missing or not any((package / "stdlib").rglob("*.rocket")):
        raise ValueError(f"missing required SDK inputs: {missing}")
    if not any((package / "licenses").iterdir()):
        raise ValueError("dependency licenses are missing")
    if "alias=windows-x64\n" not in (package / "share/rocket/target.txt").read_text(encoding="ascii"):
        raise ValueError("target metadata differs from package target")

    (package / "INSTALL.md").write_text(f"""# Rocket SDK {VERSION} for Windows x64

Extract this entire ZIP into a directory you can read and execute. Keep the
`bin`, `lib`, `include`, `stdlib`, `share`, and `licenses` directories together.
The SDK includes its compiler, language server, LLVM tools and runtime; it is
separate from the RocketIDE Windows application.

From PowerShell in the extracted directory:

```powershell
.\\bin\\rocketc.exe --version
.\\bin\\rocketc.exe target --verbose
.\\bin\\rocketc.exe check C:\\path\\to\\hello.rocket
.\\bin\\rocketc.exe run C:\\path\\to\\hello.rocket
```

In RocketIDE, select `bin\\rocketc.exe` and `bin\\rocket-lsp.exe` under
Tools > Rocket SDK Settings. `SHA256SUMS.txt` verifies the included files.
`RELEASE.json` records the source and original release archive identities.
""", encoding="utf-8", newline="\n")
    release = {
        "product": "Rocket SDK", "version": VERSION, "target": TARGET,
        "source_commit": provenance["source_commit"],
        "compiler_sha256": provenance["compiler_sha256"],
        "original_archive": original["filename"],
        "original_archive_sha256": old_hash,
        "removed_categories": removed,
    }
    (package / "RELEASE.json").write_text(json.dumps(release, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    files = sorted(path for path in package.rglob("*") if path.is_file())
    (package / "SHA256SUMS.txt").write_text("".join(
        f"{sha256(path)}  {path.relative_to(package).as_posix()}\n" for path in files
    ), encoding="ascii", newline="\n")

    output_path = args.output_dir / f"{NEW_ROOT}.zip"
    epoch = max(315532800, int(provenance["source_commit_epoch"]))
    timestamp = dt.datetime.fromtimestamp(epoch, tz=dt.timezone.utc).timetuple()[:6]
    with zipfile.ZipFile(output_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for path in sorted(p for p in package.rglob("*") if p.is_file()):
            name = f"{NEW_ROOT}/{path.relative_to(package).as_posix()}"
            info = zipfile.ZipInfo(name, timestamp)
            info.create_system = 3
            info.external_attr = (stat.S_IFREG | 0o644) << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            with path.open("rb") as stream, archive.open(info, "w", force_zip64=True) as output:
                shutil.copyfileobj(stream, output)
    report = {
        "target": TARGET, "source_commit": provenance["source_commit"],
        "original_archive_sha256": old_hash, "archive": output_path.name,
        "archive_size": output_path.stat().st_size, "archive_sha256": sha256(output_path),
        "source_files": source_count, "retained_source_files": retained,
        "removed_categories": removed, "package_files": len(files) + 1,
    }
    (args.output_dir / "report-windows-x64.json").write_text(json.dumps(report, indent=2, sort_keys=True) + "\n")
    print(json.dumps(report, sort_keys=True))


if __name__ == "__main__":
    main()
