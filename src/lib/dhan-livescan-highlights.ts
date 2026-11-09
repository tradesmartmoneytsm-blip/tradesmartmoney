/**
 * DEXT highlight labels for ScanX scan keys (equity path msg code 100 in DEXT).
 * @see determineScannerType in DEXT liveScannerService
 */

export const LIVESCAN_SCAN_META: Record<
  string,
  { highlight: string; bullish: boolean }
> = {
  dayHigh: { highlight: 'On Day High', bullish: true },
  dayLow: { highlight: 'On Day Low', bullish: false },
  weekHigh: { highlight: 'On Weekly High', bullish: true },
  weekLow: { highlight: 'On Weekly Low', bullish: false },
  monthHigh: { highlight: 'On Monthly High', bullish: true },
  monthLow: { highlight: 'On Monthly Low', bullish: false },
  yearHigh: { highlight: 'On 52 Week High', bullish: true },
  yearLow: { highlight: 'On 52 Week Low', bullish: false },
  upperCircuit: { highlight: 'Upper Circuit Break', bullish: true },
  lowerCircuit: { highlight: 'Lower Circuit Break', bullish: false },
};

export function highlightForScanKey(scanKey: string): { highlight: string; bullish: boolean } {
  return (
    LIVESCAN_SCAN_META[scanKey] ?? {
      highlight: scanKey,
      bullish: true,
    }
  );
}
