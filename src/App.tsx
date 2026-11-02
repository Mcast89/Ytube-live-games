/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { MainHeroLauncher } from './components/MainHeroLauncher';
import { QuickLauncherGrid } from './components/QuickLauncherGrid';
import { GameCategoryShortcuts } from './components/GameCategoryShortcuts';
import { CustomShortcuts } from './components/CustomShortcuts';
import { RecentlyOpened } from './components/RecentlyOpened';
import { QrCodeModal } from './components/QrCodeModal';
import { StreamerGuideSection } from './components/StreamerGuideSection';
import { PRIMARY_YOUTUBE_GAMING_URL } from './data/gamingShortcuts';
import { recordRecentLink } from './utils/recentHistory';
import { ExternalLink, Gamepad2, Check, Radio } from 'lucide-react';

export default function App() {
  const [copied, setCopied] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PRIMARY_YOUTUBE_GAMING_URL);
      setCopied(true);
      showToast('YouTube Live Gaming link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = PRIMARY_YOUTUBE_GAMING_URL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      showToast('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  }, [showToast]);

  const handleOpenPopout = useCallback(() => {
    const width = 1280;
    const height = 720;
    const left = window.screen.width ? (window.screen.width - width) / 2 : 100;
    const top = window.screen.height ? (window.screen.height - height) / 2 : 100;

    recordRecentLink({
      title: 'YouTube Live Gaming (Popout)',
      url: PRIMARY_YOUTUBE_GAMING_URL,
      category: 'Popout Player',
      iconType: 'gaming'
    });
    
    try {
      const popout = window.open(
        PRIMARY_YOUTUBE_GAMING_URL,
        'YouTubeLiveGamingPopout',
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
      );
      if (!popout || popout.closed || typeof popout.closed === 'undefined') {
        window.open(PRIMARY_YOUTUBE_GAMING_URL, '_blank', 'noopener,noreferrer');
      }
      showToast('Opened YouTube Gaming popout window!');
    } catch {
      window.open(PRIMARY_YOUTUBE_GAMING_URL, '_blank', 'noopener,noreferrer');
    }
  }, [showToast]);

  // Global click interception to track any launched YouTube links automatically
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (anchor && anchor.href && (anchor.href.includes('youtube.com') || anchor.href.includes('youtu.be'))) {
        const rawTitle = 
          anchor.getAttribute('data-recent-title') ||
          anchor.getAttribute('title') ||
          anchor.innerText?.replace(/\s+/g, ' ').trim();

        const title = rawTitle && rawTitle.length > 2 && !rawTitle.toLowerCase().includes('http')
          ? rawTitle
          : 'YouTube Stream';

        const category = anchor.getAttribute('data-recent-category') || 'Gaming';
        const iconType = (anchor.getAttribute('data-recent-type') as any) || 'gaming';

        recordRecentLink({
          title,
          url: anchor.href,
          category,
          iconType
        });
      }
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => document.removeEventListener('click', handleDocumentClick, true);
  }, []);

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }
      if (e.key === 'c' || e.key === 'C') {
        handleCopyLink();
      } else if (e.key === 'q' || e.key === 'Q') {
        setIsQrOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCopyLink]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col selection:bg-red-600 selection:text-white font-sans">
      {/* Top Header */}
      <Header 
        onCopyLink={handleCopyLink} 
        copied={copied} 
        onOpenQr={() => setIsQrOpen(true)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* Hero Section */}
        <MainHeroLauncher
          onCopyLink={handleCopyLink}
          copied={copied}
          onOpenPopout={handleOpenPopout}
          onOpenQr={() => setIsQrOpen(true)}
        />

        {/* Recently Opened (Last 5 Destinations) */}
        <RecentlyOpened onCopyLink={showToast} />

        {/* Quick Launch Modalities */}
        <QuickLauncherGrid
          onCopyLink={handleCopyLink}
          copied={copied}
          onOpenPopout={handleOpenPopout}
          onOpenQr={() => setIsQrOpen(true)}
        />

        {/* Top Game Categories Shortcuts */}
        <GameCategoryShortcuts />

        {/* Custom User Gaming Bookmarks */}
        <CustomShortcuts />

        {/* Streamer Tips & Overview */}
        <StreamerGuideSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0a0a0a] py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white/5 border border-white/10 text-red-500 flex items-center justify-center">
              <Gamepad2 className="w-3 h-3" />
            </div>
            <span className="font-bold text-zinc-400 uppercase tracking-wider">YOUTUBE GAMING PROTOCOL</span>
            <span>•</span>
            <span className="text-zinc-500">https://www.youtube.com/gaming/games</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider">
            <button
              onClick={handleCopyLink}
              type="button"
              className="hover:text-zinc-300 transition-colors cursor-pointer"
            >
              COPY LINK (C)
            </button>
            <button
              onClick={() => setIsQrOpen(true)}
              type="button"
              className="hover:text-zinc-300 transition-colors cursor-pointer"
            >
              MOBILE QR (Q)
            </button>
            <a
              href={PRIMARY_YOUTUBE_GAMING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-400 font-bold inline-flex items-center gap-1"
            >
              <span>LAUNCH YOUTUBE</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        onCopyLink={handleCopyLink}
        copied={copied}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs font-bold uppercase tracking-wider shadow-2xl shadow-black/90 animate-in slide-in-from-bottom-5 duration-200">
          <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
