import React from 'react';
import { Radio, Trophy, ShieldCheck, Flame, ExternalLink } from 'lucide-react';
import { PRIMARY_YOUTUBE_GAMING_URL } from '../data/gamingShortcuts';

export const StreamerGuideSection: React.FC = () => {
  return (
    <div className="rounded-xl bg-zinc-950/70 border border-white/10 p-6 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-red-600/10 text-red-400 border border-red-500/20">
            <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
            BROADCAST ARCHITECTURE
          </div>
          <h3 className="text-xl font-bold uppercase tracking-tight text-white">
            What you'll find on YouTube Live Gaming
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            The direct portal (<code className="text-red-400 font-mono text-xs">/gaming/games</code>) aggregates real-time live game broadcasts across all active titles, official esports league tournaments, and creator community lobbies.
          </p>
        </div>

        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3">
          <a
            id="guide-all-live-btn"
            href={PRIMARY_YOUTUBE_GAMING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <span>EXPLORE ALL GAMES</span>
            <ExternalLink className="w-4 h-4 text-zinc-400" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-md bg-white/5 border border-white/10 text-red-500 flex-shrink-0">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Direct Live Feeds</h4>
            <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
              Live gameplay broadcasts indexed by active viewer count and real-time community engagement.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-md bg-white/5 border border-white/10 text-amber-500 flex-shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Official Esports</h4>
            <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
              Pro circuits like VCT, ALGS, Worlds, and CDL broadcasting in 4K 60FPS directly on YouTube.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-md bg-white/5 border border-white/10 text-emerald-400 flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Verified Creators</h4>
            <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
              Super Chats, live polls, channel memberships, and synchronized interactive chat rooms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
