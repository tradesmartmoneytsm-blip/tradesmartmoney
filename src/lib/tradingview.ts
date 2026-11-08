/**
 * TradingView embed uses EXCHANGE:SYMBOL (e.g. NSE:RELIANCE, NSE:M&M).
 * The free Advanced Chart widget blocks some NSE names; full chart on tradingview.com still works.
 */

export function buildTradingViewSymbol(nseTicker: string, seoSymbol?: string): string {
  const seo = (seoSymbol || '').trim();
  if (seo.includes(':')) {
    return seo;
  }

  const ticker = nseTicker.trim().toUpperCase().replace(/^NSE:/, '');
  return `NSE:${ticker}`;
}

export function tradingViewChartUrl(tvSymbol: string, interval = '5'): string {
  const sym = tvSymbol.includes(':') ? tvSymbol : `NSE:${tvSymbol}`;
  return `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(sym)}&interval=${interval}`;
}
