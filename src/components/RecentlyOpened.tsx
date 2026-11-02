import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ExternalLink, 
  Trash2, 
  Copy, 
  Check, 
  Gamepad2, 
  Radio, 
  Film, 
  Search, 
  Tv, 
  RotateCcw,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { RecentHistoryItem } from '../types';
import { 
  getRecentLinks, 
  removeRecentLink, 
  clearRecentLinks, 
  formatTimeAgo,
  recordRecentLink,
  MAX_RECENT_ITEMS
} from '../utils/recentHistory';
import { PRIMARY_YOUTUBE_GAMING_URL, YOUTUBE_SHORTS_URL } from '../data/gamingShortcuts';

interface RecentlyOpenedProps {
  onCopyLink?: (text: string) => void;
}

export const RecentlyOpened: React.FC<RecentlyOpenedProps> = ({ onCopyLink }) => {
  const [recentItems, setRecentItems] = useState<RecentHistoryItem[]>(() => getRecentLinks());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Sync on local custom event and multi-tab changes
  useEffect(() => {
    const handleUpdate = () => {
      setRecentItems(getRecentLinks());
    };

    window.addEventListener('recent-links-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Periodic tick to refresh "time ago" string every minute
    const interval = setInterval(() => {
      setRecentItems([...getRecentLinks()]);
    }, 60000);

    return () => {
      window.removeEventListener('recent-links-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleCopy = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      if (onCopyLink) onCopyLink('Link copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedId(id);
      if (onCopyLink) onCopyLink('Link copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleRemove = (id: string) => {
    const updated = removeRecentLink(id);
    setRecentItems(updated);
  };

  const handleClear = () => {
    clearRecentLinks();
    setRecentItems([]);
    setShowClearConfirm(false);
  };

  const handleLaunchSample = (title: string, url: string, category: string, iconType: any) => {
    recordRecentLink({ title, url, category, iconType });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case 'shorts':
        return <Film className="w-3.5 h-3.5 text-rose-500" />;
      case 'live':
        return <Radio className="w-3.5 h-3.5 text-red-500" />;
      case 'search':
        return <Search className="w-3.5 h-3.5 text-amber-500" />;
      case 'channel':
        return <Tv className="w-3.5 h-3.5 text-blue-400" />;
      case 'gaming':
      case 'game':
      default:
        return <Gamepad2 className="w-3.5 h-3.5 text-red-500" />;
    }
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Clock className="w-3 h-3" />
              <span>SESSION ACTIVITY</span>
            </div>
            <span className="text-zinc-500 text-xs">•</span>
            <span className="text-[11px] font-mono text-zinc-400">
              TRACKING LAST {MAX_RECENT_ITEMS} DESTINATIONS
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-white flex items-center gap-2.5">
            Recently Opened
          </h2>
        </div>

        {recentItems.length > 0 && (
          <div className="flex items-center gap-2">
            {showClearConfirm ? (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-red-950/70 border border-red-500/30 text-xs">
                <span className="text-red-300 font-bold text-[10px]">CLEAR ALL 5?</span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-red-400 hover:text-white font-bold text-[10px] underline cursor-pointer"
                >
                  YES
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="text-zinc-400 hover:text-white text-[10px] cursor-pointer ml-1"
                >
                  CANCEL
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="clear-recent-history-btn"
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-red-400 hover:bg-white/5 border border-white/5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>CLEAR RECENT</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid of Last 5 Opened Items */}
      {recentItems.length === 0 ? (
        <div className="p-6 sm:p-8 rounded-xl border border-dashed border-white/10 bg-zinc-950/40 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-zinc-500 flex items-center justify-center mx-auto">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              No Streams Opened Yet
            </h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Any stream, creator channel, game directory, or search query you open will automatically be pinned here for rapid re-launch.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleLaunchSample('YouTube Live Gaming', PRIMARY_YOUTUBE_GAMING_URL, 'Gaming Hub', 'gaming')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-red-500" />
              <span>Open Gaming Directory</span>
            </button>
            <button
              type="button"
              onClick={() => handleLaunchSample('YouTube Shorts Gaming', YOUTUBE_SHORTS_URL, 'Shorts Feed', 'shorts')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <Film className="w-3.5 h-3.5 text-rose-500" />
              <span>Open Shorts Feed</span>
            </button>
            <button
              type="button"
              onClick={() => handleLaunchSample('LCK Global Live', 'https://www.youtube.com/@LCKglobal/live', 'Esports', 'live')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-red-500" />
              <span>Open LCK Esports</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {recentItems.map((item, index) => {
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between p-4 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-white/10 hover:border-red-500/40 transition-all shadow-md hover:shadow-xl"
              >
                <div>
                  {/* Item top metadata row */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-zinc-500">
                        #{index + 1}
                      </span>
                      <div className="p-1 rounded bg-white/5 border border-white/10">
                        {getIcon(item.iconType)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, item.url)}
                        title="Copy link"
                        className="p-1 rounded text-zinc-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        {isCopied ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        title="Remove from history"
                        className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-xs uppercase tracking-tight text-white group-hover:text-red-400 transition-colors line-clamp-2 mb-1.5">
                    {item.title}
                  </h3>

                  {/* Category and time ago */}
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono mb-3">
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 uppercase">
                      {item.category}
                    </span>
                    <span>•</span>
                    <span>{formatTimeAgo(item.timestamp)}</span>
                  </div>
                </div>

                {/* Direct Launch link */}
                <a
                  id={`recent-link-${item.id}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    // Update timestamp to now when clicked again
                    recordRecentLink({
                      title: item.title,
                      url: item.url,
                      category: item.category,
                      iconType: item.iconType
                    });
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-red-600/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm group-hover:shadow-md"
                >
                  <span>RE-LAUNCH</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
