# SDK runtime repair — 2026-10-10

The four public Rocket 3.0.0 SDKs now retain the matching stage-zero runtime host. All four were repackaged from the original tested release archives without rebuilding Rocket, its language server, or RocketIDE.

## Cause and repair

The consumer cleaning scripts discarded `stage0/` as though it were generated development output. Rocket 3.0.0 uses that matching host at runtime for debug builds, structured IDE commands, and package tooling/security operations. Plain check/run smoke tests did not cover these paths. Removing the host therefore broke supported user operations even when plain compilation worked.

The corrected scripts retain the complete `stage0/` directory, require the Windows executable or both Unix launcher and binary, retain executable permissions, and include these files in package checksums. Regression tests reject incomplete hosts. Existing immutable input identities, path guards, per-file checksums, and compiler provenance remain enforced.

The original release inputs remain available. The Windows host is the original 3.0.0 executable, SHA-256 `5b0f2cb5c4d81508aa5bcb2d44c9d1c6a515a8e802d480e873df8b008a8799f1`; an older stage-zero compiler is not a compatible replacement.

## Published packages

All SDKs originate from Rocket source `1f6ba76f16f3246095d5d573c28d825d8b9367e3`.

| Target | Files | Archive bytes | SHA-256 |
| --- | ---: | ---: | --- |
| Windows x64 | 891 | 328482532 | `b4d72588af417a748e8d552543487ad411f26600838857be594c89a579bf50b0` |
| Linux x64 | 451 | 587452344 | `0417fb5fcd581ec2c6cd30f68b38ddb4d5f923de2a2fcfebcc127ed8e528f4a0` |
| Linux ARM64 | 435 | 542345180 | `5728aef2d87c755317e70a790a38dd01288a47ba4653c8ad7308fee17fe54878` |
| macOS ARM64 | 394 | 299003568 | `b17cc0c46131c39ed513a872ef3fbf365a62a81ac86b6701c5c78e82112de7e8` |

The website download manifest, displayed sizes/hashes, and release `downloads.json` / `SHA256SUMS.txt` agree. The actual deployed JavaScript contains all six current asset names and full hashes; all six public download links returned HTTP 200.

RocketIDE's installer and portable ZIP were already complete and retain their original bytes:

- Installer: `edcf2fa265f5663b2420286ca8b62b14d8e98f1af62927272d8d2ce02e59e8b1`.
- Portable ZIP: `a5e1966a322ec19e391a775ef1909fec32a51b36b3869215a0117fc24fcb174c`.

## GitHub branches

- Rocket `consumer`: `4d81eb4a4e0fd627c29da9cc9f794a3d21c6dd33`. Windows host and metadata restored; all three Unix archives replaced with the verified complete packages. Existing Windows tool/runtime/library bytes remain unchanged. Root and Windows package checksum inventories agree. All four new LFS objects uploaded successfully; anonymous LFS batch/download metadata returned HTTP 200 with the expected object identities and sizes. Final tree contains 899 tracked files and no temporary repair workflow.
- RocketIDE `consumer`: `be6a218`. Updated the SDK reference hash and setup guidance; all 834 application file hashes remain unchanged. Root metadata text rules are anchored so `app/** -text` continues to preserve the frozen payload.
- Rocket `master` remains `3d62e5407b199a5b9318f3d9f6ccd090af8e45a9`; RocketIDE `master` remains `73340f97388b675cbd6f54da5465b7da80047cbd`. Developer source and existing local IDE edits were preserved.

## Verification evidence

- [Candidate native verification](https://github.com/RyanEid06/Rocket-RocketIDE/actions/runs/38039048393): all four hosts passed.
- [Publication and archive identity verification](https://github.com/RyanEid06/Rocket-RocketIDE/actions/runs/38040545386): passed.
- [Fresh public-download native replay](https://github.com/RyanEid06/Rocket-RocketIDE/actions/runs/38040815860): all four hosts passed.
- [Rocket consumer synchronization and LFS upload](https://github.com/RyanEid06/Rocket/actions/runs/38040825265): passed.
- [Machine-readable repair receipt](https://github.com/RyanEid06/Rocket-RocketIDE/releases/download/v3.0.0/SDK-Runtime-Repair-2026-10-10.json).

Native tests verify exact file inventories, SHA-256 values, compiler/host/LSP versions, plain and structured check/build/test, dependency resolve/tree/audit, debug artifacts, and executing the resulting program. Tests sanitize developer tool variables and PATH and run from paths containing spaces. Windows debug output includes the executable, PDB, and Rocket source map.

The Windows tests additionally verify all 834 installed files against the portable package and IDE consumer branch. The released native debugger passed breakpoint binding, source location, local `answer = 42`, stepping, termination, and a second complete session. The harness uses the frozen self-contained runtime and application dependency manifests; it does not rebuild the IDE.

Website TypeScript checks, production builds, packaging regressions, and independent review passed. These are native hosted and isolated local checks; the user's fresh Desktop installation and full interactive GUI workflow remain to be tried.

## Clean Windows setup

1. Close RocketIDE. Keep the old folder as a temporary backup while trying the fresh setup.
2. Download the IDE installer or complete portable ZIP and the corrected Windows SDK from the website. Extract the SDK into a new directory; keep every directory, including `stage0`, together.
3. Open **Tools > Rocket SDK Settings** and select the new SDK's `bin/rocketc.exe` and `bin/rocket-lsp.exe`.
4. Use a writable project folder and try Check, Build, Run, and Debug. Debug builds generate output under the project's `.rocketc` directory.

App removal/reinstallation preserves `%LOCALAPPDATA%\RocketIDE`, so previous tool paths may remain until selected again. Linux SDKs require the documented glibc/libcurl development packages; macOS requires Xcode Command Line Tools and an active Apple SDK. The user's installed Desktop folder, projects, environment variables, and settings were not changed by this repair.
