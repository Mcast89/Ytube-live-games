import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Bookmark, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Copy, 
  Check, 
  Edit3, 
  Download, 
  Upload, 
  RotateCcw, 
  Radio, 
  Search, 
  Sparkles, 
  HardDrive, 
  X,
  Tv,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CustomBookmark } from '../types';

const STORAGE_KEY = 'yt_gaming_custom_bookmarks_v1';

// Default starter shortcuts for all users
const DEFAULT_BOOKMARKS: CustomBookmark[] = [
  {
    id: 'default-1',
    title: 'The Game Awards & Showcase Streams',
    url: 'https://www.youtube.com/results?search_query=the+game+awards+live&sp=CAM%253D',
    gameTag: 'Showcase',
    createdAt: Date.now() - 3000,
    notes: 'Official live gaming showcases & world premieres'
  },
  {
    id: 'default-2',
    title: 'Games Done Quick Live (GDQ)',
    url: 'https://www.youtube.com/@gamesdonequick/live',
    gameTag: 'Speedrun',
    createdAt: Date.now() - 2000,
    notes: 'Speedrunning marathons raising money for charity'
  },
  {
    id: 'default-3',
    title: 'LCK Global - LoL Championship',
    url: 'https://www.youtube.com/@LCKglobal/live',
    gameTag: 'Esports',
    createdAt: Date.now() - 1000,
    notes: 'Official English live broadcast of LCK League of Legends'
  },
  {
    id: 'default-4',
    title: 'Ludwig Live Streams',
    url: 'https://www.youtube.com/@ludwig/live',
    gameTag: 'Creator',
    createdAt: Date.now() - 500,
    notes: 'Gaming tournaments and variety live streams'
  }
];

// Curated popular gaming channels users can add with 1-click
const PRESET_CHANNELS = [
  {
    title: 'Tarik',
    url: 'https://www.youtube.com/@tarik/live',
    tag: 'FPS / VALORANT',
    notes: 'Major watch parties & high-elo ranked streams'
  },
  {
    title: 'Shroud',
    url: 'https://www.youtube.com/@shroud/live',
    tag: 'Shooters',
    notes: 'Tactical shooters & newly released games'
  },
  {
    title: 'Valkyrae',
    url: 'https://www.youtube.com/@Valkyrae/live',
    tag: 'Variety',
    notes: 'Co-op gaming, party games & variety streams'
  },
  {
    title: 'ESL Counter-Strike',
    url: 'https://www.youtube.com/@ESLCS/live',
    tag: 'CS2 Esports',
    notes: 'ESL Pro League, IEM & Major tournaments'
  },
  {
    title: 'TimTheTatman',
    url: 'https://www.youtube.com/@TimTheTatman/live',
    tag: 'Battle Royale',
    notes: 'Call of Duty Warzone & competitive squads'
  },
  {
    title: 'Rocket League Esports',
    url: 'https://www.youtube.com/@rlesports/live',
    tag: 'RLCS',
    notes: 'Official Rocket League Championship Series'
  },
  {
    title: 'Nintendo Live Events',
    url: 'https://www.youtube.com/@NintendoAmerica/live',
    tag: 'Nintendo',
    notes: 'Nintendo Directs & competitive showcases'
  },
  {
    title: 'PlayStation Broadcasts',
    url: 'https://www.youtube.com/@PlayStation/live',
    tag: 'PlayStation',
    notes: 'State of Play & PlayStation Showcase events'
  }
];

