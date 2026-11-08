'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Palette } from 'lucide-react';
import {
  TERMINAL_THEME_LABELS,
  TERMINAL_THEME_ORDER,
  THEME_UI,
  type TerminalTheme,
} from './theme';

interface TerminalThemeSelectProps {
  theme: TerminalTheme;
  onChange: (theme: TerminalTheme) => void;
}

/**
 * Appearance dropdown for the trading terminal — sits in the chart header
 * and lets the user switch between the available terminal themes.
 */
export function TerminalThemeSelect({ theme, onChange }: TerminalThemeSelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const ui = THEME_UI[theme];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close the dropdown when clicking anywhere outside it.
  useEffect(() => {
    if (!open) return;
    const handleDocClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change appearance"
        title="Appearance"
        className={`inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-semibold ${ui.btnOutline}`}
      >
        <Palette className="h-3 w-3" />
        <span className="max-w-[5.5rem] truncate sm:max-w-none">
          {mounted ? TERMINAL_THEME_LABELS[theme] : 'Theme'}
        </span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Appearance"
          className={`absolute right-0 top-full z-50 mt-1 min-w-[150px] rounded-lg border py-1 shadow-2xl ${ui.panelSub} ${ui.border}`}
        >
          {TERMINAL_THEME_ORDER.map((option) => {
            const active = option === theme;
            return (
              <button
                key={option}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] font-semibold ${ui.hoverRow} ${
                  active ? ui.textStrong : ui.textMuted
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-current ${
                    active ? ui.textStrong : ui.textMuted
                  }`}
                >
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                </span>
                <span className="flex-1">{TERMINAL_THEME_LABELS[option]}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}