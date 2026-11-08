'use client';

import { useEffect, useState } from 'react';
import { Tv, X } from 'lucide-react';

/** Zee Business English live TV — official embed endpoint from zeebiz.com. */
const LIVE_TV_EMBED_URL = 'https://www.zeebiz.com/live-tv/embed';

interface ZeeBusinessLiveTVProps {
  /**
   * When true, renders as an inline card (used inside Market Outlook rail)
   * instead of a floating button + slide-in panel.
   */
  isEmbedded?: boolean;
}

/**
 * Zee Business English live TV player.
 * Replaces the old "Live Activities" floating widget.
 */
export function ZeeBusinessLiveTV({ isEmbedded = false }: ZeeBusinessLiveTVProps) {
  const [isOpen, setIsOpen] = useState(isEmbedded);

  // Close the slide-in panel on Escape.
  useEffect(() => {
    if (isEmbedded) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) setIsOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isEmbedded, isOpen]);

  const player = (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <iframe
        src={LIVE_TV_EMBED_URL}
        className="absolute inset-0 h-full w-full border-0"
        title="Zee Business English — Live TV"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );

  const header = (
    <div
      className={`flex items-center justify-between bg-gradient-to-r from-red-600 to-blue-600 text-white ${
        isEmbedded ? 'px-3 py-2' : 'px-4 py-3'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Tv className={isEmbedded ? 'h-4 w-4' : 'h-5 w-5'} />
        <div>
          <h2 className={`font-bold leading-tight ${isEmbedded ? 'text-xs' : 'text-base'}`}>
            Zee Business English
          </h2>
          <p className={`text-white/80 ${isEmbedded ? 'text-[10px]' : 'text-xs'}`}>
            Live TV · Markets &amp; Business News
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          Live
        </span>
        {!isEmbedded && (
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded p-1.5 transition-colors hover:bg-white/15"
            title="Close live TV"
            aria-label="Close live TV"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );

  // Embedded card (Market Outlook rail).
  if (isEmbedded) {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {header}
        {player}
      </div>
    );
  }

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-32 z-40 md:right-32 sm:right-28">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative rounded-full bg-red-600 p-4 text-white shadow-lg transition-all duration-200 hover:bg-red-700 hover:shadow-xl"
          title="Watch Zee Business English live"
          aria-label="Zee Business English live TV"
        >
          <Tv className="h-6 w-6 transition-transform group-hover:scale-110" />
          <span className="absolute -right-1 -top-1 flex h-5 items-center rounded-full bg-white px-1 text-[9px] font-extrabold text-red-600 shadow">
            LIVE
          </span>
        </button>
      </div>

      {/* Slide-in panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="animate-slide-in-right fixed top-0 right-0 z-50 flex h-full w-[26rem] max-w-[92vw] flex-col overflow-hidden bg-white shadow-2xl">
            {header}

            <div className="flex flex-col gap-3 p-4">
              {player}
              <p className="text-xs text-gray-500">
                Zee Business English — live share market, business &amp; economy news.
                Streamed from Zee Business.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ZeeBusinessLiveTV;