export interface DailyCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type TrendlinePatternType = 'breakout' | 'breakdown';

export interface TrendlineOverlay {
  type: TrendlinePatternType;
  startTime: number;
  startPrice: number;
  endTime: number;
  endPrice: number;
  signalTime: number;
  signalPrice: number;
  lines: PatternStructureLine[];
  levels: PatternStructureLevel[];
}

export interface TrendlinePatternMatch {
  type: TrendlinePatternType;
  price: number;
  trendline: TrendlineOverlay;
}

export interface PatternStructureLine {
  kind: 'descending-resistance' | 'rising-support';
  startTime: number;
  startPrice: number;
  endTime: number;
  endPrice: number;
}

export interface PatternStructureLevel {
  kind: 'support' | 'resistance';
  price: number;
}

interface Pivot {
  index: number;
  price: number;
}

const PIVOT_WIDTH = 3;
const LOOKBACK_BARS = 100;
const MIN_PIVOT_GAP = 12;
const MIN_BARS_AFTER_PIVOT = 5;
const MIN_TREND_CHANGE = 0.01;
const CROSS_BUFFER = 0.003;
const MIN_BREAK_DISTANCE = 0.005;
const TOUCH_TOLERANCE = 0.01;
const WICK_TOLERANCE = 0.01;
const LINE_EXTENSION_BARS = 12;

function getPivots(candles: DailyCandle[], side: 'high' | 'low'): Pivot[] {
  const pivots: Pivot[] = [];
  const start = Math.max(PIVOT_WIDTH, candles.length - LOOKBACK_BARS);
  const end = candles.length - PIVOT_WIDTH;

  for (let i = start; i < end; i += 1) {
    const price = side === 'high' ? candles[i].high : candles[i].low;
    let isPivot = true;

    for (let offset = 1; offset <= PIVOT_WIDTH; offset += 1) {
      const before = side === 'high' ? candles[i - offset].high : candles[i - offset].low;
      const after = side === 'high' ? candles[i + offset].high : candles[i + offset].low;
      if (side === 'high' ? price < before || price < after : price > before || price > after) {
        isPivot = false;
        break;
      }
    }

    if (isPivot) pivots.push({ index: i, price });
  }

  return pivots;
}

function linePrice(slope: number, intercept: number, index: number): number {
  return slope * index + intercept;
}

interface TrendlineCandidate {
  start: Pivot;
  end: Pivot;
  slope: number;
  intercept: number;
  score: number;
  touches: number;
  lastTouchIndex: number;
}

/**
 * Find straight lines through actual outer swing pivots. Any candidate whose
 * other pivot highs/lows or intervening wicks pierce the boundary is rejected.
 */
function findOuterLines(
  candles: DailyCandle[],
  pivots: Pivot[],
  direction: TrendlinePatternType,
  endIndex: number,
): TrendlineCandidate[] {
  const currentIndex = candles.length - 1;
  const candidates: TrendlineCandidate[] = [];

  for (let leftIndex = 0; leftIndex < pivots.length - 1; leftIndex += 1) {
    const left = pivots[leftIndex];
    for (let rightIndex = leftIndex + 1; rightIndex < pivots.length; rightIndex += 1) {
      const right = pivots[rightIndex];
      if (
        right.index - left.index < MIN_PIVOT_GAP ||
        right.index > endIndex ||
        endIndex - right.index < MIN_BARS_AFTER_PIVOT
      ) continue;

      const slope = (right.price - left.price) / (right.index - left.index);
      const trendChange = (right.price - left.price) / left.price;
      if (direction === 'breakout'
        ? trendChange > -MIN_TREND_CHANGE
        : trendChange < MIN_TREND_CHANGE) continue;

      const relevantPivots = pivots.filter(
        (pivot) => pivot.index >= left.index && pivot.index <= endIndex,
      );
      if (relevantPivots.length < 2) continue;

      // Keep the line exactly on the selected outer swing highs/lows. Reject
      // pairs that would put any other confirmed pivot outside that boundary.
      const intercept = left.price - slope * left.index;
      const isOuterBoundary = relevantPivots.every((pivot) => {
        const value = linePrice(slope, intercept, pivot.index);
        return direction === 'breakout'
          ? pivot.price <= value * (1 + TOUCH_TOLERANCE)
          : pivot.price >= value * (1 - TOUCH_TOLERANCE);
      });
      if (!isOuterBoundary) continue;

      const contacts = relevantPivots.filter((pivot) => {
        const value = linePrice(slope, intercept, pivot.index);
        return Math.abs(pivot.price - value) / value <= TOUCH_TOLERANCE;
      });
      if (contacts.length < 2) continue;

      const start = left;
      const end = right;
      const lastContact = contacts[contacts.length - 1];
      if (end.index - start.index < MIN_PIVOT_GAP) continue;

      let pierced = false;
      for (let index = start.index + 1; index <= endIndex; index += 1) {
        const value = linePrice(slope, intercept, index);
        if (direction === 'breakout' && candles[index].high > value * (1 + WICK_TOLERANCE)) {
          pierced = true;
          break;
        }
        if (direction === 'breakdown' && candles[index].low < value * (1 - WICK_TOLERANCE)) {
          pierced = true;
          break;
        }
      }
      if (pierced) continue;

      const span = end.index - start.index;
      const age = currentIndex - lastContact.index;
      const score = span * 0.5 + contacts.length * 60 - age * 1.5;
      candidates.push({
        start,
        end,
        slope,
        intercept,
        score,
        touches: contacts.length,
        lastTouchIndex: lastContact.index,
      });
    }
  }

  return candidates.sort((a, b) => b.score - a.score);
}

