import React, { useState } from 'react';
import { 
  Play, Download, Terminal, ArrowRight, Monitor, 
  Cpu, ShieldCheck, Check, Sparkles, Layers, Box, Code2, Bug, Zap
} from 'lucide-react';
import { AppPage } from '../App';
import { RealIdeScreenshot } from './RealIdeScreenshot';
import { BenchmarkComparison } from './BenchmarkComparison';

// Import image assets directly so Vite bundles them with correct relative hashes on GitHub Pages
import codeTypesImg from '../assets/images/rocket_code_types_1790262748282.jpg';
import codeSystemsImg from '../assets/images/rocket_code_systems_1790262761562.jpg';
import logoImg from '../assets/images/rocket_ide_logo.png';

interface PageIntroProps {
  onNavigate: (page: AppPage) => void;
}

export const PageIntro: React.FC<PageIntroProps> = ({ onNavigate }) => {
  const [simOutput, setSimOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'problems' | 'output' | 'debug'>('problems');

  const handleRunInIde = () => {
    setIsRunning(true);
    setActiveBottomTab('output');
    setSimOutput('[rocketc] Compiling fibonacci.rocket...\n[LLVM O2] Generating machine code...');
    setTimeout(() => {
      setIsRunning(false);
      setSimOutput('Calculating fib(10)...\n55\n\n[Process exited with code 0 in 14ms]');
    }, 350);
  };

  return (
    <div className="space-y-24 py-4 animate-in fade-in duration-300">
      
      {/* 1. Hero Section */}
      <div className="relative text-center max-w-4xl mx-auto pt-6 sm:pt-10">
        
        {/* Subtle Ambient Live Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-orange-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white text-balance leading-[1.12]">
          Python Elegance. Bare-Metal Speed.
        </h1>

        {/* Clean Standard Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={() => onNavigate('download-ide')}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-all shadow-md hover:shadow-white/10"
          >
            <Download className="w-4 h-4" />
            <span>Download RocketIDE</span>
          </button>

          <button
            onClick={() => onNavigate('try')}
            className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-neutral-200 hover:text-white bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current text-orange-400" />
            <span>Try in Browser</span>
          </button>

          <button
            onClick={() => onNavigate('download-lang')}
            className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <Terminal className="w-4 h-4" />
            <span>Language Toolchain</span>
          </button>
        </div>

        {/* Live Interactive Mockup of RocketIDE */}
        <div className="mt-14 rounded-xl border border-neutral-800 bg-[#000000] shadow-2xl overflow-hidden text-left">
          
          {/* Window Chrome Title Bar */}
          <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-300 select-none">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-2">
                <img src={logoImg} alt="RocketIDE Icon" className="w-4 h-4 object-contain" />
                <span className="font-mono-code text-[11px] text-neutral-300">
                  fibonacci.rocket — RocketIDE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono-code">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Interactive Simulator</span>
            </div>
          </div>

          <div className="bg-[#000000] text-neutral-100 font-sans">
            
            {/* Real RocketIDE Menu Bar */}
            <div className="px-3 py-1 bg-neutral-900/90 border-b border-neutral-800/80 flex items-center gap-4 text-[11px] text-neutral-400 select-none overflow-x-auto">
              <span className="hover:text-white cursor-pointer">File</span>
              <span className="hover:text-white cursor-pointer">Edit</span>
              <span className="hover:text-white cursor-pointer">Selection</span>
              <span className="hover:text-white cursor-pointer">View</span>
              <span className="hover:text-white cursor-pointer">Navigate</span>
              <span className="hover:text-white cursor-pointer">Build</span>
              <span className="hover:text-white cursor-pointer text-neutral-200 font-semibold">Run</span>
              <span className="hover:text-white cursor-pointer">Debug</span>
              <span className="hover:text-white cursor-pointer">Tools</span>
              <span className="hover:text-white cursor-pointer">Help</span>
            </div>

            {/* Real RocketIDE Command Bar (Toolbar) */}
            <div className="px-3 py-1.5 bg-neutral-900/40 border-b border-neutral-800 flex items-center justify-between gap-4 text-xs select-none">
              <div className="flex items-center gap-3 overflow-x-auto">
                <span className="text-[11px] text-neutral-400">New</span>
                <span className="text-[11px] text-neutral-400">Open</span>
                <span className="text-[11px] text-neutral-400">Folder</span>
                <span className="text-[11px] text-neutral-400">Save</span>
                <span className="text-neutral-700">|</span>
                <button
                  onClick={handleRunInIde}
                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 px-2 py-0.5 bg-emerald-500/10 rounded transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Run</span>
                </button>
                <button
                  onClick={handleRunInIde}
                  className="text-[11px] text-neutral-300 hover:text-white px-1.5 py-0.5 rounded hover:bg-neutral-800 transition-colors"
                >
                  Debug
                </button>
                <span className="text-[11px] text-neutral-500">Pause</span>
                <span className="text-[11px] text-neutral-500">Stop</span>
                <span className="text-[11px] text-neutral-400">Test</span>
              </div>

              <div className="text-[11px] text-neutral-400 font-mono-code hidden sm:block">
                target: fibonacci.rocket
              </div>
            </div>

            {/* Main Area: Explorer + Editor */}
            <div className="grid grid-cols-12 min-h-[300px]">
              
              {/* Explorer Left Pane */}
              <div className="col-span-3 border-r border-neutral-800 bg-[#000000] p-3 hidden sm:block font-mono-code text-[11px] text-neutral-400 select-none">
                <div className="text-[10px] uppercase font-bold text-neutral-500 mb-2">EXPLORER</div>
                <div className="space-y-1">
                  <div className="text-neutral-200 font-semibold">▾ Rocket</div>
                  <div className="pl-3 space-y-0.5 text-neutral-400">
                    <div>▸ compiler</div>
                    <div>▸ dependencies</div>
                    <div>▸ docs</div>
                    <div>▸ examples</div>
                    <div>▸ src</div>
                    <div>▸ stdlib</div>
                    <div>▸ tests</div>
                    <div className="text-orange-400 font-semibold bg-neutral-900 px-1 py-0.5 rounded">
                      fibonacci.rocket
                    </div>
                    <div>test.rocket</div>
                    <div>rocket.toml</div>
                    <div>README.md</div>
                  </div>
                </div>
              </div>

              {/* Editor Center Pane */}
              <div className="col-span-12 sm:col-span-9 flex flex-col justify-between bg-[#000000]">
                
                {/* Editor File Tab */}
                <div className="px-3 py-1 bg-neutral-900 border-b border-neutral-800 flex items-center gap-2 text-xs font-mono-code">
                  <span className="text-neutral-200 font-medium">fibonacci.rocket</span>
                  <span className="text-neutral-500 text-[10px]">✕</span>
                </div>

                {/* Editor Lines */}
                <div className="p-4 font-mono-code text-xs sm:text-sm text-neutral-200 leading-relaxed overflow-y-auto">
                  <div className="flex gap-4">
                    <div className="select-none text-neutral-600 text-right w-5">
                      1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9<br/>10<br/>11
                    </div>
                    <div className="space-y-0.5">
                      <div><span className="text-purple-400 font-semibold">fn</span> <span className="text-blue-400 font-semibold">fib</span>(n: <span className="text-emerald-400">Int</span>) -&gt; <span className="text-emerald-400">Int</span>:</div>
                      <div className="pl-4"><span className="text-purple-400">if</span> n &lt; <span className="text-amber-400">2</span>:</div>
                      <div className="pl-8"><span className="text-purple-400">return</span> n</div>
                      <div className="pl-4"><span className="text-purple-400">else</span>:</div>
                      <div className="pl-8"><span className="text-purple-400">return</span> <span className="text-blue-400">fib</span>(n - <span className="text-amber-400">1</span>) + <span className="text-blue-400">fib</span>(n - <span className="text-amber-400">2</span>)</div>
                      <div className="h-2"></div>
                      <div><span className="text-purple-400 font-semibold">fn</span> <span className="text-blue-400 font-semibold">main</span>() -&gt; <span className="text-emerald-400">Int</span>:</div>
                      <div className="pl-4"><span className="text-blue-300">print</span>(<span className="text-amber-300">"Calculating fib(10)..."</span>)</div>
                      <div className="pl-4"><span className="text-blue-300">print</span>(<span className="text-blue-400">fib</span>(<span className="text-amber-400">10</span>))</div>
                      <div className="pl-4"><span className="text-purple-400">return</span> <span className="text-amber-400">0</span></div>
                    </div>
                  </div>
                </div>

                {/* Bottom Panels */}
                <div className="border-t border-neutral-800 bg-neutral-900/80">
                  <div className="px-3 py-1 border-b border-neutral-800 flex items-center gap-4 text-[11px] font-mono-code text-neutral-400">
                    <button
                      onClick={() => setActiveBottomTab('problems')}
                      className={`hover:text-white ${activeBottomTab === 'problems' ? 'text-white font-bold border-b border-orange-400' : ''}`}
                    >
                      PROBLEMS
                    </button>
                    <button
                      onClick={() => setActiveBottomTab('output')}
                      className={`hover:text-white ${activeBottomTab === 'output' ? 'text-white font-bold border-b border-orange-400' : ''}`}
                    >
                      OUTPUT
                    </button>
                    <button
                      onClick={() => setActiveBottomTab('debug')}
                      className={`hover:text-white ${activeBottomTab === 'debug' ? 'text-white font-bold border-b border-orange-400' : ''}`}
                    >
                      DEBUG
                    </button>
                  </div>

                  <div className="p-3 text-xs font-mono-code min-h-[64px] text-neutral-300">
                    {activeBottomTab === 'problems' ? (
                      <div className="text-neutral-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>No problems detected. (rocket-lsp online · 0 errors)</span>
                      </div>
                    ) : activeBottomTab === 'output' ? (
                      <pre className="text-emerald-400 text-[11px] leading-relaxed">
                        {simOutput || 'Click "Run" in toolbar to execute program.'}
                      </pre>
                    ) : (
                      <div className="text-neutral-500 text-[11px]">
                        DbgEng Engine: Microsoft DbgX active. CodeView PDB loaded.
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Status Bar */}
            <div className="px-3 py-1 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono-code text-neutral-400 overflow-x-auto">
              <div className="flex items-center gap-3">
                <span className="text-orange-400 font-semibold">Rocket SDK: rocketc</span>
                <span>|</span>
                <span>LSP: online · 274 files</span>
                <span>|</span>
                <span>Target: fibonacci.rocket (standalone)</span>
              </div>
              <div className="flex items-center gap-3">
                <span>Ln 1, Col 1</span>
                <span>UTF-8</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 2. Scroll Section: Real RocketIDE Desktop Workspace (01 / DESKTOP ENVIRONMENT) */}
      <div className="space-y-6 max-w-5xl mx-auto pt-8 border-t border-neutral-800/80">
        <div className="max-w-2xl">
          <div className="text-xs font-bold text-orange-400 font-mono-code uppercase tracking-wider mb-1.5">
            01 / DESKTOP ENVIRONMENT
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            RocketIDE Desktop Studio
          </h2>
          <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
            A native application engineered specifically for creating, diagnosing, and building multi-file Rocket projects without external dependencies.
          </p>
        </div>

        {/* Real Authentic RocketIDE UI (Zero AI-fake artifacts, pixel-accurate) */}
        <RealIdeScreenshot />

        {/* Architectural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Code2 className="w-4 h-4 text-orange-400" />
              <span>AvalonEdit Syntax Engine</span>
            </div>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Custom indentation tracking for Rocket colon syntax, bracket matching, and fast rendering.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Bug className="w-4 h-4 text-orange-400" />
              <span>Microsoft DbgEng Native Debugger</span>
            </div>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Maps native CodeView PDB debug symbols directly back to your source lines with call stacks and locals.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Terminal className="w-4 h-4 text-orange-400" />
              <span>rocket-lsp Protocol 1.0</span>
            </div>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Incremental multi-package analysis, real-time diagnostic error lists, and symbol navigation.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Performance Benchmark Section: Counting to 1 Million (Rocket vs Python) */}
      <div className="max-w-5xl mx-auto pt-8 border-t border-neutral-800/80">
        <BenchmarkComparison />
      </div>

      {/* 4. Scroll Section: Modern Syntax & Type System (Pic 2 - Code Visual 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto pt-8 border-t border-neutral-800/80">
        
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold text-orange-400 font-mono-code uppercase tracking-wider">
            02 / SYNTAX &amp; TYPES
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Expressive Indentation &amp; Generics
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Rocket combines readable indentation structure with strong static typing. Features generic structures (<code className="text-orange-300 font-mono-code">Pair[T]</code>), payload enums, exhaustive pattern matching, and exception-free postfix <code className="text-orange-300 font-mono-code">?</code> error propagation.
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Inferred immutable <code className="text-orange-300 font-mono-code">let</code> and mutable <code className="text-orange-300 font-mono-code">var</code></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Generic structs and exhaustive enum matches</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero-cost postfix <code className="text-orange-300 font-mono-code">?</code> propagation on Result[T, E]</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-xl border border-neutral-800 bg-[#000000] overflow-hidden shadow-2xl">
          <img
            src={codeTypesImg}
            alt="Rocket Type System Code"
            className="w-full h-auto object-cover"
          />
        </div>

      </div>

      {/* 5. Scroll Section: Concurrency & Systems Programming (Pic 3 - Code Visual 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto pt-8 border-t border-neutral-800/80">
        
        <div className="lg:col-span-7 rounded-xl border border-neutral-800 bg-[#000000] overflow-hidden shadow-2xl order-2 lg:order-1">
          <img
            src={codeSystemsImg}
            alt="Rocket Concurrency & Systems Code"
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
          <div className="text-xs font-bold text-orange-400 font-mono-code uppercase tracking-wider">
            03 / SYSTEMS RUNTIME
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Deterministic Memory &amp; LLVM Speed
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Rocket compiles to native machine code via the LLVM optimization pipeline. The runtime eliminates garbage collection pauses using static ownership analysis, safe reference downgrades, and buffer lifecycle management.
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Native LLVM O2 machine code generation</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Structured coroutines and thread synchronization</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero-dependency native static executables</span>
            </div>
          </div>
        </div>

      </div>

      {/* 6. Bottom Call-To-Action Banner */}
      <div className="max-w-5xl mx-auto p-8 rounded-xl border border-neutral-800 bg-neutral-900/40 text-center space-y-5">
        <h3 className="text-2xl font-bold font-display text-white">
          Ready to experience Rocket?
        </h3>
        <p className="text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
          Launch Rocket programs in the in-browser simulator or install RocketIDE for your platform.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('download-ide')}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download RocketIDE</span>
          </button>
          <button
            onClick={() => onNavigate('try')}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-all"
          >
            <Play className="w-3.5 h-3.5 text-orange-400 fill-current" />
            <span>Try Online Simulator</span>
          </button>
        </div>
      </div>

    </div>
  );
};
