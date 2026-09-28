#!/usr/bin/env python3
"""Make a consumer SDK from a verified Rocket 3.0.0 native release archive."""

from __future__ import annotations

import argparse
import hashlib
import json
import lzma
import os
import shutil
import tarfile
from pathlib import Path, PurePosixPath


VERSION = "3.0.0"
TARGETS = ("linux-x64", "linux-arm64", "macos-arm64")
KEEP_DIRS = {"bin", "lib", "include", "stdlib", "share", "licenses"}
REQUIRED = (
    "bin/rocketc", "bin/rocketc.bin", "bin/rocket-lsp",
    "bin/rocket-lsp.bin", "bin/clang", "bin/llvm-ar", "bin/lld",
    "lib/rocket_runtime.a", "lib/libraylib.a",
    "lib/librocket_raylib_adapter.a",
    "include/rocket/raylib/rocket_raylib_adapter.h",
    "share/rocket/target.txt",
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def original_entry(manifest: Path, target: str) -> dict:
    matches = [entry for entry in json.loads(manifest.read_text(encoding="utf-8"))
               if entry["target"] == target]
    if len(matches) != 1:
        raise ValueError(f"expected exactly one manifest entry for {target}")
    return matches[0]


def read_member(archive: tarfile.TarFile, name: str) -> bytes:
    member = archive.getmember(name)
    stream = archive.extractfile(member)
    if not member.isfile() or stream is None:
        raise ValueError(f"missing regular archive member: {name}")
    return stream.read()


def install_text(target: str) -> str:
    prerequisite = (
        "Install the Xcode Command Line Tools and use an active macOS SDK.\n"
        "Run `xcode-select --install` if the tools are missing. Rocket does not\n"
        "redistribute the Apple SDK.\n"
        if target == "macos-arm64" else
        "Install the host glibc development ABI and libcurl development package.\n"
        "On Ubuntu/Debian, run `sudo apt-get install libc6-dev libcurl4-openssl-dev`.\n"
        "The Clang/LLD toolchain and Rocket runtime are included.\n"
    )
    return f"""# Rocket SDK {VERSION} for {target}

Extract this entire archive to a directory you can read and execute. Keep its
`bin`, `lib`, `include`, `stdlib`, `share`, and `licenses` directories together.
This is the Rocket language SDK; RocketIDE is a separate Windows application.

{prerequisite}
From the extracted directory:

```sh
./bin/rocketc --version
./bin/rocketc target --verbose
./bin/rocketc check /path/to/hello.rocket
./bin/rocketc run /path/to/hello.rocket
```

Use `bin/rocket-lsp` for an editor's language-server command. The launchers
locate the included libraries and tools relative to this extracted directory.
`SHA256SUMS.txt` verifies every included file except itself. `RELEASE.json`
records the source commit, original release archive, and compiler identity.
The `licenses` directory contains redistributed dependency licenses.
"""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--target", required=True, choices=TARGETS)
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    args = parser.parse_args()

    original = original_entry(args.manifest, args.target)
    if args.input.name != original["filename"]:
        raise ValueError("input filename differs from the published manifest")
    input_hash = sha256(args.input)
    if input_hash != original["sha256"] or args.input.stat().st_size != original["size"]:
        raise ValueError("input archive hash or size differs from the published manifest")

    old_root = f"rocket-{VERSION}-{args.target}"
    new_root = f"Rocket-SDK-{VERSION}-{args.target}"
    target_dir = args.output_dir / args.target
    package = target_dir / new_root
    if target_dir.exists():
        raise ValueError(f"refusing to replace existing output: {target_dir}")
    package.mkdir(parents=True)
    source_count = kept_count = 0
    removed_categories: dict[str, int] = {}

    with tarfile.open(args.input, "r:xz") as archive:
        provenance = json.loads(read_member(archive, f"{old_root}/RELEASE-PROVENANCE.json"))
        if provenance["target"] != args.target or provenance["source_commit"] != original["source_commit"]:
            raise ValueError("source archive provenance differs from the published manifest")
        old_checksums = {}
        for line in read_member(archive, f"{old_root}/SHA256SUMS.txt").decode("ascii").splitlines():
            digest, relative = line.split("  ", 1)
            if relative in old_checksums:
                raise ValueError(f"duplicate source checksum: {relative}")
            old_checksums[relative] = digest
        seen = set()
        for member in archive:
            if member.isdir():
                continue
            pure = PurePosixPath(member.name)
            if (not member.isfile() or pure.is_absolute() or ".." in pure.parts
                    or len(pure.parts) < 2 or pure.parts[0] != old_root):
                raise ValueError(f"unsafe or unsupported archive member: {member.name}")
            relative = PurePosixPath(*pure.parts[1:]).as_posix()
            if relative in seen:
                raise ValueError(f"duplicate source member: {relative}")
            seen.add(relative)
            source_count += 1
            category = relative.split("/", 1)[0]
            if category not in KEEP_DIRS:
                removed_categories[category] = removed_categories.get(category, 0) + 1
                continue
            destination = package.joinpath(*PurePosixPath(relative).parts)
            destination.parent.mkdir(parents=True, exist_ok=True)
            stream = archive.extractfile(member)
            if stream is None:
                raise ValueError(f"cannot read {relative}")
            with destination.open("wb") as output:
                shutil.copyfileobj(stream, output)
            os.chmod(destination, member.mode & 0o777)
            if old_checksums.get(relative) != sha256(destination):
                raise ValueError(f"source checksum mismatch: {relative}")
            kept_count += 1

    missing = [name for name in REQUIRED if not (package / name).is_file()]
    if missing or not any((package / "stdlib").rglob("*.rocket")):
        raise ValueError(f"missing required SDK inputs: {missing}")
    if not any((package / "licenses").iterdir()):
        raise ValueError("dependency licenses are missing")
    target_metadata = (package / "share/rocket/target.txt").read_text(encoding="ascii")
    if f"alias={args.target}\n" not in target_metadata:
        raise ValueError("target metadata differs from package target")

    (package / "INSTALL.md").write_text(install_text(args.target), encoding="utf-8", newline="\n")
    release = {
        "product": "Rocket SDK", "version": VERSION, "target": args.target,
        "source_commit": provenance["source_commit"],
        "compiler_sha256": provenance["compiler_sha256"],
        "original_archive": original["filename"],
        "original_archive_sha256": input_hash,
        "removed_categories": removed_categories,
    }
    (package / "RELEASE.json").write_text(json.dumps(release, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    files = sorted(path for path in package.rglob("*") if path.is_file())
    checksums = "".join(f"{sha256(path)}  {path.relative_to(package).as_posix()}\n" for path in files)
    (package / "SHA256SUMS.txt").write_text(checksums, encoding="ascii", newline="\n")

    output = args.output_dir / f"{new_root}.tar.xz"
    epoch = int(provenance["source_commit_epoch"])
    with output.open("wb") as raw, lzma.LZMAFile(raw, "w", preset=6) as compressed:
        with tarfile.open(fileobj=compressed, mode="w", format=tarfile.GNU_FORMAT) as archive:
            for path in sorted(p for p in package.rglob("*") if p.is_file()):
                name = f"{new_root}/{path.relative_to(package).as_posix()}"
                info = tarfile.TarInfo(name)
                info.size = path.stat().st_size
                info.mtime = epoch
                info.mode = path.stat().st_mode & 0o777
                with path.open("rb") as source:
                    archive.addfile(info, source)
    report = {
        "target": args.target, "source_commit": provenance["source_commit"],
        "original_archive_sha256": input_hash, "archive": output.name,
        "archive_size": output.stat().st_size, "archive_sha256": sha256(output),
        "source_files": source_count, "retained_source_files": kept_count,
        "removed_categories": removed_categories,
        "package_files": len(files) + 1,
    }
    (args.output_dir / f"report-{args.target}.json").write_text(
        json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(report, sort_keys=True))


if __name__ == "__main__":
    main()