export const CustomShortcuts: React.FC = () => {
  // Initialize state from localStorage with safe fallback
  const [bookmarks, setBookmarks] = useState<CustomBookmark[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not parse bookmarks from localStorage', err);
    }
    return DEFAULT_BOOKMARKS;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [showPresets, setShowPresets] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form inputs
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formTag, setFormTag] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Auto-persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (err) {
      console.error('Failed to write bookmarks to localStorage', err);
    }
  }, [bookmarks]);

  // Multi-tab sync: keep in sync when other tabs modify localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setBookmarks(updated);
            showNotice('Synchronized from another browser tab');
          }
        } catch {
          // ignore parsing error
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => {
      setStatusNotice((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  // Format and validate custom URLs
  const formatInputUrl = (rawUrl: string, title: string): string => {
    const trimmed = rawUrl.trim();
    if (!trimmed) {
      return `https://www.youtube.com/results?search_query=${encodeURIComponent(title.trim())}+live+gaming&sp=CAM%253D`;
    }

    // Support handle shortcut like "@shroud" or "@ludwig"
    if (trimmed.startsWith('@')) {
      return `https://www.youtube.com/${trimmed}/live`;
    }

    // Support handle without @ if it looks like a YouTube channel handle
    if (!trimmed.includes('.') && !trimmed.includes('/') && !trimmed.startsWith('http')) {
      return `https://www.youtube.com/@${trimmed}/live`;
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return `https://${trimmed}`;
    }

    return trimmed;
  };

  const handleOpenAddForm = () => {
    setEditingId(null);
    setFormTitle('');
    setFormUrl('');
    setFormTag('');
    setFormNotes('');
    setIsAdding(true);
  };

  const handleOpenEditForm = (item: CustomBookmark) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormUrl(item.url);
    setFormTag(item.gameTag || '');
    setFormNotes(item.notes || '');
    setIsAdding(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const finalUrl = formatInputUrl(formUrl, formTitle);

    if (editingId) {
      // Editing existing shortcut
      setBookmarks(prev =>
        prev.map(b =>
          b.id === editingId
            ? {
                ...b,
                title: formTitle.trim(),
                url: finalUrl,
                gameTag: formTag.trim() || 'Custom',
                notes: formNotes.trim() || undefined
              }
            : b
        )
      );
      showNotice(`Updated "${formTitle.trim()}" in browser storage`);
    } else {
      // Creating new shortcut
      const newBookmark: CustomBookmark = {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: formTitle.trim(),
        url: finalUrl,
        gameTag: formTag.trim() || 'Custom',
        createdAt: Date.now(),
        notes: formNotes.trim() || undefined
      };
      setBookmarks(prev => [newBookmark, ...prev]);
      showNotice(`Saved "${formTitle.trim()}" to browser storage`);
    }

    setIsAdding(false);
    setEditingId(null);
  };

  const handleDelete = (id: string, title: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
    showNotice(`Removed "${title}" from custom shortcuts`);
  };

  const handleAddPreset = (preset: typeof PRESET_CHANNELS[0]) => {
    // Check if already added by URL or title
    const exists = bookmarks.some(
      b => b.url.toLowerCase() === preset.url.toLowerCase() || b.title.toLowerCase() === preset.title.toLowerCase()
    );

    if (exists) {
      showNotice(`"${preset.title}" is already in your shortcuts!`);
      return;
    }

    const newBookmark: CustomBookmark = {
      id: `preset-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: preset.title,
      url: preset.url,
      gameTag: preset.tag,
      notes: preset.notes,
      createdAt: Date.now()
    };

    setBookmarks(prev => [newBookmark, ...prev]);
    showNotice(`Added ${preset.title} to your saved shortcuts`);
  };

  const handleCopyBookmarkUrl = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      showNotice('Shortcut link copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedId(id);
      showNotice('Link copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bookmarks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `youtube-gaming-shortcuts-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotice('Backup file exported successfully!');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const imported = JSON.parse(content);
        if (Array.isArray(imported)) {
          // Validate structure
          const validItems: CustomBookmark[] = imported
            .filter((item: any) => item && typeof item.title === 'string' && typeof item.url === 'string')
            .map((item: any) => ({
              id: item.id || `imported-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              title: String(item.title),
              url: String(item.url),
              gameTag: item.gameTag ? String(item.gameTag) : 'Imported',
              createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
              notes: item.notes ? String(item.notes) : undefined
            }));

          if (validItems.length > 0) {
            // Merge deduplicating by URL
            const existingUrls = new Set(bookmarks.map(b => b.url.toLowerCase()));
            const newToAdd = validItems.filter(b => !existingUrls.has(b.url.toLowerCase()));
            setBookmarks(prev => [...newToAdd, ...prev]);
            showNotice(`Imported ${newToAdd.length} new shortcuts from backup file!`);
          } else {
            showNotice('No valid shortcuts found in file');
          }
        }
      } catch (err) {
        showNotice('Invalid JSON backup file');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    setBookmarks(DEFAULT_BOOKMARKS);
    setShowResetConfirm(false);
    showNotice('Reset shortcuts to default gaming channels');
  };

  // Distinct tags for category filtering
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    bookmarks.forEach(b => {
      if (b.gameTag) tags.add(b.gameTag);
    });
    return ['All', ...Array.from(tags)];
  }, [bookmarks]);

  // Filtered bookmarks list
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(b => {
      const matchesSearch = 
        b.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (b.gameTag && b.gameTag.toLowerCase().includes(searchFilter.toLowerCase())) ||
        (b.notes && b.notes.toLowerCase().includes(searchFilter.toLowerCase())) ||
        b.url.toLowerCase().includes(searchFilter.toLowerCase());

      const matchesTag = selectedTag === 'All' || b.gameTag === selectedTag;

      return matchesSearch && matchesTag;
    });
  }, [bookmarks, searchFilter, selectedTag]);

  return (
    <section className="space-y-5 bg-gradient-to-b from-[#0c0c0c] to-[#070707] border border-white/10 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>PERSISTENT STORAGE ACTIVE</span>
            </div>
            <span className="text-zinc-500 text-xs">•</span>
            <span className="text-[11px] font-mono text-zinc-400">
              {bookmarks.length} {bookmarks.length === 1 ? 'CHANNEL' : 'CHANNELS'} SAVED
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-white flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-red-500" />
            <span>My Custom Gaming Hub</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Save your favorite Twitch/YouTube creators, tournament feeds, and esports live links. Saved automatically in your browser's persistent <span className="text-zinc-200 font-mono">localStorage</span> across sessions.
          </p>
        </div>

        {/* Action button controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick presets toggle */}
          <button
            type="button"
            id="shortcuts-toggle-presets-btn"
            onClick={() => setShowPresets(!showPresets)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
              showPresets
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/20'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{showPresets ? 'HIDE PRESETS' : 'SUGGESTED CREATORS'}</span>
          </button>

          {/* Add custom shortcut */}
          <button
            id="custom-add-shortcut-btn"
            onClick={handleOpenAddForm}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/20 border border-red-500/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ADD CHANNEL</span>
          </button>
        </div>
      </div>

      {/* Persistence status notice toast */}
      {statusNotice && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{statusNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusNotice(null)}
            className="text-emerald-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Suggested popular channels drawer */}
      {showPresets && (
        <div className="p-4 sm:p-5 rounded-xl bg-zinc-950/90 border border-red-500/30 shadow-inner space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                1-Click Add Popular Gaming Live Channels
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              Click any channel to auto-save to your shortcuts
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PRESET_CHANNELS.map((preset) => {
              const isAdded = bookmarks.some(b => b.title.toLowerCase() === preset.title.toLowerCase());
              return (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => handleAddPreset(preset)}
                  disabled={isAdded}
                  className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                    isAdded
                      ? 'bg-white/5 border-white/5 text-zinc-500 cursor-not-allowed opacity-60'
                      : 'bg-zinc-900/80 hover:bg-zinc-800 border-white/10 hover:border-red-500/40 text-zinc-200 hover:text-white cursor-pointer group shadow-sm'
                  }`}
                >
                  <div className="truncate pr-1">
                    <div className="text-xs font-bold uppercase truncate group-hover:text-red-400">
                      {preset.title}
                    </div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                      {preset.tag}
                    </div>
                  </div>
                  {isAdded ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                      <Check className="w-3 h-3" />
                      SAVED
                    </span>
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal-Drawer */}
      {isAdding && (
        <form 
          onSubmit={handleSaveForm}
          className="p-5 sm:p-6 rounded-xl bg-zinc-950 border border-red-500/40 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 relative"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-red-600/20 text-red-500">
                {editingId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
              <h3 className="font-black text-sm uppercase tracking-wider text-white">
                {editingId ? 'Edit Saved Shortcut' : 'Create New Stream Shortcut'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="text-zinc-500 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                STREAMER OR TITLE *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tarik Live, LCK, GDQ"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-xs uppercase tracking-wider text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                CATEGORY / TAG (OPTIONAL)
              </label>
              <input
                type="text"
                placeholder="e.g. FPS, MOBA, Speedrun, Creator"
                value={formTag}
                onChange={(e) => setFormTag(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-xs uppercase tracking-wider text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                URL OR HANDLE (@CHANNEL)
              </label>
              <input
                type="text"
                placeholder="e.g. @tarik or full live stream URL"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-xs uppercase tracking-wider text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              OPTIONAL NOTES / SCHEDULE
            </label>
            <input
              type="text"
              placeholder="e.g. Streams daily at 2 PM EST, Tournament finals on Sunday"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <span className="text-[11px] font-mono text-zinc-500">
              * Auto-saved to localStorage on submit
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30 transition-colors cursor-pointer"
              >
                {editingId ? 'UPDATE SHORTCUT' : 'SAVE TO SHORTCUTS'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved shortcuts..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950/80 border border-white/10 text-xs uppercase tracking-wider text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none transition-colors"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tag chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedTag === tag
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Bookmarks Grid */}
      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-white/10 bg-zinc-950/40 space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-zinc-500 flex items-center justify-center mx-auto">
            <Radio className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold uppercase tracking-wide text-zinc-300">
              No matching shortcuts found
            </h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {searchFilter
                ? `No shortcuts match "${searchFilter}". Try clearing your search filter.`
                : 'Add custom gaming streams or pick from our suggested creator list above.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            {searchFilter ? (
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-zinc-300 border border-white/10 cursor-pointer"
              >
                Clear Search
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowPresets(true)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/20 cursor-pointer"
              >
                Explore Creator Presets
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredBookmarks.map((b) => {
            const isJustCopied = copiedId === b.id;

            return (
              <div
                key={b.id}
                className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-white/10 hover:border-red-500/30 transition-all shadow-md hover:shadow-xl hover:shadow-black/60"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-red-600/10 text-red-500 border border-red-500/20 group-hover:border-red-500/40 group-hover:bg-red-600 group-hover:text-white transition-all flex-shrink-0">
                        <Radio className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                        {b.gameTag || 'Gaming'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {/* Copy Link button */}
                      <button
                        type="button"
                        onClick={() => handleCopyBookmarkUrl(b.id, b.url)}
                        title="Copy live stream link"
                        className="p-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {isJustCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Edit button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditForm(b)}
                        title="Edit shortcut"
                        className="p-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(b.id, b.title)}
                        title="Delete shortcut"
                        className="p-1.5 rounded-md hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Notes */}
                  <h3 className="font-bold text-sm text-white uppercase tracking-tight group-hover:text-red-400 transition-colors line-clamp-1">
                    {b.title}
                  </h3>

                  {b.notes && (
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                      {b.notes}
                    </p>
                  )}
                </div>

                {/* Footer launch button */}
                <div className="pt-3.5 mt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[140px]">
                    {b.url.replace(/^https?:\/\/(www\.)?/, '')}
                  </span>

                  <a
                    id={`bookmark-open-${b.id}`}
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-recent-title={b.title}
                    data-recent-category={b.gameTag || 'Custom'}
                    data-recent-type="channel"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-600/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                  >
                    <span>WATCH</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Storage & Backup Tools Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <HardDrive className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-400 font-mono text-[11px]">
            Saved in browser localStorage ({bookmarks.length} shortcuts • {Math.round(JSON.stringify(bookmarks).length / 1024 * 10) / 10} KB)
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Hidden file input for import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJson}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 hover:text-zinc-300 font-bold uppercase tracking-wider text-[11px] cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>EXPORT BACKUP</span>
          </button>

          <span className="text-zinc-700">•</span>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 hover:text-zinc-300 font-bold uppercase tracking-wider text-[11px] cursor-pointer transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span>IMPORT BACKUP</span>
          </button>

          <span className="text-zinc-700">•</span>

          {showResetConfirm ? (
            <div className="flex items-center gap-1.5 bg-red-950/60 border border-red-500/30 px-2 py-1 rounded">
              <span className="text-red-300 text-[10px] font-bold">RESET ALL?</span>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-red-400 hover:text-white font-bold text-[10px] underline cursor-pointer"
              >
                YES
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="text-zinc-400 hover:text-white text-[10px] cursor-pointer ml-1"
              >
                CANCEL
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 hover:text-red-400 font-bold uppercase tracking-wider text-[11px] cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-zinc-500" />
              <span>RESET DEFAULTS</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
