'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DEFAULT_DEXT_STOCKS_INDEX,
  DHAN_LIVESCAN_INDICES,
  resolveLiveScanUniverse,
} from '@/lib/dhan-livescan-indices';
import { highlightForScanKey } from '@/lib/dhan-livescan-highlights';
import type { NormalizedStock } from '@/lib/dhan-scanx';

type Segment = 'stocks' | 'fno' | 'commodity';

const SEGMENTS: { id: Segment; label: string }[] = [
  { id: 'stocks', label: 'Stocks' },
  { id: 'fno', label: 'F&O' },
  { id: 'commodity', label: 'Commodity' },
];

const SCANS = [
  'dayHigh',
  'dayLow',
  'weekHigh',
  'weekLow',
  'monthHigh',
  'monthLow',
  'yearHigh',
  'yearLow',
  'upperCircuit',
  'lowerCircuit',
] as const;

interface Activity {
  id: string;
  symbol: string;
  name: string;
  seoSymbol?: string;
  sid?: number;
  highlight: string;
  bullish: boolean;
  ltp: number;
  volume: number;
  time: Date;
  fresh: boolean;
}

const POLL_MS = 12_000;
const MAX_ROWS = 250;
const FETCH_COUNT = 100;

const STOCK_INDICES = DHAN_LIVESCAN_INDICES.filter((i) => i.secId !== 311);

function formatVolume(volume: number): string {
  if (!Number.isFinite(volume) || volume <= 0) return '—';
  if (volume >= 1_00_00_000) return `${(volume / 1_00_00_000).toFixed(2)} Cr`;
  if (volume >= 1_00_000) return `${(volume / 1_00_000).toFixed(2)} L`;
  if (volume >= 1_000) return `${(volume / 1_000).toFixed(2)} K`;
  return String(Math.round(volume));
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
}

interface LiveActivitiesProps {
  selectedSymbol?: string;
  onSelectSymbol?: (symbol: string, seoSymbol?: string, sid?: number) => void;
}

