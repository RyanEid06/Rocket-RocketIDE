import React, { useState } from 'react';
import { Download, Menu, X, Play, Monitor, Terminal } from 'lucide-react';
import { AppPage } from '../App';

interface NavbarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pages: { id: AppPage; label: string }[] = [
    { id: 'intro', label: 'Overview' },
    { id: 'try', label: 'Try Rocket' },
    { id: 'download-ide', label: 'RocketIDE' },
    { id: 'download-lang', label: 'Rocket Language' }
  ];

  const handleNav = (page: AppPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#000000]/95 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Lockup with Official RocketIDE Icon */}
        <button
          onClick={() => handleNav('intro')}
          className="flex items-center gap-3 text-left group"
        >
          <img
            src="/rocket_ide_logo.png"
            alt="RocketIDE Official Logo"
            className="w-7 h-7 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
          />
          <span className="font-display text-lg font-bold tracking-tight text-white group-hover:text-neutral-200 transition-colors">
            Rocket
          </span>
        </button>

        {/* 4 Clean Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-900/50 p-1 rounded-xl border border-neutral-800/60">
          {pages.map((p) => {
            const isActive = currentPage === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleNav(p.id)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </nav>

        {/* Primary Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleNav('download-ide')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-all shadow-sm hover:shadow-white/10"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download IDE</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-[#000000] px-4 pt-2 pb-5 space-y-2">
          {pages.map((p) => (
            <button
              key={p.id}
              onClick={() => handleNav(p.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === p.id
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-300 hover:bg-neutral-900/60'
              }`}
            >
              {p.label}
            </button>
          ))}
          <div className="pt-2 border-t border-neutral-800">
            <button
              onClick={() => handleNav('download-ide')}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-neutral-950 bg-white rounded-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download RocketIDE</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
