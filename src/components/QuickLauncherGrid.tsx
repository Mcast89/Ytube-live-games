import React from 'react';
import { 
  Gamepad2, 
  Tv, 
  Radio, 
  ExternalLink, 
  Copy, 
  Check, 
  QrCode, 
  Compass, 
  Monitor,
  Flame,
  Film,
  Sparkles
} from 'lucide-react';
import { 
  PRIMARY_YOUTUBE_GAMING_URL, 
  YOUTUBE_GAMING_HOME_URL, 
  YOUTUBE_LIVE_VIDEOS_URL,
  YOUTUBE_SHORTS_URL,
  YOUTUBE_GAMING_SHORTS_URL
} from '../data/gamingShortcuts';

interface QuickLauncherGridProps {
  onCopyLink: () => void;
  copied: boolean;
  onOpenPopout: () => void;
  onOpenQr: () => void;
}

export const QuickLauncherGrid: React.FC<QuickLauncherGridProps> = ({
  onCopyLink,
  copied,
  onOpenPopout,
  onOpenQr
}) => {
  const launcherCards = [
    {
      id: 'quick-direct-games',
      title: 'YouTube Live Games',
      subtitle: 'Direct /gaming/games portal',
      url: PRIMARY_YOUTUBE_GAMING_URL,
      badge: 'PRIMARY TARGET',
      badgeColor: 'bg-red-600/20 text-red-400 border-red-500/30',
      icon: Gamepad2,
      iconColor: 'text-red-500',
      actionType: 'link'
    },
    {
      id: 'quick-live-videos',
      title: 'YouTube Live Videos',
      subtitle: 'Global live streams across all topics',
      url: YOUTUBE_LIVE_VIDEOS_URL,
      badge: 'GLOBAL LIVE',
      badgeColor: 'bg-red-600/20 text-red-400 border-red-500/30',
      icon: Radio,
      iconColor: 'text-red-500',
      actionType: 'link'
    },
    {
      id: 'quick-shorts-feed',
      title: 'YouTube Shorts',
      subtitle: 'Infinite vertical video feed & clips',
      url: YOUTUBE_SHORTS_URL,
      badge: 'VERTICAL FEED',
      badgeColor: 'bg-rose-600/20 text-rose-400 border-rose-500/30',
      icon: Film,
      iconColor: 'text-rose-500',
      actionType: 'link'
    },
    {
      id: 'quick-gaming-shorts',
      title: 'Gaming Shorts Hub',
      subtitle: 'Top clutches, speedruns & meme reels',
      url: YOUTUBE_GAMING_SHORTS_URL,
      badge: 'CLIPS & REELS',
      badgeColor: 'bg-amber-600/20 text-amber-400 border-amber-500/30',
      icon: Flame,
      iconColor: 'text-amber-500',
      actionType: 'link'
    },
    {
      id: 'quick-gaming-home',
      title: 'YouTube Gaming Home',
      subtitle: 'Trending clips, VODs & creators',
      url: YOUTUBE_GAMING_HOME_URL,
      badge: 'HOME FEED',
      badgeColor: 'bg-white/5 text-zinc-300 border-white/10',
      icon: Sparkles,
      iconColor: 'text-zinc-300',
      actionType: 'link'
    },
    {
      id: 'quick-popout',
      title: 'Popout Stream Window',
      subtitle: 'Clean 1280×720 floating terminal',
      url: PRIMARY_YOUTUBE_GAMING_URL,
      badge: 'POPOUT MODE',
      badgeColor: 'bg-white/5 text-zinc-300 border-white/10',
      icon: Tv,
      iconColor: 'text-red-400',
      actionType: 'custom',
      handler: onOpenPopout
    },
    {
      id: 'quick-qr',
      title: 'Mobile QR Terminal',
      subtitle: 'Instant phone & tablet camera scan',
      url: PRIMARY_YOUTUBE_GAMING_URL,
      badge: 'CROSS-DEVICE',
      badgeColor: 'bg-white/5 text-zinc-300 border-white/10',
      icon: QrCode,
      iconColor: 'text-emerald-400',
      actionType: 'custom',
      handler: onOpenQr
    },
    {
      id: 'quick-copy',
      title: copied ? 'Link Copied to Clipboard' : 'Copy Direct Link',
      subtitle: PRIMARY_YOUTUBE_GAMING_URL,
      url: PRIMARY_YOUTUBE_GAMING_URL,
      badge: copied ? 'COPIED!' : 'SHARE URL',
      badgeColor: copied ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-white/5 text-zinc-400 border-white/10',
      icon: copied ? Check : Copy,
      iconColor: copied ? 'text-emerald-400' : 'text-zinc-400',
      actionType: 'custom',
      handler: onCopyLink
    }
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-red-600"></div>
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">ACCESS PROTOCOLS</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight uppercase text-white flex items-center gap-2">
            Quick Launch Hubs & Modalities
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {launcherCards.map((card) => {
          const Icon = card.icon;

          if (card.actionType === 'link' && card.url) {
            return (
              <a
                id={card.id}
                key={card.id}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                data-recent-title={card.title}
                data-recent-category={card.badge}
                data-recent-type={card.id.includes('shorts') ? 'shorts' : (card.id.includes('live') ? 'live' : 'gaming')}
                className="group relative flex flex-col justify-between p-6 rounded-xl bg-zinc-950/70 hover:bg-zinc-900/80 border border-white/10 hover:border-white/20 shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-md bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                      <Icon className={`w-5 h-5 ${card.iconColor}`} />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-white group-hover:text-red-400 text-base uppercase tracking-tight transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                    {card.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 text-xs text-zinc-500 group-hover:text-red-400 font-mono">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">OPEN IN NEW TAB</span>
                  <ExternalLink className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </a>
            );
          }

          return (
            <button
              id={card.id}
              key={card.id}
              onClick={card.handler}
              type="button"
              className="group relative flex flex-col justify-between p-6 rounded-xl bg-zinc-950/70 hover:bg-zinc-900/80 border border-white/10 hover:border-white/20 shadow-lg transition-all duration-200 text-left hover:-translate-y-0.5 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-md bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>
                <h3 className="font-bold text-white group-hover:text-red-400 text-base uppercase tracking-tight transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-1 font-mono">
                  {card.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 text-xs text-zinc-500 group-hover:text-red-400 font-mono">
                <span className="text-[11px] uppercase tracking-wider font-semibold">EXECUTE ACTION</span>
                <Monitor className="w-3.5 h-3.5 transform group-hover:scale-110 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
