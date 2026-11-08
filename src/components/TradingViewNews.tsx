'use client';

import { useEffect, useRef } from 'react';

interface TradingViewNewsProps {
  /** 'all_symbols' = global feed, 'market' = one asset class, 'symbol' = news for one symbol */
  feedMode?: 'all_symbols' | 'market' | 'symbol';
  /** Asset class when feedMode === 'market' (e.g. 'stock', 'crypto', 'forex') */
  market?: string;
  /** Single symbol when feedMode === 'symbol' (e.g. 'NSE:RELIANCE', 'NSE:NIFTY') */
  symbol?: string;
  height?: number;
  colorTheme?: 'light' | 'dark';
  isTransparent?: boolean;
  displayMode?: 'regular' | 'compact' | 'adaptive';
  className?: string;
}

/**
 * TradingView "Timeline of news" widget.
 * Embed contract (from embed-widget-timeline.js): settings are passed as JSON
 * inside the script tag; the script replaces itself with an iframe inside a
 * `.tradingview-widget-container`.
 */
export function TradingViewNews({
  feedMode = 'all_symbols',
  market,
  symbol,
  height = 650,
  colorTheme = 'light',
  isTransparent = true,
  displayMode = 'regular',
  className = '',
}: TradingViewNewsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset container so remounts/redeploys re-inject a single embed
    container.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      feedMode,
      ...(feedMode === 'market' && market ? { market } : {}),
      ...(feedMode === 'symbol' && symbol ? { symbol } : {}),
      width: '100%',
      height,
      colorTheme,
      isTransparent,
      displayMode,
      locale: 'en',
    });

    container.appendChild(widgetDiv);
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [feedMode, market, symbol, height, colorTheme, isTransparent, displayMode]);

  return (
    <div ref={containerRef} className={`tradingview-widget-container ${className}`}>
      <div className="tradingview-widget-container__widget" />
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
          className="text-xs text-gray-400"
        >
          <span className="blue-text">TradingView news</span>
        </a>
      </div>
    </div>
  );
}

export default TradingViewNews;
