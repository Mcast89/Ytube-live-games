import { RecentHistoryItem } from '../types';

export const RECENT_STORAGE_KEY = 'yt_gaming_recent_history_v1';
export const MAX_RECENT_ITEMS = 5;

// Retrieve recent items from localStorage
export function getRecentLinks(): RecentHistoryItem[] {
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, MAX_RECENT_ITEMS);
    }
  } catch (err) {
    console.warn('Failed to parse recent links from localStorage', err);
  }
  return [];
}

// Record a clicked link or channel, ensuring only the last 5 are preserved
export function recordRecentLink(item: {
  title: string;
  url: string;
  category?: string;
  iconType?: 'gaming' | 'live' | 'shorts' | 'channel' | 'game' | 'search';
}): RecentHistoryItem[] {
  try {
    const current = getRecentLinks();
    
    // Normalize url for deduplication
    const cleanUrl = item.url.trim();

    // Deduplicate: remove if previously present
    const filtered = current.filter(
      (existing) => existing.url.trim().toLowerCase() !== cleanUrl.toLowerCase()
    );

    const newItem: RecentHistoryItem = {
      id: `recent-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: item.title.trim() || 'YouTube Stream',
      url: cleanUrl,
      category: item.category || 'Gaming',
      timestamp: Date.now(),
      iconType: item.iconType || 'gaming'
    };

    const updated = [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));

    // Notify all components across the app and open tabs
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('recent-links-updated', { detail: updated }));
    }

    return updated;
  } catch (err) {
    console.error('Failed to save recent link', err);
    return [];
  }
}

// Remove an individual link
export function removeRecentLink(id: string): RecentHistoryItem[] {
  try {
    const current = getRecentLinks();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('recent-links-updated', { detail: updated }));
    }
    return updated;
  } catch (err) {
    console.error('Failed to remove recent link', err);
    return [];
  }
}

// Clear all recent history
export function clearRecentLinks(): void {
  try {
    localStorage.removeItem(RECENT_STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('recent-links-updated', { detail: [] }));
    }
  } catch (err) {
    console.error('Failed to clear recent links', err);
  }
}

// Format relative time (e.g. "Just now", "3m ago", "2h ago")
export function formatTimeAgo(timestamp: number): string {
  const diffSeconds = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSeconds < 45) return 'Just now';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
