/**
 * Appearance themes for the trading terminal.
 * The terminal renders standalone or embedded in the site layout, and users
 * pick an appearance from a dropdown in the chart header.
 */
export type TerminalTheme = 'light' | 'dark' | 'vscode';

/** Dropdown order. */
export const TERMINAL_THEME_ORDER: TerminalTheme[] = ['dark', 'light', 'vscode'];

export const TERMINAL_THEME_LABELS: Record<TerminalTheme, string> = {
  dark: 'Dark',
  light: 'Light',
  vscode: 'VSCode C++',
};

/** Preview swatch colors for the appearance dropdown. */
export const TERMINAL_THEME_SWATCH: Record<TerminalTheme, string> = {
  dark: '#0b0e14',
  light: '#ffffff',
  vscode: '#1e1e1e',
};

export const TERMINAL_THEME_STORAGE_KEY = 'tsm-terminal-theme';

export function isTerminalTheme(value: string | null): value is TerminalTheme {
  return value === 'dark' || value === 'light' || value === 'vscode';
}

export function readStoredTerminalTheme(): TerminalTheme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = window.localStorage.getItem(TERMINAL_THEME_STORAGE_KEY);
    return isTerminalTheme(saved) ? saved : 'dark';
  } catch {
    return 'dark';
  }
}

export function persistTerminalTheme(theme: TerminalTheme): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(TERMINAL_THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore quota / privacy errors */
  }
}

/**
 * Tailwind class tokens per theme, shared by all terminal panels so every
 * surface (chart, watchlist, rails, dock, menus) stays consistent.
 * All values must be static class strings so Tailwind can discover them.
 */
export interface TerminalThemeUi {
  /** Main panel background + base text (chart column, headers). */
  panel: string;
  /** Background-only variant (solid) for error boxes. */
  panelBg: string;
  /** Translucent background for loading overlays. */
  overlay: string;
  /** Secondary panels (watchlist, rails, dock) background + base text. */
  panelSub: string;
  border: string;
  borderSoft: string;
  textStrong: string;
  textMuted: string;
  textFaint: string;
  hoverRow: string;
  rowActiveBg: string;
  hoverText: string;
  inputBg: string;
  inputPlaceholder: string;
  accentText: string;
  accentHover: string;
  tabUnderline: string;
  /** Selected pill (active interval button). */
  btnActive: string;
  btnIdle: string;
  btnOutline: string;
}

export const THEME_UI: Record<TerminalTheme, TerminalThemeUi> = {
  dark: {
    panel: 'bg-[#0b0e14] text-zinc-100',
    panelBg: 'bg-[#0b0e14]',
    overlay: 'bg-[#0b0e14]/80',
    panelSub: 'bg-[#12151c] text-zinc-100',
    border: 'border-zinc-800',
    borderSoft: 'border-zinc-800/70',
    textStrong: 'text-zinc-200',
    textMuted: 'text-zinc-400',
    textFaint: 'text-zinc-500',
    hoverRow: 'hover:bg-zinc-800',
    rowActiveBg: 'bg-zinc-800',
    hoverText: 'hover:text-zinc-200',
    inputBg: 'bg-zinc-900',
    inputPlaceholder: 'placeholder:text-zinc-600',
    accentText: 'text-emerald-400',
    accentHover: 'hover:text-emerald-300',
    tabUnderline: 'border-emerald-500',
    btnActive: 'bg-emerald-600 text-white',
    btnIdle: 'bg-zinc-800 text-zinc-400 hover:text-zinc-200',
    btnOutline: 'border-zinc-700 text-zinc-400 hover:text-emerald-400',
  },
  light: {
    panel: 'bg-white text-zinc-900',
    panelBg: 'bg-white',
    overlay: 'bg-white/80',
    panelSub: 'bg-white text-zinc-900',
    border: 'border-zinc-200',
    borderSoft: 'border-zinc-100',
    textStrong: 'text-zinc-900',
    textMuted: 'text-zinc-600',
    textFaint: 'text-zinc-500',
    hoverRow: 'hover:bg-zinc-100',
    rowActiveBg: 'bg-zinc-100',
    hoverText: 'hover:text-zinc-700',
    inputBg: 'bg-zinc-50',
    inputPlaceholder: 'placeholder:text-zinc-400',
    accentText: 'text-emerald-600',
    accentHover: 'hover:text-emerald-500',
    tabUnderline: 'border-emerald-500',
    btnActive: 'bg-emerald-600 text-white',
    btnIdle: 'bg-zinc-100 text-zinc-600 hover:text-zinc-800',
    btnOutline: 'border-zinc-300 text-zinc-500 hover:text-emerald-600',
  },
  /**
   * VS Code Dark+ (C++): editor #1e1e1e, side bar #252526, borders #3c3c3c,
   * accent #007acc, and C++ syntax colors — types teal #4ec9b0 for up
   * candles, error red #f14c4c for down.
   */
  vscode: {
    panel: 'bg-[#1e1e1e] text-[#cccccc]',
    panelBg: 'bg-[#1e1e1e]',
    overlay: 'bg-[#1e1e1e]/85',
    panelSub: 'bg-[#252526] text-[#cccccc]',
    border: 'border-[#3c3c3c]',
    borderSoft: 'border-[#2a2a2a]',
    textStrong: 'text-[#e7e7e7]',
    textMuted: 'text-[#a8a8a8]',
    textFaint: 'text-[#808080]',
    hoverRow: 'hover:bg-[#2a2d2e]',
    rowActiveBg: 'bg-[#37373d]',
    hoverText: 'hover:text-[#d4d4d4]',
    inputBg: 'bg-[#3c3c3c]',
    inputPlaceholder: 'placeholder:text-[#6a6a6a]',
    accentText: 'text-[#4ec9b0]',
    accentHover: 'hover:text-[#5fd3bd]',
    tabUnderline: 'border-[#007acc]',
    btnActive: 'bg-[#007acc] text-white',
    btnIdle: 'bg-[#2d2d2d] text-[#a8a8a8] hover:text-[#d4d4d4]',
    btnOutline: 'border-[#3c3c3c] text-[#a8a8a8] hover:text-[#569cd6]',
  },
};