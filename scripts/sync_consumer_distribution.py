"""Synchronize a sparse consumer checkout from hash-verified published SDKs."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import urllib.request
import zipfile


def sha(path):
    with path.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def write(path, text):
    path.write_text(text, encoding='utf-8', newline='\n')


def inventory(path):
    return {name: digest for digest, name in (line.split('  ', 1) for line in path.read_text().splitlines())}


def tracked(repo):
    return set(subprocess.check_output(['git', '-C', str(repo), 'ls-files'], text=True).splitlines())


def sync_rocket(repo, manifest, archives):
    old = inventory(repo/'SHA256SUMS.txt')
    entries = [e for e in manifest if e['filename'].startswith('Rocket-SDK-')]
    assert {e['target'] for e in entries} == {'windows-x64', 'linux-x64', 'linux-arm64', 'macos-arm64'}
    archives.mkdir(parents=True, exist_ok=True)
    for entry in entries:
        destination = archives/entry['filename']
        urllib.request.urlretrieve(entry['url'], destination)
        assert destination.stat().st_size == entry['size'] and sha(destination) == entry['sha256']
    prefix = 'Rocket-SDK-3.0.0-windows-x64/'
    with zipfile.ZipFile(archives/'Rocket-SDK-3.0.0-windows-x64.zip') as archive:
        checksums = {name: digest for digest, name in (line.split('  ', 1) for line in archive.read(prefix+'SHA256SUMS.txt').decode().splitlines())}
        assert {n[len(prefix):] for n in archive.namelist()} == set(checksums) | {'SHA256SUMS.txt'}
        changed = {'INSTALL.md', 'RELEASE.json', 'stage0/rocketc-stage0.exe'}
        assert 'stage0/rocketc-stage0.exe' in checksums
        for name, digest in checksums.items():
            if name not in changed:
                assert old['platforms/windows-x64/'+name] == digest, name
        for name in sorted(changed | {'SHA256SUMS.txt'}):
            data = archive.read(prefix+name)
            if name in checksums:
                assert hashlib.sha256(data).hexdigest() == checksums[name]
            destination = repo/'platforms/windows-x64'/name
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(data)
        new = {'platforms/windows-x64/'+n: d for n, d in checksums.items()}
        new['platforms/windows-x64/SHA256SUMS.txt'] = sha(repo/'platforms/windows-x64/SHA256SUMS.txt')
    readme = (repo/'README.md').read_text()
    readme = readme.replace('toolchain and runtime libraries, standard library, target metadata,', 'the matching stage-zero host, toolchain and runtime libraries, standard library, target metadata,')
    readme = readme.replace('Extract a complete Unix archive', 'Keep `stage0/` with the SDK: version 3.0.0 uses this matching host for debugging,\nstructured IDE commands, and package security operations. It is part of the\nreleased runtime and must not be removed or replaced with an older compiler.\nExtract a complete Unix archive')
    write(repo/'README.md', readme)
    attributes = (repo/'.gitattributes').read_text()
    rule = 'platforms/windows-x64/stage0/rocketc-stage0.exe filter=lfs diff=lfs merge=lfs -text\n'
    if rule not in attributes:
        attributes += rule
    write(repo/'.gitattributes', attributes)
    for entry in entries:
        if entry['target'] == 'windows-x64':
            continue
        name = 'platforms/'+entry['filename']
        (archives/entry['filename']).replace(repo/name)
        new[name] = entry['sha256']
    for name in ('.gitattributes', '.gitignore', 'README.md', 'ROADMAP.md'):
        new[name] = sha(repo/name)
    assert (tracked(repo) - {'SHA256SUMS.txt'} | {'platforms/windows-x64/stage0/rocketc-stage0.exe'}) == set(new)
    write(repo/'SHA256SUMS.txt', ''.join(f'{new[n]}  {n}\n' for n in sorted(new)))


def sync_ide(repo, manifest):
    windows = next(e for e in manifest if e['filename'] == 'Rocket-SDK-3.0.0-windows-x64.zip')
    release = json.loads((repo/'RELEASE.json').read_text())
    old_hash = release['sdk_sha256']
    release['sdk_sha256'] = windows['sha256']
    write(repo/'RELEASE.json', json.dumps(release, indent=2)+'\n')
    readme = (repo/'README.md').read_text().replace(old_hash, windows['sha256'])
    readme = readme.replace('Extract the SDK and select', 'Extract the entire SDK, keeping its matching `stage0/` host for debugging and structured IDE commands, and select')
    write(repo/'README.md', readme)
    attributes = (repo/'.gitattributes').read_text()
    for rule in ('/README.md text eol=lf\n', '/RELEASE.json text eol=lf\n', '/.gitattributes text eol=lf\n', '/SHA256SUMS.txt text eol=lf\n'):
        if rule not in attributes:
            attributes += rule
    write(repo/'.gitattributes', attributes)
    checksums = inventory(repo/'SHA256SUMS.txt')
    for name in ('.gitattributes', 'README.md', 'RELEASE.json'):
        checksums[name] = sha(repo/name)
    assert tracked(repo) - {'SHA256SUMS.txt'} == set(checksums)
    write(repo/'SHA256SUMS.txt', ''.join(f'{checksums[n]}  {n}\n' for n in sorted(checksums)))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--product', choices=['rocket', 'ide'], required=True)
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--manifest', type=Path, required=True)
    parser.add_argument('--archives', type=Path)
    args = parser.parse_args()
    manifest = json.loads(args.manifest.read_text())
    if args.product == 'rocket':
        assert args.archives is not None
        sync_rocket(args.repo.resolve(), manifest, args.archives.resolve())
    else:
        sync_ide(args.repo.resolve(), manifest)
    print('Consumer synchronized; existing Windows/IDE application binary hashes preserved.')