function findFreshCross(
  candles: DailyCandle[],
  pivots: Pivot[],
  direction: TrendlinePatternType,
): TrendlineCandidate | null {
  const previousIndex = candles.length - 2;
  const currentIndex = candles.length - 1;
  const previousClose = candles[previousIndex].close;
  const currentClose = candles[currentIndex].close;
  let best: TrendlineCandidate | null = null;

  for (const candidate of findOuterLines(candles, pivots, direction, previousIndex)) {
    const priorLine = linePrice(candidate.slope, candidate.intercept, previousIndex);
    const lineNow = linePrice(candidate.slope, candidate.intercept, currentIndex);
    if (![priorLine, lineNow].every((value) => Number.isFinite(value) && value > 0)) continue;

    const crossed = direction === 'breakout'
      ? previousClose <= priorLine * (1 + CROSS_BUFFER) &&
        currentClose > lineNow * (1 + MIN_BREAK_DISTANCE)
      : previousClose >= priorLine * (1 - CROSS_BUFFER) &&
        currentClose < lineNow * (1 - MIN_BREAK_DISTANCE);
    if (!crossed) continue;

    const distanceFromLine = Math.abs(currentClose - lineNow) / lineNow;
    const score = candidate.score - distanceFromLine * 100;
    if (!best || score > best.score) best = { ...candidate, score };
  }

  return best;
}

function toStructureLine(
  candidate: TrendlineCandidate,
  kind: PatternStructureLine['kind'],
  candles: DailyCandle[],
): PatternStructureLine {
  const currentIndex = candles.length - 1;
  const futureIndex = currentIndex + LINE_EXTENSION_BARS;
  return {
    kind,
    startTime: candles[candidate.start.index].time,
    startPrice: linePrice(candidate.slope, candidate.intercept, candidate.start.index),
    endTime: candles[currentIndex].time + LINE_EXTENSION_BARS * 24 * 60 * 60,
    endPrice: linePrice(candidate.slope, candidate.intercept, futureIndex),
  };
}

function findHorizontalLevels(
  pivots: Pivot[],
  currentPrice: number,
  kind: PatternStructureLevel['kind'],
): PatternStructureLevel[] {
  const candidates: Array<{ price: number; score: number; distance: number }> = [];

  for (const pivot of pivots) {
    const isOnRelevantSide = kind === 'support'
      ? pivot.price < currentPrice
      : pivot.price > currentPrice;
    if (!isOnRelevantSide) continue;

    const contacts = pivots.filter(
      (other) => Math.abs(other.price - pivot.price) / pivot.price <= 0.015,
    );
    if (contacts.length < 2) continue;
    const indexes = contacts.map((contact) => contact.index);
    if (Math.max(...indexes) - Math.min(...indexes) < 6) continue;

    const price = contacts.reduce((sum, contact) => sum + contact.price, 0) / contacts.length;
    const distance = Math.abs(price - currentPrice) / currentPrice;
    if (distance > 0.2) continue;
    candidates.push({ price, score: contacts.length * 10 - distance * 100, distance });
  }

  candidates.sort((a, b) => a.distance - b.distance || b.score - a.score);
  const levels: PatternStructureLevel[] = [];
  for (const candidate of candidates) {
    if (levels.some((level) => Math.abs(level.price - candidate.price) / candidate.price <= 0.015)) {
      continue;
    }
    levels.push({ kind, price: candidate.price });
    if (levels.length === 2) break;
  }
  return levels;
}

/**
 * Detect a fresh cross of a broad, confirmed swing trendline. The last candle
 * is live, so an intraday signal may disappear if price crosses back before
 * the session closes.
 */
export function detectTrendlinePattern(candles: DailyCandle[]): TrendlinePatternMatch | null {
  if (candles.length < 20) return null;

  const previousClose = candles[candles.length - 2].close;
  const currentIndex = candles.length - 1;
  const currentClose = candles[currentIndex].close;

  if (![previousClose, currentClose].every((price) => Number.isFinite(price) && price > 0)) {
    return null;
  }

  const resistancePivots = getPivots(candles, 'high');
  const supportPivots = getPivots(candles, 'low');
  const breakout = findFreshCross(candles, resistancePivots, 'breakout');
  const breakdown = findFreshCross(candles, supportPivots, 'breakdown');
  if (!breakout && !breakdown) return null;

  const type: TrendlinePatternType = breakout ? 'breakout' : 'breakdown';
  const primary = breakout ?? breakdown!;
  const opposite = breakout
    ? findOuterLines(candles, supportPivots, 'breakdown', currentIndex)[0]
    : findOuterLines(candles, resistancePivots, 'breakout', currentIndex)[0];
  const lines = [
    toStructureLine(primary, breakout ? 'descending-resistance' : 'rising-support', candles),
  ];
  if (opposite) {
    lines.push(toStructureLine(opposite, breakout ? 'rising-support' : 'descending-resistance', candles));
  }

  const levels = [
    ...findHorizontalLevels(supportPivots, currentClose, 'support'),
    ...findHorizontalLevels(resistancePivots, currentClose, 'resistance'),
  ];
  const primaryLine = lines[0];

  return {
    type,
    price: currentClose,
    trendline: {
      type,
      ...primaryLine,
      signalTime: candles[currentIndex].time,
      signalPrice: currentClose,
      lines,
      levels,
    },
  };
}
