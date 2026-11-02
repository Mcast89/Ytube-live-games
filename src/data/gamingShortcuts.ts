import { GameShortcut } from '../types';

export const PRIMARY_YOUTUBE_GAMING_URL = 'https://www.youtube.com/gaming/games';
export const YOUTUBE_GAMING_HOME_URL = 'https://www.youtube.com/gaming';
export const YOUTUBE_LIVE_VIDEOS_URL = 'https://www.youtube.com/live';
export const YOUTUBE_LIVE_HUB_URL = 'https://www.youtube.com/live';
export const YOUTUBE_SHORTS_URL = 'https://www.youtube.com/shorts';
export const YOUTUBE_GAMING_SHORTS_URL = 'https://www.youtube.com/hashtag/gamingshorts';

export const POPULAR_GAMES: GameShortcut[] = [
  {
    id: 'yt-all-games',
    name: 'All Live Games Hub',
    category: 'YouTube Gaming',
    tag: 'All Games',
    color: 'from-red-600 to-rose-700',
    accentBorder: 'border-red-500/40 hover:border-red-500',
    url: 'https://www.youtube.com/gaming/games',
    description: 'Explore all live games, top streams, and trending gameplay on YouTube.',
    iconName: 'Gamepad2'
  },
  {
    id: 'yt-live-videos',
    name: 'YouTube Live Videos',
    category: 'Global Broadcasts',
    tag: 'Live Videos',
    color: 'from-red-700 to-amber-800',
    accentBorder: 'border-red-500/40 hover:border-red-500',
    url: 'https://www.youtube.com/live',
    description: 'Direct portal to all live video streams across gaming, esports, events, and news.',
    iconName: 'Radio'
  },
  {
    id: 'yt-shorts',
    name: 'YouTube Shorts Feed',
    category: 'Short Form',
    tag: 'Shorts',
    color: 'from-rose-600 to-red-800',
    accentBorder: 'border-rose-500/40 hover:border-rose-500',
    url: 'https://www.youtube.com/shorts',
    description: 'Infinite continuous stream of trending short-form viral videos and creator reels.',
    iconName: 'Sparkles'
  },
  {
    id: 'yt-gaming-shorts',
    name: 'Gaming Shorts Hub',
    category: 'Clips & Highlights',
    tag: 'Gaming Shorts',
    color: 'from-orange-600 to-rose-700',
    accentBorder: 'border-orange-500/40 hover:border-orange-500',
    url: 'https://www.youtube.com/hashtag/gamingshorts',
    description: 'Best gaming clutches, hilarious clips, game speedruns, and trending gameplay shorts.',
    iconName: 'Flame'
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    category: 'Sandbox / Survival',
    tag: 'Live Streams',
    color: 'from-emerald-600 to-teal-800',
    accentBorder: 'border-emerald-500/30 hover:border-emerald-500',
    url: 'https://www.youtube.com/results?search_query=minecraft+live+stream&sp=CAM%253D',
    description: 'SMPs, Hardcore runs, building streams and multiplayer live sessions.',
    iconName: 'Flame'
  },
  {
    id: 'gta-v',
    name: 'Grand Theft Auto V / RP',
    category: 'Action / Roleplay',
    tag: 'Live RP',
    color: 'from-amber-600 to-orange-700',
    accentBorder: 'border-amber-500/30 hover:border-amber-500',
    url: 'https://www.youtube.com/results?search_query=gta+5+live+stream&sp=CAM%253D',
    description: 'GTA Roleplay servers (NoPixel), police pursuits, and multiplayer raids.',
    iconName: 'Tv'
  },
  {
    id: 'valorant',
    name: 'Valorant',
    category: 'Tactical FPS',
    tag: 'Tournaments & Ranked',
    color: 'from-rose-600 to-pink-700',
    accentBorder: 'border-rose-500/30 hover:border-rose-500',
    url: 'https://www.youtube.com/results?search_query=valorant+live+stream&sp=CAM%253D',
    description: 'VCT Esports broadcasts, Radiant ranked climbs, and clutch highlights.',
    iconName: 'Trophy'
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    category: 'Battle Royale',
    tag: 'Live Events',
    color: 'from-blue-600 to-indigo-700',
    accentBorder: 'border-blue-500/30 hover:border-blue-500',
    url: 'https://www.youtube.com/results?search_query=fortnite+live+stream&sp=CAM%253D',
    description: 'FNCS tournaments, seasonal live events, custom lobbies, and Ranked squads.',
    iconName: 'Radio'
  },
  {
    id: 'league-of-legends',
    name: 'League of Legends',
    category: 'MOBA',
    tag: 'Esports & Solo Q',
    color: 'from-cyan-600 to-blue-800',
    accentBorder: 'border-cyan-500/30 hover:border-cyan-500',
    url: 'https://www.youtube.com/results?search_query=league+of+legends+live+stream&sp=CAM%253D',
    description: 'Worlds, MSI, regional leagues (LCK/LCS/LEC) and Challenger gameplay.',
    iconName: 'Trophy'
  },
  {
    id: 'roblox',
    name: 'Roblox',
    category: 'Virtual World',
    tag: 'Live Community',
    color: 'from-purple-600 to-indigo-800',
    accentBorder: 'border-purple-500/30 hover:border-purple-500',
    url: 'https://www.youtube.com/results?search_query=roblox+live+stream&sp=CAM%253D',
    description: 'Blox Fruits, Brookhaven, custom experiences, and creator community servers.',
    iconName: 'Sparkles'
  },
  {
    id: 'apex-legends',
    name: 'Apex Legends',
    category: 'Hero Shooter',
    tag: 'ALGS & Ranked',
    color: 'from-red-500 to-orange-700',
    accentBorder: 'border-red-500/30 hover:border-red-500',
    url: 'https://www.youtube.com/results?search_query=apex+legends+live+stream&sp=CAM%253D',
    description: 'Predator ranked grinds, ALGS pro league broadcasts, and character guides.',
    iconName: 'Radio'
  },
  {
    id: 'call-of-duty',
    name: 'Call of Duty: Warzone',
    category: 'Battle Royale / FPS',
    tag: 'Live Warzone',
    color: 'from-stone-600 to-neutral-800',
    accentBorder: 'border-stone-500/30 hover:border-stone-500',
    url: 'https://www.youtube.com/results?search_query=warzone+live+stream&sp=CAM%253D',
    description: 'CDL tournaments, high-kill Warzone matches, and Multiplayer camo grinds.',
    iconName: 'Gamepad2'
  }
];
