/** Movers scan types (DEXT-style). */
export const MOVER_SCAN_OPTIONS = [
  { id: 'topGainers', label: 'Top Gainers' },
  { id: 'topLosers', label: 'Top Losers' },
  { id: 'mostActiveVolume', label: 'Most Active by Volume' },
  { id: 'mostActiveValue', label: 'Most Active by Value' },
  { id: 'yearHigh', label: '52 Week High' },
  { id: 'yearLow', label: '52 Week Low' },
  { id: 'upperCircuit', label: 'Upper Circuit' },
  { id: 'lowerCircuit', label: 'Lower Circuit' },
] as const;

export type MoverScanId = (typeof MOVER_SCAN_OPTIONS)[number]['id'];

export interface MoverBasketOption {
  id: string;
  label: string;
  group: string;
  /** Index constituents filter; `fno` applies F&O scope instead. */
  seosym?: string;
  fnoScope?: boolean;
}

/** Preset universes — extend at runtime via `/api/movers?baskets=1`. */
export const MOVER_BASKET_PRESETS: MoverBasketOption[] = [
  { id: 'all', label: 'All', group: 'Universe' },
  { id: 'fno', label: 'F&O', group: 'Universe', fnoScope: true },
  { id: 'nifty-50', label: 'Nifty 50', group: 'Benchmark', seosym: 'nifty-50' },
  { id: 'nifty-bank', label: 'Nifty Bank', group: 'Benchmark', seosym: 'nifty-bank' },
  { id: 'nifty-financial-services', label: 'Fin Nifty', group: 'Benchmark', seosym: 'nifty-financial-services' },
  { id: 'nifty-next-50', label: 'Nifty Next 50', group: 'Benchmark', seosym: 'nifty-next-50' },
  { id: 'nifty-100', label: 'NIFTY 100', group: 'Broad', seosym: 'nifty-100' },
  { id: 'nifty-200', label: 'NIFTY 200', group: 'Broad', seosym: 'nifty-200' },
  { id: 'nifty-500', label: 'NIFTY 500', group: 'Broad', seosym: 'nifty-500' },
  { id: 'nifty-midcap-100', label: 'Nifty Midcap 100', group: 'Cap', seosym: 'nifty-midcap-100' },
  { id: 'nifty-midcap-150', label: 'Nifty Midcap 150', group: 'Cap', seosym: 'nifty-midcap-150' },
  { id: 'nifty-smallcap-100', label: 'Nifty Smallcap 100', group: 'Cap', seosym: 'nifty-smallcap-100' },
  { id: 'nifty-smallcap-250', label: 'Nifty Smallcap 250', group: 'Cap', seosym: 'nifty-smallcap-250' },
  { id: 'nifty-microcap-250', label: 'Nifty Microcap 250', group: 'Cap', seosym: 'nifty-microcap-250' },
  { id: 'nifty-auto', label: 'NIFTY Auto', group: 'Sector', seosym: 'nifty-auto' },
  { id: 'nifty-private-bank', label: 'NIFTY Private Bank', group: 'Sector', seosym: 'nifty-private-bank' },
  { id: 'nifty-fmcg', label: 'NIFTY FMCG', group: 'Sector', seosym: 'nifty-fmcg' },
  { id: 'nifty-it', label: 'NIFTY IT', group: 'Sector', seosym: 'nifty-it' },
  { id: 'nifty-pharma', label: 'NIFTY Pharma', group: 'Sector', seosym: 'nifty-pharma' },
  { id: 'nifty-psu-bank', label: 'NIFTY PSU Bank', group: 'Sector', seosym: 'nifty-psu-bank' },
  { id: 'nifty-realty', label: 'NIFTY Realty', group: 'Sector', seosym: 'nifty-realty' },
  { id: 'nifty-metal', label: 'NIFTY Metal', group: 'Sector', seosym: 'nifty-metal' },
  { id: 'nifty-media', label: 'NIFTY Media', group: 'Sector', seosym: 'nifty-media' },
  { id: 'nifty-energy', label: 'NIFTY Energy', group: 'Sector', seosym: 'nifty-energy' },
  { id: 'nifty-oil-and-gas', label: 'NIFTY Oil & Gas', group: 'Sector', seosym: 'nifty-oil-and-gas' },
  { id: 'nifty-healthcare', label: 'NIFTY Healthcare', group: 'Sector', seosym: 'nifty-healthcare' },
  { id: 'nifty-india-consumption', label: 'NIFTY Consumption', group: 'Sector', seosym: 'nifty-india-consumption' },
  { id: 'nifty-infrastructure', label: 'NIFTY Infra', group: 'Sector', seosym: 'nifty-infrastructure' },
  { id: 'nifty-consumer-durable', label: 'NIFTY CONSR DURBL', group: 'Sector', seosym: 'nifty-consumer-durable' },
];
