import React, { useState, useRef, useEffect } from 'react';
import { Gamepad2, Radio, Film, ExternalLink, Copy, Check, Search, X, Flame } from 'lucide-react';
import { 
  PRIMARY_YOUTUBE_GAMING_URL, 
  YOUTUBE_LIVE_VIDEOS_URL, 
  YOUTUBE_SHORTS_URL 
} from '../data/gamingShortcuts';

import { recordRecentLink } from '../utils/recentHistory';

interface HeaderProps {
  onCopyLink: () => void;
  copied: boolean;
  onOpenQr: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCopyLink, copied, onOpenQr }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [liveOnly, setLiveOnly] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener to focus search on '/' or 'Cmd/Ctrl+K'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement as HTMLElement)?.tagName?.toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea';

      if ((e.key === '/' && !isInputActive) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    let targetUrl: string;
    let title = `Search: ${query}`;

    // Direct channel handle shortcut e.g. "@tarik"
    if (query.startsWith('@')) {
      targetUrl = `https://www.youtube.com/${query}${liveOnly ? '/live' : ''}`;
      title = `Channel: ${query}`;
    } else {
      // YouTube search query URL format
      // Live filter param: sp=CAM%253D (URL-encoded sp=CAM= for live streams)
      const encodedQuery = encodeURIComponent(query);
      if (liveOnly) {
        targetUrl = `https://www.youtube.com/results?search_query=${encodedQuery}&sp=CAM%253D`;
      } else {
        targetUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`;
      }
    }

    recordRecentLink({
      title,
      url: targetUrl,
      category: 'Search',
      iconType: 'search'
    });

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    const encoded = encodeURIComponent(suggestion);
    const url = liveOnly
      ? `https://www.youtube.com/results?search_query=${encoded}&sp=CAM%253D`
      : `https://www.youtube.com/results?search_query=${encoded}`;

    recordRecentLink({
      title: `Search: ${suggestion}`,
      url,
      category: 'Search',
      iconType: 'search'
    });

    window.open(url, '_blank', 'noopener,noreferrer');
    setIsFocused(false);
  };

  return (
    <header className="w-full border-b border-white/10 bg-gradient-to-r from-zinc-950 via-[#0a0a0a] to-zinc-950 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 px-2 py-0.5 rounded text-[10px] font-black tracking-tighter text-white uppercase flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              LIVE
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-tight uppercase text-white flex items-center gap-2">
                YouTube Live
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase hidden sm:inline">
                GAMING LAUNCHER
              </span>
            </div>
          </div>

          {/* Quick Direct Target Nav */}
          <nav className="hidden xl:flex items-center gap-1 pl-3 border-l border-white/10 text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
            <a 
              href={PRIMARY_YOUTUBE_GAMING_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-2 py-1 rounded hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Gamepad2 className="w-3 h-3 text-red-500" />
              <span>Gaming</span>
            </a>
            <a 
              href={YOUTUBE_LIVE_VIDEOS_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-2 py-1 rounded hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Radio className="w-3 h-3 text-red-500" />
              <span>Live</span>
            </a>
            <a 
              href={YOUTUBE_SHORTS_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-2 py-1 rounded hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Film className="w-3 h-3 text-rose-500" />
              <span>Shorts</span>
            </a>
          </nav>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-lg mx-1 sm:mx-3">
          <form 
            onSubmit={handleSearchSubmit}
            className={`relative flex items-center rounded-lg bg-zinc-950/90 border transition-all ${
              isFocused 
                ? 'border-red-500/80 ring-2 ring-red-500/20 shadow-lg shadow-black/80' 
                : 'border-white/15 hover:border-white/25'
            }`}
          >
            <div className="pl-3 pr-2 text-zinc-500">
              <Search className="w-4 h-4 text-zinc-400" />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              id="header-global-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                // slight timeout to permit clicking suggestions
                setTimeout(() => setIsFocused(false), 200);
              }}
              placeholder="Search channel or game on YouTube..."
              className="w-full py-2 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-zinc-500 hover:text-zinc-200 cursor-pointer"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Live Filter Toggle Pill */}
            <button
              type="button"
              onClick={() => setLiveOnly(!liveOnly)}
              title={liveOnly ? 'Filtering: Live streams only (sp=CAM%253D)' : 'Filtering: All YouTube results'}
              className={`mr-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                liveOnly 
                  ? 'bg-red-600/20 border-red-500/50 text-red-400' 
                  : 'bg-white/5 border-white/10 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {liveOnly ? 'LIVE' : 'ALL'}
            </button>

            {/* Submit Icon Button */}
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              title="Search on YouTube"
              className={`p-2 mr-1 rounded-md text-xs font-bold uppercase transition-colors ${
                searchQuery.trim()
                  ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer shadow-sm'
                  : 'text-zinc-600 cursor-not-allowed'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Search Dropdown Suggestions on Focus */}
          {isFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 rounded-xl bg-zinc-950 border border-white/15 shadow-2xl z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500 pb-2 border-b border-white/5">
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-500" />
                  Popular Live Gaming Searches
                </span>
                <span className="font-mono text-zinc-600">Press ENTER to Search</span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {[
                  'VALORANT Live',
                  'GTA V RP Live',
                  'Apex Legends Live',
                  'Minecraft Live',
                  'League of Legends Live',
                  'Counter-Strike 2 Major',
                  'Nintendo Direct',
                  '@tarik',
                  '@shroud'
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onMouseDown={() => handleQuickSuggestion(item)}
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-red-600/20 hover:text-red-400 border border-white/5 hover:border-red-500/30 text-zinc-300 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-2.5 pt-2 border-t border-white/5 text-[10px] font-mono text-zinc-500 flex items-center justify-between">
                <span>Format: results?search_query={'{query}'}&sp=CAM%253D</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] bg-white/5 border border-white/10 rounded">
                  / to focus
                </kbd>
              </div>
            </div>
          )}
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          <button
            id="header-copy-link-btn"
            onClick={onCopyLink}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold tracking-wider uppercase bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            title="Copy YouTube Gaming link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 hidden sm:inline">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">COPY</span>
              </>
            )}
          </button>

          <button
            id="header-qr-btn"
            onClick={onOpenQr}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold tracking-wider uppercase bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            title="Scan QR on mobile"
          >
            <span className="hidden sm:inline">QR CODE</span>
            <span className="sm:hidden">QR</span>
          </button>

          <a
            id="header-launch-direct-btn"
            href={PRIMARY_YOUTUBE_GAMING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-bold tracking-wider uppercase bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <span>LAUNCH</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};
