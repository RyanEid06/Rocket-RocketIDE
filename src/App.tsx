import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PageIntro } from './components/PageIntro';
import { PagePlayground } from './components/PagePlayground';
import { PageDownloadIde } from './components/PageDownloadIde';
import { PageDownloadLang } from './components/PageDownloadLang';
import { Footer } from './components/Footer';

export type AppPage = 'intro' | 'try' | 'download-ide' | 'download-lang';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('intro');

  const handleNavigate = (page: AppPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 flex flex-col selection:bg-orange-500/25 selection:text-orange-200 overflow-x-hidden w-full max-w-full">
      
      {/* Background ambient lighting */}
      <div className="fixed inset-0 bg-ambient-radial pointer-events-none -z-10 overflow-hidden" />

      {/* 4-Page Navigation Top Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Main Single Page Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-x-hidden">
        {currentPage === 'intro' && (
          <PageIntro onNavigate={handleNavigate} />
        )}

        {currentPage === 'try' && (
          <PagePlayground onNavigate={handleNavigate} />
        )}

        {currentPage === 'download-ide' && (
          <PageDownloadIde onNavigate={handleNavigate} />
        )}

        {currentPage === 'download-lang' && (
          <PageDownloadLang onNavigate={handleNavigate} />
        )}
      </main>

      {/* Clean Quiet Legal Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
