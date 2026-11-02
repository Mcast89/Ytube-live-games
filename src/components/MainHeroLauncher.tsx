import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  ExternalLink, 
  Copy, 
  Check, 
  Radio, 
  Tv, 
  Flame, 
  Sparkles,
  Gamepad2,
  Film
} from 'lucide-react';
import { 
  PRIMARY_YOUTUBE_GAMING_URL, 
  YOUTUBE_LIVE_VIDEOS_URL, 
  YOUTUBE_SHORTS_URL 
} from '../data/gamingShortcuts';

interface MainHeroLauncherProps {
  onCopyLink: () => void;
  copied: boolean;
  onOpenPopout: () => void;
  onOpenQr: () => void;
}

export const MainHeroLauncher: React.FC<MainHeroLauncherProps> = ({
  onCopyLink,
  copied,
  onOpenPopout,
  onOpenQr
}) => {
  const [activeDestination, setActiveDestination] = useState<'gaming' | 'live' | 'shorts'>('gaming');

  const destinations = {
    gaming: {
      name: 'YouTube Live Gaming',
      tag: 'GAMING HUB',
      url: PRIMARY_YOUTUBE_GAMING_URL,
      description: 'Direct gateway to real-time broadcasts, tournaments, esports championships, and creator streams.',
      launchLabel: 'LAUNCH LIVE GAMING',
      icon: Gamepad2
    },
    live: {
      name: 'YouTube Live Videos',
      tag: 'ALL LIVE STREAMS',
      url: YOUTUBE_LIVE_VIDEOS_URL,
      description: 'Global portal for all ongoing live video streams across gaming, esports, special events, news, and entertainment.',
      launchLabel: 'LAUNCH LIVE VIDEOS',
      icon: Radio
    },
    shorts: {
      name: 'YouTube Shorts',
      tag: 'VERTICAL FEED',
      url: YOUTUBE_SHORTS_URL,
      description: 'Direct portal into the high-energy YouTube Shorts vertical video feed, trending gaming reels, and quick highlights.',
      launchLabel: 'LAUNCH YOUTUBE SHORTS',
      icon: Film
    }
  };

  const current = destinations[activeDestination];

  const handleCopyCurrent = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(current.url);
    }
    onCopyLink();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 sm:p-12 lg:p-16 shadow-2xl">
      {/* Background ambient red glow matching Elegant Dark */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[120px] rounded-full"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-bold tracking-widest text-zinc-400 uppercase mb-6"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-red-500 font-black">GLOBAL STREAMING PROTOCOL</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-300">DIRECT DESTINATION SELECTOR</span>
        </motion.div>

        {/* Quick Portal Switcher Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <button
            id="hero-tab-gaming"
            type="button"
            onClick={() => setActiveDestination('gaming')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeDestination === 'gaming'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 border border-red-500'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10 hover:bg-white/10'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Live Gaming</span>
          </button>

          <button
            id="hero-tab-live"
            type="button"
            onClick={() => setActiveDestination('live')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeDestination === 'live'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 border border-red-500'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10 hover:bg-white/10'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-red-400" />
            <span>Live Videos</span>
          </button>

          <button
            id="hero-tab-shorts"
            type="button"
            onClick={() => setActiveDestination('shorts')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeDestination === 'shorts'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 border border-red-500'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10 hover:bg-white/10'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>YouTube Shorts</span>
          </button>
        </div>

        {/* Main Headline */}
        <motion.h1
          key={activeDestination + '-headline'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tighter uppercase mb-6"
        >
          {activeDestination === 'gaming' && (
            <>
              UNLEASH THE<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">
                GAMING WORLD
              </span>
            </>
          )}
          {activeDestination === 'live' && (
            <>
              DISCOVER GLOBAL<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">
                LIVE VIDEOS
              </span>
            </>
          )}
          {activeDestination === 'shorts' && (
            <>
              DIVE INTO<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">
                YOUTUBE SHORTS
              </span>
            </>
          )}
        </motion.h1>

        {/* Description */}
        <motion.p
          key={activeDestination + '-desc'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-500 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          {current.description}
        </motion.p>

        {/* Interactive URL Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="w-full max-w-xl mb-8"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-zinc-950/90 border border-white/10 text-xs sm:text-sm font-mono text-zinc-300 shadow-inner">
            <div className="flex items-center gap-2 truncate">
              <span className="text-red-500 font-bold uppercase tracking-wider text-[11px]">DESTINATION:</span>
              <span className="truncate select-all text-zinc-200">{current.url}</span>
            </div>
            <button
              id="hero-copy-url-chip"
              onClick={handleCopyCurrent}
              type="button"
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white border border-white/10 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              title="Copy URL"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Primary Giant Launch Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center flex-wrap"
        >
          <a
            id="hero-main-launch-btn"
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            data-recent-title={current.name}
            data-recent-category={current.tag}
            data-recent-type={activeDestination}
            className="group w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-md font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-600/25 active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <span>{current.launchLabel}</span>
            <ExternalLink className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <a
            id="hero-open-live-btn"
            href={YOUTUBE_LIVE_VIDEOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-recent-title="YouTube Live Videos"
            data-recent-category="Global Live"
            data-recent-type="live"
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-4 sm:py-5 rounded-md font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer uppercase tracking-wider"
            title="Open YouTube Live Videos directly"
          >
            <Radio className="w-4 h-4 text-red-500" />
            <span>LIVE VIDEOS</span>
          </a>

          <a
            id="hero-open-shorts-btn"
            href={YOUTUBE_SHORTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-recent-title="YouTube Shorts Feed"
            data-recent-category="Shorts"
            data-recent-type="shorts"
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-4 sm:py-5 rounded-md font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer uppercase tracking-wider"
            title="Open YouTube Shorts directly"
          >
            <Film className="w-4 h-4 text-rose-500" />
            <span>SHORTS FEED</span>
          </a>

          <button
            id="hero-popout-window-btn"
            onClick={onOpenPopout}
            type="button"
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-4 sm:py-5 rounded-md font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer uppercase tracking-wider"
            title="Open in a dedicated popout streamer window"
          >
            <Tv className="w-4 h-4 text-red-500" />
            <span>POPOUT</span>
          </button>
        </motion.div>

        {/* Feature Highlights metrics bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-lg overflow-hidden w-full mt-12 text-left">
          <div className="p-4 sm:p-5 bg-zinc-950/80 hover:bg-zinc-900/50 transition-colors">
            <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-1">LIVE STREAMS</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-white">40,000+</span>
              <span className="text-red-500 text-xs font-bold">ACTIVE</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-zinc-950/80 hover:bg-zinc-900/50 transition-colors">
            <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-1">YOUTUBE SHORTS</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-white">70B+</span>
              <span className="text-rose-500 text-xs font-bold">DAILY VIEWS</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-zinc-950/80 hover:bg-zinc-900/50 transition-colors">
            <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-1">GLOBAL BROADCASTS</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-white">4K 60FPS</span>
              <span className="text-zinc-500 text-xs font-bold uppercase">ULTRA</span>
            </div>
          </div>

          <div 
            onClick={onOpenQr}
            className="p-4 sm:p-5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 transition-colors cursor-pointer group"
          >
            <p className="text-[10px] font-bold tracking-widest text-red-400 uppercase mb-1 flex items-center justify-between">
              MOBILE ACCESS
              <ExternalLink className="w-3 h-3 text-red-400" />
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-white group-hover:text-red-400 transition-colors">SCAN QR CODE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
