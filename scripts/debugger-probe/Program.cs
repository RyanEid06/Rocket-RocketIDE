using System.IO;
using RocketIDE.Debugger;

var fixture = Path.GetFullPath(args[0]);
var source = Path.Combine(fixture, "debug.rocket");
var bin = Path.Combine(fixture, ".rocketc", "targets", "windows-x64");
var request = new RocketDebugLaunchRequest(Path.Combine(bin, "debug.exe"),
    Path.Combine(bin, "debug.pdb"), Path.Combine(bin, "debug.rocket.map.json"),
    fixture, fixture, [], [new(source, 4)]);
for (var iteration = 0; iteration < 2; iteration++)
{
    using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(45));
    await using var debugger = new RocketNativeDebugger(await DbgXCommandTransport.CreateAsync(timeout.Token));
    debugger.StateChanged += (_, e) => Console.WriteLine($"STATE {e.State}: {e.Message}");
    await debugger.LaunchAsync(request, timeout.Token);
    if (debugger.State != RocketDebugSessionState.Stopped || debugger.CurrentLocation?.Line != 4)
        throw new Exception("Packaged debugger did not stop at the source breakpoint.");
    if (!debugger.Breakpoints.Any(b => b.IsBound) || debugger.Frames.Count == 0)
        throw new Exception("Packaged debugger did not bind symbols and stack frames.");
    var evaluation = await debugger.EvaluateAsync("answer", timeout.Token);
    Console.WriteLine($"EVALUATE answer: {evaluation}");
    if (!evaluation.IsAvailable || !evaluation.Value.Contains("42"))
        throw new Exception("Packaged debugger could not inspect the local answer.");
    await debugger.StepOverAsync(timeout.Token);
    if (debugger.State != RocketDebugSessionState.Stopped || debugger.CurrentLocation?.Line != 5)
        throw new Exception("Packaged debugger did not step to the next source line.");
    await debugger.StopAsync(timeout.Token);
    if (debugger.State != RocketDebugSessionState.Terminated)
        throw new Exception("Packaged debugger did not terminate cleanly.");
}
Console.WriteLine("PACKAGED DEBUGGER BREAKPOINT / LOCALS / STEP / REPEAT PASS");
