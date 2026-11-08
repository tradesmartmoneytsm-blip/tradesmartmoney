/** Dhan sometimes returns duplicate session timestamps — lightweight-charts requires strict asc order. */
export function sortDedupeCandles<T extends { time: number }>(candles: T[]): T[] {
  const byTime = new Map<number, T>();
  for (const c of candles) {
    if (!Number.isFinite(c.time)) continue;
    byTime.set(c.time, c);
  }
  return [...byTime.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, candle]) => candle);
}
