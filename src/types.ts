export interface GameShortcut {
  id: string;
  name: string;
  category: string;
  tag: string;
  color: string;
  accentBorder: string;
  url: string;
  description: string;
  iconName: string;
}

export interface CustomBookmark {
  id: string;
  title: string;
  url: string;
  gameTag?: string;
  createdAt: number;
  notes?: string;
}

export interface RecentHistoryItem {
  id: string;
  title: string;
  url: string;
  category: string;
  timestamp: number;
  iconType?: 'gaming' | 'live' | 'shorts' | 'channel' | 'game' | 'search';
}

export type LaunchMode = 'tab' | 'popup' | 'direct';
