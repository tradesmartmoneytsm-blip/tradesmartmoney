/**
 * DEXT Live Scanner index filters (from DEXT `mP` catalog).
 * Stocks mode subscribes with SecId = first segment of KEY (e.g. 19-I-IDX → 19).
 */

export interface DhanLiveScanIndex {
  key: string;
  secId: number;
  label: string;
  /** Maps to `/api/live-scanner?universe=` when using ScanX polling fallback. */
  universe: string;
}

/** Same order/labels as Dhan DEXT F&O Stocks + Nifty baskets dropdown. */
export const DHAN_LIVESCAN_INDICES: DhanLiveScanIndex[] = [
  { key: '311-I-IDX', secId: 311, label: 'F&O Stocks', universe: 'fno' },
  { key: '13-I-IDX', secId: 13, label: 'Nifty 50', universe: 'nifty-50' },
  { key: '25-I-IDX', secId: 25, label: 'Nifty Bank', universe: 'nifty-bank' },
  { key: '27-I-IDX', secId: 27, label: 'Fin Nifty', universe: 'nifty-financial-services' },
  { key: '442-I-IDX', secId: 442, label: 'Nifty Midcap', universe: 'nifty-midcap-100' },
  { key: '38-I-IDX', secId: 38, label: 'Nifty Next 50', universe: 'nifty-next-50' },
  { key: '22-I-IDX', secId: 22, label: 'Nifty Small Cap 50', universe: 'nifty-smallcap-100' },
  { key: '20-I-IDX', secId: 20, label: 'Nifty Mid Cap 50', universe: 'nifty-midcap-150' },
  { key: '17-I-IDX', secId: 17, label: 'NIFTY 100', universe: 'nifty-100' },
  { key: '18-I-IDX', secId: 18, label: 'NIFTY 200', universe: 'nifty-200' },
  { key: '19-I-IDX', secId: 19, label: 'NIFTY 500', universe: 'nifty-500' },
  { key: '37-I-IDX', secId: 37, label: 'NIFTY Midcap 100', universe: 'nifty-midcap-100' },
  { key: '1-I-IDX', secId: 1, label: 'NIFTY Midcap 150', universe: 'nifty-midcap-150' },
  { key: '5-I-IDX', secId: 5, label: 'NIFTY Smallcap 100', universe: 'nifty-smallcap-100' },
  { key: '3-I-IDX', secId: 3, label: 'NIFTY Smallcap 250', universe: 'nifty-smallcap-250' },
  { key: '444-I-IDX', secId: 444, label: 'NIFTY Microcap 250', universe: 'nifty-microcap-250' },
  { key: '14-I-IDX', secId: 14, label: 'NIFTY Auto', universe: 'nifty-auto' },
  { key: '15-I-IDX', secId: 15, label: 'NIFTY Private Bank', universe: 'nifty-private-bank' },
  { key: '28-I-IDX', secId: 28, label: 'NIFTY FMCG', universe: 'nifty-fmcg' },
  { key: '42-I-IDX', secId: 42, label: 'NIFTY Energy', universe: 'nifty-energy' },
  { key: '43-I-IDX', secId: 43, label: 'NIFTY Infra', universe: 'nifty-infrastructure' },
  { key: '29-I-IDX', secId: 29, label: 'Nifty IT', universe: 'nifty-it' },
  { key: '30-I-IDX', secId: 30, label: 'NIFTY Media', universe: 'nifty-media' },
  { key: '31-I-IDX', secId: 31, label: 'NIFTY Metal', universe: 'nifty-metal' },
  { key: '44-I-IDX', secId: 44, label: 'NIFTY MNC', universe: 'nifty-mnc' },
  { key: '32-I-IDX', secId: 32, label: 'NIFTY Pharma', universe: 'nifty-pharma' },
  { key: '33-I-IDX', secId: 33, label: 'NIFTY PSU Bank', universe: 'nifty-psu-bank' },
  { key: '34-I-IDX', secId: 34, label: 'NIFTY Realty', universe: 'nifty-realty' },
  { key: '46-I-IDX', secId: 46, label: 'NIFTY Services Sector', universe: 'nifty-services-sector' },
  { key: '40-I-IDX', secId: 40, label: 'NIFTY Consumption', universe: 'nifty-india-consumption' },
];

/** DEXT default on F&O tab — SecId 311 (F&O Stocks). */
export const DEFAULT_DEXT_FNO_INDEX = DHAN_LIVESCAN_INDICES[0];

/** DEXT default basket on Stocks tab — SecId 19 (NIFTY 500). */
export const DEFAULT_DEXT_STOCKS_INDEX =
  DHAN_LIVESCAN_INDICES.find((i) => i.secId === 19) ?? DHAN_LIVESCAN_INDICES[6];

/** @deprecated Use DEFAULT_DEXT_FNO_INDEX or DEFAULT_DEXT_STOCKS_INDEX. */
export const DEFAULT_DEXT_SCAN_INDEX = DEFAULT_DEXT_FNO_INDEX;

export function resolveLiveScanUniverse(key: string): string {
  return DHAN_LIVESCAN_INDICES.find((i) => i.key === key)?.universe ?? 'fno';
}
