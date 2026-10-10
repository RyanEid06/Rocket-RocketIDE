import React, { useState } from 'react';
import { RELEASE_ASSETS, getDownloadUrl, GITHUB_RELEASES_URL } from '../data/rocketData';
import { 
  Download, Copy, Check, ArrowLeft, ArrowRight, ExternalLink
} from 'lucide-react';
import { AppPage } from '../App';

interface PageDownloadIdeProps {
  onNavigate: (page: AppPage) => void;
}
export const PageDownloadIde: React.FC<PageDownloadIdeProps> = ({ onNavigate }) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const ideAssets = RELEASE_ASSETS.filter(a => a.id.startsWith('ide'));
  const filteredAssets = ideAssets;

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleInitiateDownload = (asset: typeof ideAssets[0]) => {
    setDownloadingId(asset.id);
    // The anchor performs the download; this handler only shows feedback.

    setTimeout(() => {
      setDownloadingId(null);
    }, 1500);
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
            <span className="text-orange-400 font-semibold">Desktop Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Download RocketIDE
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            RocketIDE 1.0.0 for Windows x64. The installer and Portable ZIP include the .NET runtime and native debugger.
          </p>
        </div>

      </div>

      {/* Main Download Options Grid */}
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
                      {asset.platform}
                    </span>
                    <span className="text-neutral-600">·</span>
                    <span className="text-neutral-400">
                      {asset.type === 'installer' ? 'Installer' : 'Portable Archive'}
                    </span>
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
              <div className="mt-6 pt-4 border-t border-neutral-800 space-y-2">
                <a
                  href={getDownloadUrl(asset.filename)}
                  download={asset.filename}
                  onClick={() => handleInitiateDownload(asset)}
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
                </a>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1">
                  <span>Fast direct CDN from GitHub</span>
                  <a
                    href={GITHUB_RELEASES_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-400 hover:text-orange-400 flex items-center gap-1 transition-colors"
                  >
                    <span>View Releases</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3 text-sm text-neutral-300">
        <p>Run the Windows installer for a guided per-user setup, or choose the Portable ZIP to extract and open <code>RocketIDE.exe</code>. Keep every file in the portable folder together.</p>
        <p>The Rocket SDK is separate. Extract its complete archive, including <code>stage0</code>, then select <code>bin/rocketc.exe</code> and <code>bin/rocket-lsp.exe</code> in Tools &gt; Rocket SDK Settings.</p>
        <p>Reinstalling the app preserves your settings under <code>%LOCALAPPDATA%\RocketIDE</code>. If you move or replace the SDK, select its new tool paths again.</p>
        <p>RocketIDE uses Windows WPF. Linux and macOS users can download the Rocket language SDK below and use their preferred editor.</p>
      </div>

      {/* Next steps link */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-800 text-xs text-neutral-400">
        <span>Need the command-line compiler too?</span>
        <button
          onClick={() => onNavigate('download-lang')}
          className="text-white hover:text-neutral-300 flex items-center gap-1 font-semibold transition-colors"
        >
          <span>Download Rocket Language SDK</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
