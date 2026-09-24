import React, { useState } from 'react';
import { BENCHMARK_COUNT_MILLION } from '../data/rocketData';
import { Play, RotateCcw, Zap, Clock, Cpu, CheckCircle2 } from 'lucide-react';

export const BenchmarkComparison: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [rocketProgress, setRocketProgress] = useState(0);
  const [pythonProgress, setPythonProgress] = useState(0);
  const [currentRocketTime, setCurrentRocketTime] = useState<number | null>(null);
  const [currentPythonTime, setCurrentPythonTime] = useState<number | null>(null);

  const runBenchmark = () => {
    setIsRunning(true);
    setHasRun(true);
    setRocketProgress(0);
    setPythonProgress(0);
    setCurrentRocketTime(null);
    setCurrentPythonTime(null);

    // Rocket finishes quickly in ~166ms
    const rocketStartTime = performance.now();
    const rocketInterval = setInterval(() => {
      const elapsed = (performance.now() - rocketStartTime) / 1000;
      if (elapsed >= BENCHMARK_COUNT_MILLION.rocketTime) {
        clearInterval(rocketInterval);
        setRocketProgress(100);
        setCurrentRocketTime(BENCHMARK_COUNT_MILLION.rocketTime);
      } else {
        setRocketProgress((elapsed / BENCHMARK_COUNT_MILLION.rocketTime) * 100);
      }
    }, 16);

    // Python runs until 1.52s
    const pythonStartTime = performance.now();
    const pythonInterval = setInterval(() => {
      const elapsed = (performance.now() - pythonStartTime) / 1000;
      if (elapsed >= BENCHMARK_COUNT_MILLION.pythonTime) {
        clearInterval(pythonInterval);
        setPythonProgress(100);
        setCurrentPythonTime(BENCHMARK_COUNT_MILLION.pythonTime);
        setIsRunning(false);
      } else {
        setPythonProgress((elapsed / BENCHMARK_COUNT_MILLION.pythonTime) * 100);
      }
    }, 30);
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-[#000000] p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 font-mono-code uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span>Execution Speed Benchmark</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
            Counting to 1,000,000: Rocket vs. Python
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Measuring tight loop execution: 1 million sequential increments.
          </p>
        </div>

        <button
          onClick={runBenchmark}
          disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 disabled:opacity-50 rounded-lg transition-all shadow-sm shrink-0 self-start sm:self-auto"
        >
          {isRunning ? (
            <>
              <div className="w-3 h-3 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              <span>Simulating Loop...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current text-orange-500" />
              <span>Run Benchmark Race</span>
            </>
          )}
        </button>
      </div>

      {/* Side-by-side Race Meters */}
      <div className="space-y-4">
        
        {/* Rocket Row */}
        <div className="p-4 rounded-xl border border-orange-500/30 bg-neutral-950/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-code">
            <div className="flex items-center gap-2 font-bold text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
              <span>Rocket (LLVM O2 Native Machine Code)</span>
            </div>
            <div className="text-orange-300 font-bold tabular-nums">
              {currentRocketTime !== null ? `${currentRocketTime.toFixed(3)}s` : isRunning ? `${(rocketProgress * 0.00166).toFixed(3)}s` : `${BENCHMARK_COUNT_MILLION.rocketTime}s`}
              <span className="ml-2 text-emerald-400 font-sans text-[11px] font-semibold">({BENCHMARK_COUNT_MILLION.speedup} faster)</span>
            </div>
          </div>

          <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-75"
              style={{ width: hasRun ? `${rocketProgress}%` : '100%' }}
            />
          </div>
        </div>

        {/* Python Row */}
        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-code">
            <div className="flex items-center gap-2 font-medium text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span>Python 3.12 (CPython Bytecode Interpreter)</span>
            </div>
            <div className="text-neutral-400 font-medium tabular-nums">
              {currentPythonTime !== null ? `${currentPythonTime.toFixed(3)}s` : isRunning ? `${(pythonProgress * 0.0152).toFixed(3)}s` : `${BENCHMARK_COUNT_MILLION.pythonTime}s`}
            </div>
          </div>

          <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-75"
              style={{ width: hasRun ? `${pythonProgress}%` : '100%' }}
            />
          </div>
        </div>

      </div>

      {/* Code Comparison Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        
        {/* Rocket Code */}
        <div className="rounded-lg border border-neutral-800 bg-[#08080a] overflow-hidden">
          <div className="px-3.5 py-1.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs font-mono-code text-neutral-300">
            <span>count_million.rocket</span>
            <span className="text-orange-400 text-[11px] font-semibold">0.166s</span>
          </div>
          <pre className="p-3.5 font-mono-code text-xs text-neutral-200 overflow-x-auto leading-relaxed">
            {BENCHMARK_COUNT_MILLION.rocketCode}
          </pre>
        </div>

        {/* Python Code */}
        <div className="rounded-lg border border-neutral-800 bg-[#08080a] overflow-hidden">
          <div className="px-3.5 py-1.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs font-mono-code text-neutral-400">
            <span>count_million.py</span>
            <span className="text-neutral-500 text-[11px]">1.520s</span>
          </div>
          <pre className="p-3.5 font-mono-code text-xs text-neutral-400 overflow-x-auto leading-relaxed">
            {BENCHMARK_COUNT_MILLION.pythonCode}
          </pre>
        </div>

      </div>

      {/* Engineering Takeaway */}
      <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-400 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Rocket emits optimized LLVM native loops directly into hardware registers with zero boxing or garbage collection checks, finishing the 1,000,000 increments in just <strong>0.166 seconds</strong>.
        </p>
      </div>

    </div>
  );
};
