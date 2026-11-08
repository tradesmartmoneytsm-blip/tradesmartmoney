'use client';

import { useState, type ReactNode } from 'react';
import { Wallet, ClipboardList, LineChart, Bell, Plug } from 'lucide-react';

type DockTab = 'portfolio' | 'orders' | 'positions' | 'notifications';

const TABS: { id: DockTab; label: string; icon: ReactNode }[] = [
  { id: 'portfolio', label: 'Portfolio', icon: <Wallet className="h-3.5 w-3.5" /> },
  { id: 'orders', label: 'Orders', icon: <ClipboardList className="h-3.5 w-3.5" /> },
  { id: 'positions', label: 'Positions', icon: <LineChart className="h-3.5 w-3.5" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="h-3.5 w-3.5" /> },
];

/**
 * Bottom dock — Portfolio / Orders / Positions / Notifications.
 * Light chrome matching the site background, independent of the chart
 * appearance dropdown.
 */
export function TerminalBottomDock() {
  const [tab, setTab] = useState<DockTab>('portfolio');

  return (
    <div className="flex h-full flex-col bg-white text-gray-800">
      <div className="flex border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-1.5 text-[11px] font-semibold ${
              tab === t.id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-sm text-gray-700">
          {tab === 'portfolio' && 'Portfolio sync requires a connected broker.'}
          {tab === 'orders' && 'Place and track orders from your broker terminal.'}
          {tab === 'positions' && 'Live positions and MTM appear when your broker is linked.'}
          {tab === 'notifications' && 'Alerts and fills will show here after broker connect.'}
        </p>

        {/* Broker connector — the primary action here, not available yet */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Broker connector coming soon"
            className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1.5 text-xs font-semibold text-white opacity-50"
          >
            <Plug className="h-3.5 w-3.5" />
            Connect Broker
          </button>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
            Coming soon
          </span>
        </div>

        <p className="max-w-md text-xs text-gray-400">
          TradeSmartMoney Terminal is analysis-only (charts, scanner, news).
        </p>
      </div>
    </div>
  );
}