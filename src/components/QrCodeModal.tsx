import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Smartphone, Gamepad2, Radio, Film } from 'lucide-react';
import { 
  PRIMARY_YOUTUBE_GAMING_URL, 
  YOUTUBE_LIVE_VIDEOS_URL, 
  YOUTUBE_SHORTS_URL 
} from '../data/gamingShortcuts';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyLink: () => void;
  copied: boolean;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  onCopyLink,
  copied
}) => {
  const [selectedTarget, setSelectedTarget] = useState<'gaming' | 'live' | 'shorts'>('gaming');

  if (!isOpen) return null;

  const targetMap = {
    gaming: {
      name: 'YouTube Live Gaming',
      url: PRIMARY_YOUTUBE_GAMING_URL,
      icon: Gamepad2
    },
    live: {
      name: 'YouTube Live Videos',
      url: YOUTUBE_LIVE_VIDEOS_URL,
      icon: Radio
    },
    shorts: {
      name: 'YouTube Shorts',
      url: YOUTUBE_SHORTS_URL,
      icon: Film
    }
  };

  const current = targetMap[selectedTarget];

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    current.url
  )}&color=ffffff&bgcolor=171717&margin=10`;

  const handleCopyCurrent = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(current.url);
    }
    onCopyLink();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-xl bg-zinc-950 border border-white/10 p-6 sm:p-8 shadow-2xl text-center space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-white/5 text-red-500 border border-white/10">
          <Smartphone className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-xl font-bold uppercase tracking-tight text-white">
            Scan to Watch on Mobile
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Point your mobile camera at this QR code to instantly launch your chosen YouTube feed on your phone or tablet.
          </p>
        </div>

        {/* Target Switcher */}
        <div className="flex items-center justify-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-lg">
          <button
            type="button"
            onClick={() => setSelectedTarget('gaming')}
            className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedTarget === 'gaming'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Gaming
          </button>
          <button
            type="button"
            onClick={() => setSelectedTarget('live')}
            className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedTarget === 'live'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Live
          </button>
          <button
            type="button"
            onClick={() => setSelectedTarget('shorts')}
            className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedTarget === 'shorts'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Shorts
          </button>
        </div>

        {/* QR Frame */}
        <div className="flex justify-center my-2">
          <div className="p-4 rounded-lg bg-[#0a0a0a] border border-white/10 shadow-inner">
            <img
              src={qrImageUrl}
              alt={`${current.name} QR Code`}
              className="w-48 h-48 rounded object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="p-3 rounded-md bg-[#0a0a0a] border border-white/10 text-xs font-mono text-zinc-300 break-all select-all">
          {current.url}
        </div>

        <div className="flex items-center gap-3 justify-center pt-2">
          <button
            id="qr-modal-copy-btn"
            onClick={handleCopyCurrent}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-zinc-400" />
                <span>COPY LINK</span>
              </>
            )}
          </button>

          <a
            id="qr-modal-launch-btn"
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-red-600/20 transition-colors cursor-pointer"
          >
            <span>OPEN TARGET</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
