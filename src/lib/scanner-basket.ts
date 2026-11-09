import { fetchIndexConstituents, constituentSymbols } from '@/lib/dhan-index-constituents';
import type { NormalizedStock } from '@/lib/dhan-scanx';
import type { MoverBasketOption } from '@/lib/movers-filters';

export const SCANNER_BASKET_OPTIONS: MoverBasketOption[] = [
  { id: 'all', label: 'All market', group: 'Universe' },
  { id: 'fno', label: 'F&O', group: 'Universe', fnoScope: true },
  { id: 'nifty-50', label: 'Nifty 50', group: 'Index', seosym: 'nifty-50' },
  { id: 'nifty-100', label: 'Nifty 100', group: 'Index', seosym: 'nifty-100' },
  { id: 'nifty-200', label: 'Nifty 200', group: 'Index', seosym: 'nifty-200' },
  { id: 'nifty-500', label: 'Nifty 500', group: 'Index', seosym: 'nifty-500' },
];

export function resolveScannerBasket(basketId: string): {
  preset: MoverBasketOption | null;
  scope: 'all' | 'fno';
  seosym?: string;
} {
  const preset =
    SCANNER_BASKET_OPTIONS.find((p) => p.id === basketId) ??
  (basketId !== 'all'
      ? { id: basketId, label: basketId, group: 'Custom', seosym: basketId }
      : null);

  const scope: 'all' | 'fno' = preset?.fnoScope ? 'fno' : 'all';
  return { preset, scope, seosym: preset?.seosym };
}

export async function filterStocksByBasket(
  rows: NormalizedStock[],
  seosym: string | undefined,
  limit: number,
): Promise<NormalizedStock[]> {
  if (!seosym) {
    return rows.slice(0, limit);
  }
  const constituents = await fetchIndexConstituents(seosym);
  const symbols = constituentSymbols(constituents);
  return rows.filter((r) => symbols.has(r.symbol.toUpperCase())).slice(0, limit);
}