/** DEXT Live Scanner UI — ScanX polling until optional Dhan JWT WebSocket proxy exists. */
export function LiveActivities({ selectedSymbol, onSelectSymbol }: LiveActivitiesProps) {
  const [segment, setSegment] = useState<Segment>('fno');
  const [indexKey, setIndexKey] = useState(DEFAULT_DEXT_STOCKS_INDEX.key);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [asOf, setAsOf] = useState<string | null>(null);
  const snapRef = useRef<Map<string, { ltp: number }>>(new Map());
  const seededRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const universe = useMemo(() => {
    if (segment === 'fno') return 'fno';
    if (segment === 'commodity') return 'all';
    return resolveLiveScanUniverse(indexKey);
  }, [segment, indexKey]);

  const indexLabel = useMemo(() => {
    if (segment === 'fno') return 'F&O Stocks';
    if (segment === 'commodity') return 'Commodity';
    return DHAN_LIVESCAN_INDICES.find((i) => i.key === indexKey)?.label ?? indexKey;
  }, [segment, indexKey]);

  const load = useCallback(async () => {
    if (segment === 'commodity') {
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/live-scanner?universe=${universe}&count=${FETCH_COUNT}`, {
        cache: 'no-store',
      });
      const json = await res.json();
      if (!json?.success || !json.scans) return;
      setAsOf(json.asOf ?? null);

      const now = new Date();
      const prev = snapRef.current;
      const nextSnap = new Map<string, { ltp: number }>();
      const fresh: Activity[] = [];
      const seed: Activity[] = [];

      for (const scanKey of SCANS) {
        const meta = highlightForScanKey(scanKey);
        const rows: NormalizedStock[] = json.scans[scanKey]?.rows ?? [];
        for (const r of rows) {
          const snapKey = `${scanKey}:${r.symbol}`;
          nextSnap.set(snapKey, { ltp: r.ltp });
          const base: Omit<Activity, 'fresh' | 'id' | 'time'> = {
            symbol: r.symbol,
            name: r.name || r.symbol,
            seoSymbol: r.seoSymbol,
            sid: r.sid,
            highlight: meta.highlight,
            bullish: meta.bullish,
            ltp: r.ltp,
            volume: r.volume,
          };
          if (!seededRef.current) {
            seed.push({
              ...base,
              id: `seed:${snapKey}`,
              time: now,
              fresh: false,
            });
          } else {
            const old = prev.get(snapKey);
            if (!old || old.ltp !== r.ltp) {
              fresh.push({
                ...base,
                id: `${snapKey}:${now.getTime()}`,
                time: now,
                fresh: true,
              });
            }
          }
        }
      }

      snapRef.current = nextSnap;

      if (!seededRef.current) {
        seededRef.current = true;
        setActivities(seed.slice(0, MAX_ROWS));
      } else if (fresh.length) {
        setActivities((cur) =>
          [...fresh, ...cur.map((a) => ({ ...a, fresh: false }))].slice(0, MAX_ROWS),
        );
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [universe, segment]);

  useEffect(() => {
    snapRef.current = new Map();
    seededRef.current = false;
    setActivities([]);
    setLoading(true);
    void load();
  }, [universe, segment, load]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) void load();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  const selectClass =
    'w-full min-w-0 cursor-pointer appearance-none truncate rounded border border-gray-200 bg-gray-50 px-2 py-1 pr-7 text-[10px] font-semibold text-gray-800 focus:border-blue-400 focus:outline-none';

  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-gray-900">
      <div className="shrink-0 space-y-1 border-b border-gray-100 px-2 py-1.5">
        <div className="flex gap-1">
          {SEGMENTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSegment(s.id)}
              className={`flex-1 rounded-md px-2 py-1 text-[10px] font-bold ${
                segment === s.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {segment === 'stocks' && (
          <div className="relative">
            <select
              aria-label="Index basket"
              className={selectClass}
              value={indexKey}
              onChange={(e) => setIndexKey(e.target.value)}
            >
              {STOCK_INDICES.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
          </div>
        )}

        {segment === 'fno' && (
          <p className="text-[10px] font-semibold text-gray-500">Universe: F&O Stocks</p>
        )}
        {segment === 'commodity' && (
          <p className="text-[10px] text-amber-700">Commodity live scans — coming soon.</p>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-50 px-2 py-0.5 text-[9px] text-gray-400">
        <span className="truncate">{indexLabel}</span>
        <span className="shrink-0 tabular-nums">{asOf ? `Feed ${asOf}` : 'ScanX polling'}</span>
      </div>

      <div className="grid shrink-0 grid-cols-[minmax(0,1.15fr)_minmax(0,1.35fr)_auto_auto_auto] gap-1 border-b border-gray-100 bg-gray-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-gray-500">
        <span>Symbol</span>
        <span>Highlight</span>
        <span className="text-right">LTP</span>
        <span className="text-right">Vol</span>
        <span className="text-right">Time</span>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {loading && activities.length === 0 && (
          <p className="p-4 text-center text-xs text-gray-400">Loading live scanner…</p>
        )}
        {segment === 'commodity' && (
          <p className="p-4 text-center text-xs text-gray-400">Commodity requires DEXT commodity WS.</p>
        )}
        {!loading && segment !== 'commodity' && activities.length === 0 && (
          <p className="p-4 text-center text-xs text-gray-400">No live highlights in {indexLabel}.</p>
        )}
        {activities.map((a) => {
          const active = selectedSymbol === a.symbol;
          return (
            <button
              key={a.id}
              type="button"
              title={a.name}
              onClick={() => onSelectSymbol?.(a.symbol, a.seoSymbol, a.sid)}
              className={`grid w-full grid-cols-[minmax(0,1.15fr)_minmax(0,1.35fr)_auto_auto_auto] gap-1 border-b border-gray-50 px-2 py-1.5 text-left text-xs hover:bg-blue-50 ${
                a.fresh ? 'bg-emerald-50/60' : ''
              } ${active ? 'bg-blue-50' : ''}`}
            >
              <span className="truncate font-semibold text-gray-900">{a.name}</span>
              <span
                className={`truncate text-[10px] font-semibold ${
                  a.bullish ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {a.highlight}
              </span>
              <span className="text-right tabular-nums text-[11px] text-gray-800">
                {a.ltp.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
              <span className="text-right text-[10px] tabular-nums text-gray-500">{formatVolume(a.volume)}</span>
              <span className="text-right text-[10px] tabular-nums text-gray-400">{formatTime(a.time)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LiveActivities;
