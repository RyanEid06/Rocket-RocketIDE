import React, { useState } from 'react';
import { AppPage } from '../App';
import { ShieldCheck, FileText, X } from 'lucide-react';
import logoImg from '../assets/images/rocket_ide_logo.png';

interface FooterProps {
  onNavigate: (page: AppPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [legalModalOpen, setLegalModalOpen] = useState<'license' | 'terms' | 'privacy' | null>(null);

  return (
    <footer className="border-t border-neutral-800/80 bg-[#000000] py-12 text-neutral-400 text-xs mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-neutral-800">
          
          <button
            onClick={() => onNavigate('intro')}
            className="flex items-center gap-3 text-left group"
          >
            <img
              src={logoImg}
              alt="RocketIDE Official Logo"
              className="w-6 h-6 object-contain"
            />
            <span className="font-display text-sm font-bold text-white tracking-tight group-hover:text-neutral-200 transition-colors">
              Rocket &amp; RocketIDE
            </span>
          </button>

          <div className="flex flex-wrap items-center gap-6 text-neutral-400">
            <button
              onClick={() => onNavigate('intro')}
              className="hover:text-white transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('try')}
              className="hover:text-white transition-colors"
            >
              Try Online
            </button>
            <button
              onClick={() => onNavigate('download-ide')}
              className="hover:text-white transition-colors"
            >
              RocketIDE Studio
            </button>
            <button
              onClick={() => onNavigate('download-lang')}
              className="hover:text-white transition-colors"
            >
              Language Toolchain
            </button>
            <span className="text-neutral-700">|</span>
            <button
              onClick={() => setLegalModalOpen('license')}
              className="hover:text-white transition-colors"
            >
              Software License
            </button>
            <button
              onClick={() => setLegalModalOpen('privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy Notice
            </button>
          </div>

        </div>

        {/* Legal Notices and Disclaimers */}
        <div className="pt-8 space-y-4 text-[11px] text-neutral-500 leading-relaxed">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              &copy; 2026 Rocket &amp; RocketIDE Project Contributors. All rights reserved.
            </div>
            <div className="flex items-center gap-3 text-neutral-400">
              <button onClick={() => setLegalModalOpen('license')} className="hover:underline">MIT / Apache 2.0</button>
              <span>·</span>
              <button onClick={() => setLegalModalOpen('terms')} className="hover:underline">Terms of Service</button>
            </div>
          </div>

          <p className="max-w-4xl text-[10px] text-neutral-600">
            THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
          </p>
        </div>

      </div>

      {/* Interactive Legal Modal */}
      {legalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-xl p-6 text-neutral-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <FileText className="w-4 h-4 text-orange-400" />
                <span>
                  {legalModalOpen === 'license' && 'Open Source Software License'}
                  {legalModalOpen === 'privacy' && 'Privacy & Telemetry Policy'}
                  {legalModalOpen === 'terms' && 'Terms of Use'}
                </span>
              </div>
              <button
                onClick={() => setLegalModalOpen(null)}
                className="text-neutral-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 text-xs font-mono-code leading-relaxed text-neutral-400 max-h-72 overflow-y-auto space-y-3">
              {legalModalOpen === 'license' && (
                <>
                  <p>
                    Rocket Language and RocketIDE are licensed under the MIT License and Apache License, Version 2.0.
                  </p>
                  <p>
                    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.
                  </p>
                </>
              )}
              {legalModalOpen === 'privacy' && (
                <>
                  <p>
                    Rocket and RocketIDE respect user sovereignty. No telemetry, background usage metrics, or keystroke tracking are collected or transmitted by default.
                  </p>
                  <p>
                    Source code analyzed by RocketIDE and rocket-lsp remains 100% local to your machine.
                  </p>
                </>
              )}
              {legalModalOpen === 'terms' && (
                <>
                  <p>
                    By downloading or compiling Rocket or RocketIDE, you agree that you are solely responsible for ensuring the code you produce complies with applicable laws and specifications.
                  </p>
                </>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setLegalModalOpen(null)}
                className="px-4 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
};
