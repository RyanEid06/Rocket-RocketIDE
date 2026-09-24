import React from 'react';

export const RealIdeScreenshot: React.FC = () => {
  return (
    <div className="rounded-xl border border-neutral-800 bg-[#000000] overflow-hidden shadow-2xl font-sans text-xs select-none">
      
      {/* 1. Real Window Title Bar */}
      <div className="bg-[#18181b] px-3 py-1.5 flex items-center justify-between border-b border-neutral-800 text-neutral-300">
        <div className="flex items-center gap-2">
          <img src="/rocket_ide_logo.png" alt="RocketIDE Icon" className="w-4 h-4 object-contain" />
          <span className="font-mono-code text-[11px] text-neutral-200">test.rocket — RocketIDE</span>
        </div>
        <div className="flex items-center gap-3 text-neutral-400 text-xs">
          <span className="hover:text-white cursor-pointer">─</span>
          <span className="hover:text-white cursor-pointer">□</span>
          <span className="hover:text-red-400 cursor-pointer">✕</span>
        </div>
      </div>

      {/* 2. Menu Bar */}
      <div className="bg-[#1f1f23] px-3 py-1 flex items-center gap-4 text-[11px] text-neutral-300 border-b border-neutral-800 overflow-x-auto">
        <span className="hover:text-white cursor-pointer">File</span>
        <span className="hover:text-white cursor-pointer">Edit</span>
        <span className="hover:text-white cursor-pointer">Selection</span>
        <span className="hover:text-white cursor-pointer">View</span>
        <span className="hover:text-white cursor-pointer">Navigate</span>
        <span className="hover:text-white cursor-pointer">Build</span>
        <span className="hover:text-white cursor-pointer">Run</span>
        <span className="hover:text-white cursor-pointer">Debug</span>
        <span className="hover:text-white cursor-pointer">Tools</span>
        <span className="hover:text-white cursor-pointer">Help</span>
      </div>

      {/* 3. Toolbar / Command Ribbon */}
      <div className="bg-[#141416] px-3 py-1.5 flex items-center gap-3 text-[11px] text-neutral-300 border-b border-neutral-800 overflow-x-auto">
        <span className="hover:text-white cursor-pointer">New</span>
        <span className="hover:text-white cursor-pointer">Open</span>
        <span className="hover:text-white cursor-pointer">Folder</span>
        <span className="hover:text-white cursor-pointer">Save</span>
        <span className="text-neutral-700">|</span>
        <span className="hover:text-white cursor-pointer">Build</span>
        <span className="hover:text-white cursor-pointer text-emerald-400 font-semibold">Run</span>
        <span className="hover:text-white cursor-pointer">Debug</span>
        <span className="text-neutral-600">Pause</span>
        <span className="text-neutral-600">Stop Debug</span>
        <span className="text-neutral-600">Stop</span>
        <span className="hover:text-white cursor-pointer">Test</span>
      </div>

      {/* 4. Main Split: Explorer Left Pane + Editor Center Pane */}
      <div className="grid grid-cols-12 min-h-[360px] bg-[#0c0c0e]">
        
        {/* Explorer Left Pane */}
        <div className="col-span-3 border-r border-neutral-800 p-2.5 font-mono-code text-[11px] text-neutral-400 overflow-y-auto hidden sm:block bg-[#09090b]">
          <div className="flex items-center justify-between text-[10px] text-neutral-500 font-bold mb-2">
            <span>EXPLORER</span>
            <span className="cursor-pointer hover:text-white">↻</span>
          </div>
          <div className="space-y-0.5">
            <div className="text-neutral-200 font-semibold">▾ Rocket</div>
            <div className="pl-3 space-y-0.5 text-neutral-400">
              <div>▸ .github</div>
              <div>▸ .superpowers</div>
              <div>▸ .vscode</div>
              <div>▸ Blackjack-v1</div>
              <div>▸ compiler</div>
              <div>▸ dependencies</div>
              <div>▸ docs</div>
              <div>▸ editors</div>
              <div>▸ examples</div>
              <div>▸ experiments</div>
              <div>▸ scripts</div>
              <div>▸ src</div>
              <div>▸ stdlib</div>
              <div>▸ tests</div>
              <div className="text-neutral-500">.gitattributes</div>
              <div className="text-neutral-500">.gitignore</div>
              <div>AGENTS.md</div>
              <div>CMakeLists.txt</div>
              <div>CMakePresets.json</div>
              <div>CONTRIBUTING.md</div>
              <div>README.md</div>
              <div>SECURITY.md</div>
            </div>
          </div>
        </div>

        {/* Editor Center Pane */}
        <div className="col-span-12 sm:col-span-9 flex flex-col justify-between bg-[#0e0e11]">
          
          {/* Editor Tab Strip */}
          <div className="bg-[#141417] px-3 py-1 border-b border-neutral-800 flex items-center gap-2 text-xs font-mono-code">
            <span className="text-neutral-100 bg-[#0e0e11] px-2.5 py-0.5 rounded-t border-t border-x border-neutral-700">
              test.rocket <span className="text-neutral-500 ml-1 text-[10px]">✕</span>
            </span>
          </div>

          {/* Actual Code Display */}
          <div className="p-4 font-mono-code text-xs sm:text-sm text-neutral-200 leading-relaxed overflow-x-auto">
            <div className="flex gap-4">
              <div className="select-none text-neutral-600 text-right w-5">
                1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9<br/>10
              </div>
              <div className="space-y-0.5">
                <div><span className="text-purple-400 font-semibold">fn</span> <span className="text-blue-400 font-semibold">main</span>() -&gt; <span className="text-emerald-400">Int</span>:</div>
                <div className="pl-5"><span className="text-purple-400">let</span> greeting = <span className="text-amber-300">&quot;Hello from Rocket&quot;</span></div>
                <div className="pl-5"><span className="text-blue-300">print</span>(greeting)</div>
                <div className="pl-5"><span className="text-purple-400">let</span> x=<span className="text-amber-400">6</span></div>
                <div className="pl-5"><span className="text-purple-400">let</span> y=<span className="text-amber-400">7</span></div>
                <div className="pl-5"><span className="text-blue-300">print</span>(x)</div>
                <div className="pl-5"><span className="text-blue-300">print</span>(y)</div>
                <div className="pl-5"><span className="text-purple-400">return</span> <span className="text-amber-400">0</span></div>
              </div>
            </div>
          </div>

          {/* Bottom Diagnostics Strip */}
          <div className="border-t border-neutral-800 bg-[#121215]">
            <div className="px-3 py-1 border-b border-neutral-800 flex items-center gap-4 text-[11px] font-mono-code text-neutral-400 overflow-x-auto">
              <span className="text-white font-bold border-b-2 border-orange-400 pb-0.5">PROBLEMS</span>
              <span className="hover:text-white cursor-pointer">REFERENCES (0)</span>
              <span className="hover:text-white cursor-pointer">OUTPUT</span>
              <span className="hover:text-white cursor-pointer">TESTS</span>
              <span className="hover:text-white cursor-pointer">SEARCH</span>
              <span className="hover:text-white cursor-pointer">DEBUG</span>
            </div>

            <div className="px-3 py-1.5 flex items-center gap-4 text-[10px] text-neutral-400 border-b border-neutral-800/60 bg-[#0e0e11]">
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="accent-orange-500" /> Errors</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="accent-orange-500" /> Warnings</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="accent-orange-500" /> Info</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="accent-orange-500" /> Hints</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="accent-orange-500" /> Group by file</label>
            </div>

            <div className="px-3 py-2 text-[11px] font-mono-code text-neutral-400 min-h-[44px]">
              No problems detected.
            </div>
          </div>

        </div>

      </div>

      {/* 5. Real Status Bar */}
      <div className="bg-[#18181c] px-3 py-1 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono-code text-neutral-400 overflow-x-auto">
        <div className="flex items-center gap-3 whitespace-nowrap">
          <span className="text-orange-400 font-semibold">Rocket SDK: rocketc 2.1.0</span>
          <span>|</span>
          <span>LSP: online · 274 files · 2020 ms</span>
          <span>|</span>
          <span>Target: test.rocket (standalone)</span>
        </div>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <span>Ln 1, Col 1</span>
          <span>UTF-8</span>
        </div>
      </div>

    </div>
  );
};
