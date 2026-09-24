import React, { useState } from 'react';
import { CODE_EXAMPLES } from '../data/rocketData';
import { CodeExample } from '../types';
import { 
  Play, RotateCcw, Copy, Check, Download, Terminal, 
  ArrowLeft, Monitor, Folder, FileCode, CheckCircle2, Bug
} from 'lucide-react';
import { AppPage } from '../App';

interface PagePlaygroundProps {
  onNavigate: (page: AppPage) => void;
}

export const PagePlayground: React.FC<PagePlaygroundProps> = ({ onNavigate }) => {
  const [selectedExample, setSelectedExample] = useState<CodeExample>(CODE_EXAMPLES[0]);
  const [userCode, setUserCode] = useState<string>(CODE_EXAMPLES[0].code);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'problems' | 'output' | 'debug' | 'terminal'>('output');
  const [simOutput, setSimOutput] = useState<string>(CODE_EXAMPLES[0].simulatedOutput);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectExample = (example: CodeExample) => {
    setSelectedExample(example);
    setUserCode(example.code);
    setSimOutput(example.simulatedOutput);
  };

  const handleRunInIde = () => {
    setIsRunning(true);
    setActiveBottomTab('output');
    setSimOutput(`[rocketc] Compiling ${selectedExample.filename}...\n[LLVM O2] Optimizing AST and emitting machine code...`);
    
    setTimeout(() => {
      setIsRunning(false);
      let out = selectedExample.simulatedOutput;
      
      // Dynamic evaluation if user edited print calls
      if (userCode.includes('print(')) {
        const matches = userCode.match(/print\((.*?)\)/g);
        if (matches && matches.length > 0) {
          const lines = matches.map(m => {
            let inner = m.replace('print(', '').replace(/\)$/, '').trim();
            inner = inner.replace(/^["'`]/, '').replace(/["'`]$/, '');
            if (inner === 'greeting') return 'Hello from Rocket';
            if (inner === 'x') return '6';
            if (inner === 'y') return '7';
            return inner;
          });
          out = lines.join('\n') + `\n\n[Process exited with code 0 in ${selectedExample.compileTimeMs}ms]`;
        }
      }

      setSimOutput(out);
    }, 350);
  };

  const handleReset = () => {
    setUserCode(selectedExample.code);
    setSimOutput(selectedExample.simulatedOutput);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([userCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedExample.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lineCount = userCode.split('\n').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 py-4 max-w-5xl mx-auto">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-1">
            <button
              onClick={() => onNavigate('intro')}
              className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <span aria-hidden="true">·</span>
            <span className="text-orange-400 font-semibold">Interactive Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Try Rocket Online
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Full RocketIDE in-browser environment. Edit source, switch files, and execute with live output.
          </p>
        </div>

        <button
          onClick={() => onNavigate('download-ide')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-all shadow-sm shrink-0 self-start sm:self-auto"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Download Desktop App</span>
        </button>
      </div>

      {/* Main Full RocketIDE Window — Exactly matching Overview Studio layout */}
      <div className="rounded-xl border border-neutral-800 bg-[#000000] shadow-2xl overflow-hidden text-left font-sans">
        
        {/* 1. Window Chrome Title Bar */}
        <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-300 select-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-2">
              <img src="/rocket_ide_logo.png" alt="RocketIDE Icon" className="w-4 h-4 object-contain" />
              <span className="font-mono-code text-[11px] text-neutral-300">
                {selectedExample.filename} — RocketIDE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono-code">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Simulator</span>
          </div>
        </div>

        {/* 2. Menu Bar */}
        <div className="px-3 py-1 bg-neutral-900/90 border-b border-neutral-800/80 flex items-center gap-4 text-[11px] text-neutral-400 select-none overflow-x-auto">
          <span className="hover:text-white cursor-pointer">File</span>
          <span className="hover:text-white cursor-pointer">Edit</span>
          <span className="hover:text-white cursor-pointer">Selection</span>
          <span className="hover:text-white cursor-pointer">View</span>
          <span className="hover:text-white cursor-pointer">Navigate</span>
          <span className="hover:text-white cursor-pointer">Build</span>
          <span className="hover:text-white cursor-pointer text-neutral-200 font-semibold" onClick={handleRunInIde}>Run</span>
          <span className="hover:text-white cursor-pointer">Debug</span>
          <span className="hover:text-white cursor-pointer">Tools</span>
          <span className="hover:text-white cursor-pointer">Help</span>
        </div>

        {/* 3. Toolbar Ribbon */}
        <div className="px-3 py-1.5 bg-neutral-900/40 border-b border-neutral-800 flex items-center justify-between gap-4 text-xs select-none">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-[11px] text-neutral-400">New</span>
            <span className="text-[11px] text-neutral-400">Open</span>
            <span className="text-[11px] text-neutral-400">Folder</span>
            <button onClick={handleDownloadCode} className="text-[11px] text-neutral-400 hover:text-white">Save</button>
            <span className="text-neutral-700">|</span>
            
            {/* Run Button with Green Play Icon */}
            <button
              onClick={handleRunInIde}
              disabled={isRunning}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 px-2.5 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded transition-all shadow-xs disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <div className="w-2.5 h-2.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <span>Compiling...</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Run</span>
                </>
              )}
            </button>

            <button
              onClick={handleRunInIde}
              className="text-[11px] text-neutral-300 hover:text-white px-1.5 py-0.5 rounded hover:bg-neutral-800 transition-colors"
            >
              Debug
            </button>
            <span className="text-[11px] text-neutral-500">Pause</span>
            <span className="text-[11px] text-neutral-500">Stop</span>
            <button
              onClick={handleRunInIde}
              className="text-[11px] text-neutral-400 hover:text-white"
            >
              Test
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono-code shrink-0">
            <span className="hidden sm:inline">target: {selectedExample.filename}</span>
            <button
              onClick={handleCopy}
              className="p-1 hover:text-white rounded hover:bg-neutral-800 transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleReset}
              className="p-1 hover:text-white rounded hover:bg-neutral-800 transition-colors"
              title="Reset sample"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4. Main Area: Solution Explorer Left Pane + Editor Center Pane */}
        <div className="grid grid-cols-12 min-h-[420px] bg-[#000000]">
          
          {/* Explorer Left Pane */}
          <div className="col-span-3 border-r border-neutral-800 bg-[#000000] p-3 hidden md:block font-mono-code text-[11px] select-none">
            <div className="text-[10px] uppercase font-bold text-neutral-500 mb-2 flex items-center justify-between">
              <span>EXPLORER</span>
              <span className="text-neutral-600">▾</span>
            </div>
            
            <div className="space-y-1">
              <div className="text-neutral-200 font-semibold flex items-center gap-1.5">
                <span>▾ Rocket</span>
              </div>
              
              <div className="pl-3 space-y-0.5 text-neutral-400">
                <div>▸ compiler</div>
                <div>▸ dependencies</div>
                <div>▸ docs</div>
                
                {/* Examples folder expanded */}
                <div>
                  <div className="text-neutral-300 font-medium">▾ examples</div>
                  <div className="pl-3 space-y-0.5 mt-0.5">
                    {CODE_EXAMPLES.map((ex) => {
                      const isActive = selectedExample.id === ex.id;
                      return (
                        <button
                          key={ex.id}
                          onClick={() => handleSelectExample(ex)}
                          className={`w-full text-left px-1.5 py-0.5 rounded text-[11px] block truncate transition-colors ${
                            isActive
                              ? 'text-orange-400 font-semibold bg-neutral-900 border border-neutral-800'
                              : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                          }`}
                        >
                          {ex.filename}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>▸ src</div>
                <div>▸ stdlib</div>
                <div>▸ tests</div>
                <div className="text-neutral-500">rocket.toml</div>
                <div className="text-neutral-500">README.md</div>
              </div>
            </div>
          </div>

          {/* Editor Center/Right Pane */}
          <div className="col-span-12 md:col-span-9 flex flex-col justify-between bg-[#000000]">
            
            {/* Editor File Tab Strip */}
            <div className="px-2 py-1 bg-neutral-900 border-b border-neutral-800 flex items-center gap-1 overflow-x-auto text-xs font-mono-code select-none">
              {CODE_EXAMPLES.map((ex) => {
                const isActive = selectedExample.id === ex.id;
                return (
                  <button
                    key={ex.id}
                    onClick={() => handleSelectExample(ex)}
                    className={`px-3 py-1 rounded-t flex items-center gap-2 border-t border-x transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-[#000000] text-neutral-100 border-neutral-700 font-medium'
                        : 'bg-neutral-900 text-neutral-400 border-transparent hover:text-neutral-200'
                    }`}
                  >
                    <span>{ex.filename}</span>
                    <span className="text-neutral-600 hover:text-neutral-400 text-[10px]">✕</span>
                  </button>
                );
              })}
            </div>

            {/* Editable Code Area with Line Numbers */}
            <div className="flex-1 bg-[#000000] flex min-h-[300px]">
              
              {/* Line Gutter */}
              <div className="select-none py-3 px-2 text-right font-mono-code text-xs text-neutral-600 bg-[#000000] border-r border-neutral-900 w-10 shrink-0">
                {Array.from({ length: Math.max(lineCount, 12) }).map((_, i) => (
                  <div key={i} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Code Textarea */}
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full py-3 px-3 bg-transparent text-xs sm:text-sm font-mono-code text-neutral-200 focus:outline-none resize-none leading-6 selection:bg-orange-500/30 overflow-y-auto"
                style={{ tabSize: 4 }}
              />
            </div>

            {/* Bottom Dock Panels (PROBLEMS, OUTPUT, DEBUG, TERMINAL) */}
            <div className="border-t border-neutral-800 bg-neutral-900/90">
              
              <div className="px-3 py-1 border-b border-neutral-800 flex items-center gap-4 text-[11px] font-mono-code text-neutral-400 select-none overflow-x-auto">
                <button
                  onClick={() => setActiveBottomTab('problems')}
                  className={`hover:text-white py-0.5 ${activeBottomTab === 'problems' ? 'text-white font-bold border-b-2 border-orange-400' : ''}`}
                >
                  PROBLEMS
                </button>
                <button
                  onClick={() => setActiveBottomTab('output')}
                  className={`hover:text-white py-0.5 ${activeBottomTab === 'output' ? 'text-white font-bold border-b-2 border-orange-400' : ''}`}
                >
                  OUTPUT
                </button>
                <button
                  onClick={() => setActiveBottomTab('debug')}
                  className={`hover:text-white py-0.5 ${activeBottomTab === 'debug' ? 'text-white font-bold border-b-2 border-orange-400' : ''}`}
                >
                  DEBUG
                </button>
                <button
                  onClick={() => setActiveBottomTab('terminal')}
                  className={`hover:text-white py-0.5 ${activeBottomTab === 'terminal' ? 'text-white font-bold border-b-2 border-orange-400' : ''}`}
                >
                  TERMINAL
                </button>
              </div>

              <div className="p-3 text-xs font-mono-code min-h-[90px] text-neutral-200">
                {activeBottomTab === 'problems' && (
                  <div className="text-neutral-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>No problems detected. (rocket-lsp online · 0 errors in {selectedExample.filename})</span>
                  </div>
                )}

                {activeBottomTab === 'output' && (
                  <pre className="text-emerald-400 text-xs leading-relaxed whitespace-pre-wrap font-mono-code">
                    {simOutput || 'Click "Run" in toolbar to compile and execute program.'}
                  </pre>
                )}

                {activeBottomTab === 'debug' && (
                  <div className="text-neutral-400 space-y-1">
                    <div>DbgEng Engine: Microsoft DbgX active.</div>
                    <div className="text-neutral-500">Target: {selectedExample.filename} · CodeView PDB loaded. Breakpoints: 0</div>
                  </div>
                )}

                {activeBottomTab === 'terminal' && (
                  <div className="space-y-1 text-xs">
                    <div className="text-neutral-500">
                      $ rocketc.exe run {selectedExample.filename}
                    </div>
                    <div className="text-emerald-400">
                      {simOutput}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* 5. Bottom Status Bar */}
        <div className="px-3 py-1 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono-code text-neutral-400 overflow-x-auto select-none">
          <div className="flex items-center gap-3 whitespace-nowrap">
            <span className="text-orange-400 font-semibold">Rocket SDK: rocketc</span>
            <span>|</span>
            <span>LSP: online · 274 files</span>
            <span>|</span>
            <span>Target: {selectedExample.filename}</span>
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap">
            <span>Ln {lineCount}, Col 1</span>
            <span>UTF-8</span>
          </div>
        </div>

      </div>

    </div>
  );
};
