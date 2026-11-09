/**
 * DEXT Live Scanner catalogs captured from `main-*.js` (Nov 2025).
 * Used for WS subscribe IDs and future F&O / commodity parity — not required for ScanX polling.
 */

/** F&O segment underlyings (`fP` in DEXT). Subscribe: type=2, SegId=0, SecId=[secId]. */
export const DHAN_LIVESCAN_FNO_UNDERLYINGS = [
  { id: 'nifty', name: 'Nifty 50', secId: 13, segId: 0 },
  { id: 'banknifty', name: 'Nifty Bank', secId: 25, segId: 0 },
  { id: 'sensex', name: 'Sensex', secId: 51, segId: 0 },
  { id: 'bankex', name: 'Bankex', secId: 69, segId: 0 },
  { id: 'finnifty', name: 'Fin Nifty', secId: 27, segId: 0 },
  { id: 'midcpnifty', name: 'Nifty Midcap', secId: 442, segId: 0 },
] as const;

/** Commodity segment contracts (`yP` in DEXT). Subscribe: type=2, SegId=5, SecId=[secId]. */
export const DHAN_LIVESCAN_COMMODITIES = [
  { id: 'crudeoil', name: 'Crude Oil', secId: 294, segId: 5 },
  { id: 'crudeoilmini', name: 'Crude Oil Mini', secId: 556, segId: 5 },
  { id: 'naturalgas', name: 'Natural Gas', secId: 401, segId: 5 },
  { id: 'naturalgasmini', name: 'Natural Gas Mini', secId: 596, segId: 5 },
  { id: 'zinc', name: 'Zinc', secId: 378, segId: 5 },
  { id: 'zincmini', name: 'Zinc Mini', secId: 501, segId: 5 },
  { id: 'aluminium', name: 'Aluminium', secId: 358, segId: 5 },
  { id: 'gold', name: 'Gold', secId: 114, segId: 5 },
  { id: 'goldmini', name: 'Gold Mini', secId: 117, segId: 5 },
  { id: 'silver', name: 'Silver', secId: 115, segId: 5 },
  { id: 'silvermini', name: 'Silver Mini', secId: 122, segId: 5 },
] as const;

/** F&O live highlights (`av` in DEXT) — msgCode 300–304, flag discriminates variant. */
export const DHAN_LIVESCAN_FNO_EVENTS = [
  { id: 'long_buildup', name: 'Long Buildup', msgCode: 301, flag: 'A', bullish: true },
  { id: 'short_buildup', name: 'Short Buildup', msgCode: 301, flag: 'B', bullish: false },
  { id: 'long_unwinding', name: 'Long Unwinding', msgCode: 301, flag: 'C', bullish: false },
  { id: 'short_covering', name: 'Short Covering', msgCode: 301, flag: 'D', bullish: true },
  { id: 'maxpain_shift_up', name: 'Max Pain Shift Up', msgCode: 300, flag: 'U', bullish: true },
  { id: 'maxpain_shift_down', name: 'Max Pain Shift Down', msgCode: 300, flag: 'D', bullish: false },
  { id: 'premium', name: 'Premium', msgCode: 304, flag: 'P', bullish: true },
  { id: 'discount', name: 'Discount', msgCode: 304, flag: 'D', bullish: false },
  { id: 'r1_breakout', name: 'R1 Breakout', msgCode: 302, flag: '1', bullish: true },
  { id: 'r2_breakout', name: 'R2 Breakout', msgCode: 302, flag: '2', bullish: true },
  { id: 'r3_breakout', name: 'R3 Breakout', msgCode: 302, flag: '3', bullish: true },
  { id: 's1_breakdown', name: 'S1 Breakdown', msgCode: 303, flag: '1', bullish: false },
  { id: 's2_breakdown', name: 'S2 Breakdown', msgCode: 303, flag: '2', bullish: false },
  { id: 's3_breakdown', name: 'S3 Breakdown', msgCode: 303, flag: '3', bullish: false },
] as const;

/** Equity feed msg codes (stocks segment, type=0). */
export const DHAN_LIVESCAN_EQUITY_MSG = {
  highLow: 100,
  circuit: 101,
  pivot: 102,
  unusualVolume: 106,
  near52Week: 139,
  liveOther: 140,
} as const;
