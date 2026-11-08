'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Radio, TrendingDown, TrendingUp } from 'lucide-react';

type Universe = 'nifty-50' | 'nifty-100' | 'nifty-200' | 'nifty-500' | 'fno';

const UNIVERSES: { id: Universe; label: string }[] = [
  { id: 'nifty-50', label: 'NIFTY 50' },
  { id: 'nifty-100', label: 'NIFTY 100' },
  { id: 'nifty-200', label: 'NIFTY 200' },
  { id: 'nifty-500', label: 'NIFTY 500' },
  { id: 'fno', label: 'F&O' },
];

/** Activity kinds, in display order. */
const SCANS: Array<{ key: string; label: string; dir: 'up' | 'down' }> = [
  { key: 'dayHigh', label: 'Day High', dir: 'up' },
  { key: 'dayLow', label: 'Day Low', dir: 'down' },
  { key: 'weekHigh', label: 'Weekly High', dir: 'up' },
  { key: 'weekLow', label: 'Weekly Low', dir: 'down' },
  { key: 'monthHigh', label: 'Monthly High', dir: 'up' },
  { key: 'monthLow', label: 'Monthly Low', dir: 'down' },
  { key: 'yearHigh', label: '52W High', dir: 'up' },
  { key: 'yearLow', label: '52W Low', dir: 'down' },
  { key: 'upperCircuit', label: 'Upper Circuit', dir: 'up' },
  { key: 'lowerCircuit', label: 'Lower Circuit', dir: 'down' },
];

interface Activity {
  key: string;
  symbol: string;
  name: string;
  seoSymbol?: string;
  sid?: number;
  label: string;
  ltp: number;
  dir: 'up' | 'down';
  fresh: boolean;
}

const POLL_MS = 12000;
const MAX_ROWS = 250;

interface LiveActivitiesProps {
  onSelectSymbol?: (symbol: string, seoSymbol?: string, sid?: number) => void;
}

/**
 * Live Activities — realtime single-row feed of stocks hitting
 * day/week/month/52-week highs & lows and circuits, filtered by universe.
 */
export function LiveActivities({ onSelectSymbol }: LiveActivitiesProps) {
  const [universe, setUniverse] = useState<Universe>('nifty-50');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [asOf, setAsOf] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const seenRef = useRef<Set<string>>(new Set());
  const seededRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/live-scanner?universe=${universe}&count=250`, {
        cache: 'no-store',
      });
      const json = await res.json();
      if (!json?.success || !json.scans) return;

      const nextAll: Activity[] = [];
      for (const scan of SCANS) {
        const rows = json.scans[scan.key]?.rows ?? [];
        for (const r of rows) {
          nextAll.push({
            key: `${scan.key}:${r.symbol}`,
            symbol: r.symbol,
            name: r.name,
            seoSymbol: r.seoSymbol,
            sid: r.sid,
            label: scan.label,
            ltp: r.ltp,
            dir: scan.dir,
            fresh: false,
          });
        }
      }

      const nowKeys = new Set(nextAll.map((a) => a.key));
      let combined: Activity[];

      if (!seededRef.current) {
        // First snapshot for this universe — seed without flashing everything.
        combined = nextAll;
        seededRef.current = true;
      } else {
        const fresh = nextAll
          .filter((a) => !seenRef.current.has(a.key))
          .map((a) => ({ ...a, fresh: true }));
        const rest = nextAll.filter((a) => seenRef.current.has(a.key));
        combined = [...fresh, ...rest];
        if (fresh.length && scrollRef.current) {
          scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      seenRef.current = nowKeys;

      setActivities(combined.slice(0, MAX_ROWS));
      setAsOf(json.asOf ?? null);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [universe]);

  useEffect(() => {
    load();
    const id = setInterval(() => {
      if (!document.hidden) load();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  const changeUniverse = (u: Universe) => {
    if (u === universe) return;
    setUniverse(u);
    seenRef.current = new Set();
    seededRef.current = false;
    setActivities([]);
    setLoading(true);
  };

  return (
    <div className="flex h-full flex-col bg-white text-gray-900">
      {/* Header + universe filters */}
      <div className="shrink-0 border-b border-gray-100 px-2 pt-1.5 pb-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="text-[11px] font-bold text-gray-700">Live Activities</span>
          </div>
          {asOf && <span className="text-[10px] tabular-nums text-gray-400">{asOf}</span>}
        </div>

        <div className="mt-1 flex gap-1 overflow-x-auto pb-0.5">
          {UNIVERSES.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => changeUniverse(u.id)}
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                universe === u.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrolling activity feed */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {loading && activities.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-6 text-xs text-gray-400">
            <Radio className="h-4 w-4 animate-pulse" />
            Watching market…
          </div>
        ) : activities.length === 0 ? (
          <div className="py-6 text-center text-xs text-gray-400">
            No live activities right now.
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {activities.map((a) => {
              const up = a.dir === 'up';
              return (
                <li key={a.key}>
                  <button
                    type="button"
                    onClick={() => onSelectSymbol?.(a.symbol, a.seoSymbol, a.sid)}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors hover:bg-blue-50 ${
                      a.fresh ? 'bg-emerald-50/70' : ''
                    }`}
                    title={a.name}
                  >
                    <span
                      className={`relative flex h-1.5 w-1.5 shrink-0 ${
                        a.fresh ? 'animate-pulse' : ''
                      }`}
                    >
                      <span
                        className={`inline-flex h-1.5 w-1.5 rounded-full ${
                          up ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      />
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      <span className="text-xs font-semibold text-gray-900">{a.symbol}</span>
                      <span className="ml-1.5">
                        {up ? (
                          <TrendingUp className="inline h-3 w-3 -translate-y-px text-emerald-600" />
                        ) : (
                          <TrendingDown className="inline h-3 w-3 -translate-y-px text-red-600" />
                        )}
                      </span>
                      <span
                        className={`ml-1.5 text-[10px] font-semibold ${
                          up ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {a.label}
                      </span>
                    </span>
                    <span className="shrink-0 text-[11px] tabular-nums text-gray-600">
                      ₹{a.ltp.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default LiveActivities;