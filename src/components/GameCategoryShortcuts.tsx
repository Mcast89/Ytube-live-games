import React, { useState } from 'react';
import { 
  Gamepad2, 
  Search, 
  ExternalLink, 
  Flame, 
  Trophy, 
  Radio, 
  Tv, 
  Sparkles,
  Layers
} from 'lucide-react';
import { POPULAR_GAMES, PRIMARY_YOUTUBE_GAMING_URL } from '../data/gamingShortcuts';

interface GameCategoryShortcutsProps {
  onSelectGame?: (gameUrl: string) => void;
}

export const GameCategoryShortcuts: React.FC<GameCategoryShortcutsProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'YouTube Gaming', 'Live Videos & Shorts', 'Battle Royale', 'Tactical FPS', 'MOBA', 'Sandbox / Survival', 'Action / Roleplay'];

  const filteredGames = POPULAR_GAMES.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = false;
    if (selectedCategory === 'All') {
      matchesCategory = true;
    } else if (selectedCategory === 'Live Videos & Shorts') {
      matchesCategory = game.id.startsWith('yt-') || game.category.includes('Global') || game.category.includes('Short');
    } else if (selectedCategory === 'YouTube Gaming') {
      matchesCategory = game.category === 'YouTube Gaming' || game.id.startsWith('yt-');
    } else {
      matchesCategory = game.category.includes(selectedCategory);
    }

    return matchesSearch && matchesCategory;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return Flame;
      case 'Trophy': return Trophy;
      case 'Radio': return Radio;
      case 'Tv': return Tv;
      case 'Sparkles': return Sparkles;
      default: return Gamepad2;
    }
  };

  return (
    <section className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-red-600"></div>
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">GAME HUBS</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight uppercase text-white flex items-center gap-2">
            Top Live Game Directories
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="game-filter-search-input"
            type="text"
            placeholder="FILTER GAMES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-md bg-zinc-950 border border-white/10 focus:border-red-500 text-xs uppercase tracking-wider text-white placeholder-zinc-500 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            type="button"
            className={`px-3.5 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-red-600 text-white border border-red-500 shadow-md shadow-red-600/20'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map((game) => {
          const Icon = getIcon(game.iconName);
          const isMainHub = game.url === PRIMARY_YOUTUBE_GAMING_URL;

          return (
            <a
              id={`game-card-${game.id}`}
              key={game.id}
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              data-recent-title={game.name}
              data-recent-category={game.category}
              data-recent-type={game.id.startsWith('yt-shorts') ? 'shorts' : (game.id.startsWith('yt-live') ? 'live' : 'game')}
              className="group relative flex flex-col justify-between p-6 rounded-xl bg-zinc-950/70 hover:bg-zinc-900/80 border border-white/10 hover:border-white/20 shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-3 rounded-md bg-white/5 border border-white/10 text-white group-hover:border-white/20 transition-colors">
                    <Icon className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-white/5 text-zinc-300 border border-white/10">
                      {game.tag}
                    </span>
                    {isMainHub && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-red-600/20 text-red-400 border border-red-500/30">
                        MAIN HUB
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                  {game.category}
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-red-400 uppercase tracking-tight transition-colors">
                  {game.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed line-clamp-2">
                  {game.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 text-xs text-zinc-500 group-hover:text-white font-mono">
                <span className="flex items-center gap-1.5 text-zinc-400 text-[11px] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  WATCH ON YOUTUBE
                </span>
                <span className="inline-flex items-center gap-1 text-red-400 font-bold uppercase text-[11px] tracking-wider group-hover:translate-x-0.5 transition-transform">
                  LAUNCH
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {/* Fallback if no games match search */}
      {filteredGames.length === 0 && (
        <div className="text-center py-12 px-4 rounded-xl bg-zinc-950 border border-white/10">
          <Layers className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold uppercase tracking-tight text-zinc-300">
            No game directory found matching "{searchQuery}"
          </h3>
          <p className="text-xs text-zinc-500 mt-1 mb-4">
            Search YouTube Gaming directly or launch the global live games directory.
          </p>
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}+live+stream&sp=CAM%253D`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
          >
            <span>SEARCH "{searchQuery}" ON YOUTUBE LIVE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </section>
  );
};
