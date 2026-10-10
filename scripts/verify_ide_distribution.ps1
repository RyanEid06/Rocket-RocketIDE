[CmdletBinding()]
param([Parameter(Mandatory)][string]$Sdk, [Parameter(Mandatory)][string]$OutputRoot)
$ErrorActionPreference = 'Stop'
$OutputRoot = [IO.Path]::GetFullPath($OutputRoot)
if (Test-Path -LiteralPath $OutputRoot) { throw 'Use a new disposable IDE verification directory.' }
New-Item -ItemType Directory -Path $OutputRoot | Out-Null
$manifest = Get-Content -Raw (Join-Path $PSScriptRoot '../public/downloads.json') | ConvertFrom-Json
foreach ($name in 'RocketIDE-win-x64-1.0.0.zip','RocketIDE-Setup-1.0.0.exe') {
    $entry = $manifest | Where-Object filename -EQ $name
    gh release download v3.0.0 -R RyanEid06/Rocket-RocketIDE -p $name -D $OutputRoot
    if ($LASTEXITCODE -ne 0) { throw "Download failed: $name" }
    $file = Get-Item -LiteralPath (Join-Path $OutputRoot $name)
    if ($file.Length -ne $entry.size -or (Get-FileHash $file.FullName).Hash -ne $entry.sha256) {
        throw "Frozen IDE asset identity mismatch: $name"
    }
}
$portable = Join-Path $OutputRoot 'portable'
Expand-Archive -LiteralPath (Join-Path $OutputRoot 'RocketIDE-win-x64-1.0.0.zip') -DestinationPath $portable
$payload = Join-Path $portable 'RocketIDE-win-x64-1.0.0'
foreach ($file in 'RocketIDE.exe','RocketIDE.Debugger.dll','amd64/EngHost.exe','RocketIDE.runtimeconfig.json') {
    if (-not (Test-Path -LiteralPath (Join-Path $payload $file) -PathType Leaf)) { throw "Missing IDE component: $file" }
}
$files = @(Get-ChildItem -LiteralPath $payload -File -Recurse)
$installed = [IO.Path]::GetFullPath((Join-Path $OutputRoot 'installed'))
if (-not $installed.StartsWith($OutputRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Installer target must remain inside the disposable verification root.'
}
$setup = Start-Process -FilePath (Join-Path $OutputRoot 'RocketIDE-Setup-1.0.0.exe') -WindowStyle Hidden `
    -ArgumentList @('/VERYSILENT','/SUPPRESSMSGBOXES','/NORESTART','/SP-',"/DIR=`"$installed`"") -PassThru -Wait
if ($setup.ExitCode -ne 0) { throw "Installer exited $($setup.ExitCode)" }
foreach ($file in $files) {
    $relative = [IO.Path]::GetRelativePath($payload, $file.FullName)
    if ((Get-FileHash -LiteralPath (Join-Path $installed $relative)).Hash -ne (Get-FileHash $file.FullName).Hash) {
        throw "Installed payload mismatch: $relative"
    }
}
$consumer = Join-Path $OutputRoot 'consumer'
git clone --depth 1 --branch consumer https://github.com/RyanEid06/RocketIDE.git $consumer
if ($LASTEXITCODE -ne 0) { throw 'IDE consumer clone failed' }
git -C $consumer lfs pull
if ($LASTEXITCODE -ne 0) { throw 'IDE consumer LFS retrieval failed' }
$consumerFiles = @(Get-ChildItem -LiteralPath (Join-Path $consumer 'app') -File -Recurse)
if ($consumerFiles.Count -ne $files.Count) { throw 'IDE consumer/portable payload file counts differ' }
foreach ($file in $files) {
    $relative = [IO.Path]::GetRelativePath($payload, $file.FullName)
    if ((Get-FileHash -LiteralPath (Join-Path $consumer "app/$relative")).Hash -ne (Get-FileHash $file.FullName).Hash) {
        throw "IDE consumer payload differs: $relative"
    }
}
$fixture = Join-Path $OutputRoot 'debug fixture'
New-Item -ItemType Directory -Path $fixture | Out-Null
[IO.File]::WriteAllText((Join-Path $fixture 'debug.rocket'), "fn main() -> Int:`n    let seed = 40`n    let answer = seed + 2`n    print(answer)`n    return 0`n")
$savedPath = $env:PATH
$savedRocket = @{}
Get-ChildItem Env:ROCKET_* | ForEach-Object { $savedRocket[$_.Name] = $_.Value; Remove-Item -LiteralPath "Env:$($_.Name)" }
try {
    $env:PATH = "$env:SystemRoot/System32;$env:SystemRoot"
    & (Join-Path $Sdk 'bin/rocketc.exe') build (Join-Path $fixture 'debug.rocket') --debug --message-format=json
    if ($LASTEXITCODE -ne 0) { throw 'Packaged debug fixture build failed' }
} finally {
    $env:PATH = $savedPath
    foreach ($key in $savedRocket.Keys) { Set-Item -LiteralPath "Env:$key" -Value $savedRocket[$key] }
}
$probe = Join-Path $OutputRoot 'probe'
dotnet build (Join-Path $PSScriptRoot 'debugger-probe/DebuggerProbe.csproj') -c Release -o $probe "-p:Payload=$payload" --nologo
if ($LASTEXITCODE -ne 0) { throw 'Debugger test harness compilation failed' }
& (Join-Path $probe 'DebuggerProbe.exe') $fixture
if ($LASTEXITCODE -ne 0) { throw 'Packaged debugger native probe failed' }
$uninstall = Start-Process -FilePath (Join-Path $installed 'unins000.exe') -WindowStyle Hidden `
    -ArgumentList @('/VERYSILENT','/SUPPRESSMSGBOXES','/NORESTART') -Wait -PassThru
if ($uninstall.ExitCode -ne 0) { throw "Disposable uninstall failed: $($uninstall.ExitCode)" }
[pscustomobject]@{portableFiles=$files.Count;consumerFiles=$consumerFiles.Count;installerPayloadIdentical=$true;nativeDebuggerPassed=$true} |
    ConvertTo-Json | Set-Content -LiteralPath 'dist-sdk/ide-verification.json'
Write-Host 'IDE INSTALLER / CONSUMER / NATIVE DEBUGGER PASS'
