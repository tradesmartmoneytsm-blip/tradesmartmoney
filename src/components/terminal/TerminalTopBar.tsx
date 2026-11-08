'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Circle } from 'lucide-react';

interface MarketIndex {
  name: string;
  displayName: string;
  current: number;
  change: number;
  changePercent: number;
}

/** Terminal top bar (standalone mode) — light chrome matching the site. */
export function TerminalTopBar() {
  const [time, setTime] = useState('');
  const [marketOpen, setMarketOpen] = useState(false);
  const [indices, setIndices] = useState<MarketIndex[]>([]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      );
      const day = now.getDay();
      const isWeekday = day >= 1 && day <= 5;
      const mins = now.getHours() * 60 + now.getMinutes();
      const open = isWeekday && mins >= 9 * 60 + 15 && mins <= 15 * 60 + 30;
      setMarketOpen(open);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/market-indices');
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setIndices(data.data.slice(0, 4));
        }
      } catch {
        /* ignore */
      }
    };
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex h-11 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-3 text-gray-900">
      <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight">
        <span className="rounded bg-emerald-600/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">TSM</span>
        <span className="hidden sm:inline">Trading Terminal</span>
      </Link>

      <Link
        href="/"
        className="hidden items-center gap-1 rounded px-2 py-1 text-[11px] text-gray-500 hover:bg-gray-100 hover:text-gray-700 sm:flex"
      >
        <Home className="h-3.5 w-3.5" />
        Home
      </Link>

      <div className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto text-[11px] tabular-nums">
        {indices.map((idx) => {
          const up = idx.changePercent >= 0;
          return (
            <div key={idx.name} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
              <span className="text-gray-500">{idx.displayName || idx.name}</span>
              <span className="font-medium text-gray-900">
                {idx.current.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
              <span className={up ? 'text-green-600' : 'text-red-600'}>
                {up ? '+' : ''}
                {idx.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-2 text-[11px]">
        <span className="flex items-center gap-1 text-gray-500">
          <Circle
            className={`h-2 w-2 fill-current ${marketOpen ? 'text-green-600' : 'text-gray-300'}`}
          />
          {marketOpen ? 'Market open' : 'Market closed'}
        </span>
        <span className="font-mono text-gray-600">{time} IST</span>
      </div>
    </header>
  );
}