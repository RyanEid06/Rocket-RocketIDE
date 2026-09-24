import React, { useState } from 'react';
import { RELEASE_ASSETS } from '../data/rocketData';
import { 
  Download, Copy, Check, Terminal, 
  ArrowLeft, ArrowRight, ShieldCheck, Box, Monitor
} from 'lucide-react';
import { AppPage } from '../App';

interface PageDownloadLangProps {
  onNavigate: (page: AppPage) => void;
}

type PlatformFilter = 'all' | 'windows' | 'linux' | 'macos';

export const PageDownloadLang: React.FC<PageDownloadLangProps> = ({ onNavigate }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const toolchainAssets = RELEASE_ASSETS.filter(a => a.type === 'toolchain');
  const filteredAssets = selectedPlatform === 'all'
    ? toolchainAssets
    : toolchainAssets.filter(a => a.platform === selectedPlatform || a.platform === 'cli');

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleCopyCmd = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleInitiateDownload = (asset: typeof toolchainAssets[0]) => {
    setDownloadingId(asset.id);
    setTimeout(() => {
      const dummyData = `# Rocket Language SDK Package: ${asset.filename}\n# Architecture: ${asset.architecture}\n# Checksum: ${asset.sha256}\n\n[Rocket compiler and toolchain payload]`;
      const blob = new Blob([dummyData], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = asset.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadingId(null);
    }, 700);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300 py-4 max-w-4xl mx-auto">
      
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
            <span className="text-orange-400 font-semibold">Language Compiler &amp; Toolchain</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Download Rocket Toolchain
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Production compiler (<code className="text-orange-300 font-mono-code">rocketc</code>), standard libraries, and Language Server Protocol engine.
          </p>
        </div>

        {/* Platform Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-lg self-start sm:self-auto text-xs">
          <button
            onClick={() => setSelectedPlatform('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              selectedPlatform === 'all'
                ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All OS
          </button>
          <button
            onClick={() => setSelectedPlatform('windows')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              selectedPlatform === 'windows'
                ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Windows
          </button>
          <button
            onClick={() => setSelectedPlatform('linux')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              selectedPlatform === 'linux'
                ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Linux
          </button>
          <button
            onClick={() => setSelectedPlatform('macos')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              selectedPlatform === 'macos'
                ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            macOS
          </button>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAssets.map((asset) => {
          const isCopied = copiedHash === asset.id;
          const isDownloading = downloadingId === asset.id;

          return (
            <div
              key={asset.id}
              className={`p-6 rounded-xl border flex flex-col justify-between transition-all ${
                asset.recommended
                  ? 'bg-neutral-900/90 border-neutral-700 shadow-xl'
                  : 'bg-[#000000] border-neutral-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="capitalize font-semibold text-white">
                      {asset.platform === 'cli' ? 'Cross-Platform' : asset.platform}
                    </span>
                    <span className="text-neutral-600">·</span>
                    <span className="text-neutral-400">{asset.architecture}</span>
                  </div>
                  <span className="font-mono-code text-white font-bold">{asset.size}</span>
                </div>

                <h3 className="text-xl font-bold font-display text-white mt-3">
                  {asset.name}
                </h3>

                <p className="mt-2 text-xs text-neutral-300 leading-relaxed min-h-[44px]">
                  {asset.description}
                </p>

                {/* File info and SHA */}
                <div className="mt-4 p-3 bg-neutral-950 border border-neutral-800 rounded-lg space-y-1">
                  <div className="text-[11px] font-mono-code text-neutral-300 truncate">
                    {asset.filename}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono-code text-neutral-500">
                    <span className="truncate">SHA-256: {asset.sha256.slice(0, 20)}...</span>
                    <button
                      onClick={() => handleCopyHash(asset.sha256, asset.id)}
                      className="text-neutral-400 hover:text-white flex items-center gap-1"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Download CTA */}
              <div className="mt-6 pt-4 border-t border-neutral-800">
                <button
                  onClick={() => handleInitiateDownload(asset)}
                  disabled={isDownloading}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold rounded-lg transition-all ${
                    asset.recommended
                      ? 'bg-white hover:bg-neutral-200 text-neutral-950 shadow-md'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                      <span>Starting Download...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download {asset.filename}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CLI Quickstart Commands */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-orange-400" />
          <span>rocketc Command Reference</span>
        </h3>

        <div className="space-y-3 font-mono-code text-xs">
          {[
            { label: 'Run Source File Directly', cmd: 'rocketc run hello.rocket' },
            { label: 'Build Native Binary with Debug Symbols', cmd: 'rocketc build hello.rocket --debug' },
            { label: 'Create New Package Project', cmd: 'rocketc new my-project' },
            { label: 'Run Automated Unit Tests', cmd: 'rocketc test my-project' },
            { label: 'Emit LLVM Intermediate Representation', cmd: 'rocketc emit-ir hello.rocket' }
          ].map((item, i) => (
            <div key={i} className="p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-lg flex items-center justify-between gap-3">
              <div className="overflow-hidden">
                <div className="text-[10px] text-neutral-500 uppercase font-sans font-semibold mb-0.5">{item.label}</div>
                <div className="text-orange-300 truncate">{item.cmd}</div>
              </div>
              <button
                onClick={() => handleCopyCmd(item.cmd, `cmd-${i}`)}
                className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors shrink-0"
              >
                {copiedCmd === `cmd-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Switch to IDE page */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-800 text-xs text-neutral-400">
        <span>Looking for the visual desktop IDE?</span>
        <button
          onClick={() => onNavigate('download-ide')}
          className="text-white hover:text-neutral-300 flex items-center gap-1 font-semibold transition-colors"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Download RocketIDE</span>
        </button>
      </div>

    </div>
  );
};
