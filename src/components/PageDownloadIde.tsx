import React, { useState } from 'react';
import { RELEASE_ASSETS, getDownloadUrl, GITHUB_RELEASES_URL } from '../data/rocketData';
import { 
  Download, Copy, Check, ShieldCheck, Monitor, 
  ArrowLeft, ArrowRight, Terminal, Laptop, ExternalLink
} from 'lucide-react';
import { AppPage } from '../App';

interface PageDownloadIdeProps {
  onNavigate: (page: AppPage) => void;
}

type PlatformFilter = 'all' | 'windows' | 'linux' | 'macos';

export const PageDownloadIde: React.FC<PageDownloadIdeProps> = ({ onNavigate }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const ideAssets = RELEASE_ASSETS.filter(a => a.id.startsWith('ide'));
  const filteredAssets = selectedPlatform === 'all'
    ? ideAssets
    : ideAssets.filter(a => a.platform === selectedPlatform);

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleInitiateDownload = (asset: typeof ideAssets[0]) => {
    setDownloadingId(asset.id);
    const directUrl = getDownloadUrl(asset.filename);

    // Direct browser navigation to start the genuine binary download from GitHub Releases
    const a = document.createElement('a');
    a.href = directUrl;
    a.setAttribute('download', asset.filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

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
            Official developer environment for Windows, Linux, and macOS.
          </p>
        </div>

        {/* Platform Selector Tabs */}
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
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              selectedPlatform === 'windows'
                ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>Windows</span>
          </button>
          <button
            onClick={() => setSelectedPlatform('linux')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              selectedPlatform === 'linux'
                ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>Linux</span>
          </button>
          <button
            onClick={() => setSelectedPlatform('macos')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              selectedPlatform === 'macos'
                ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>macOS</span>
          </button>
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

      {/* Operating System Compatibility Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg">
          <div className="text-neutral-500 uppercase text-[10px] font-bold">WINDOWS</div>
          <div className="text-white font-semibold mt-1">Windows 10 / 11 (x64)</div>
          <div className="text-neutral-400 text-[11px] mt-1">WPF Native + DbgEng</div>
        </div>
        <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg">
          <div className="text-neutral-500 uppercase text-[10px] font-bold">LINUX</div>
          <div className="text-white font-semibold mt-1">Ubuntu / Fedora / Arch (x64)</div>
          <div className="text-neutral-400 text-[11px] mt-1">AppImage &amp; GDB Engine</div>
        </div>
        <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg">
          <div className="text-neutral-500 uppercase text-[10px] font-bold">MACOS</div>
          <div className="text-white font-semibold mt-1">macOS 12+ (Universal)</div>
          <div className="text-neutral-400 text-[11px] mt-1">Apple Silicon M1-M4 &amp; Intel</div>
        </div>
      </div>

      {/* Quick Launch Guide */}
      <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2 text-xs">
        <div className="text-neutral-400 font-semibold flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-orange-400" />
          <span>Quick Install via Terminal:</span>
        </div>
        <div className="font-mono-code text-[11px] text-neutral-300 bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
          <div><span className="text-neutral-500"># Linux:</span> chmod +x RocketIDE-x86_64.AppImage &amp;&amp; ./RocketIDE-x86_64.AppImage</div>
          <div className="mt-1"><span className="text-neutral-500"># macOS:</span> hdiutil attach RocketIDE-Universal.dmg &amp;&amp; cp -R /Volumes/RocketIDE/RocketIDE.app /Applications</div>
        </div>
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
