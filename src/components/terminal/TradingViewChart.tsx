'use client';

import { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
  className?: string;
}

/**
 * TradingView Advanced Chart embed (dark, IST).
 * Symbol format: NSE:RELIANCE, NSE:NIFTY, etc.
 */
export function TradingViewChart({
  symbol,
  interval = '5',
  className = '',
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval,
      timezone: 'Asia/Kolkata',
      theme: 'dark',
      backgroundColor: '#0b0e14',
      gridColor: 'rgba(42, 46, 57, 0.6)',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      studies: ['Volume@tv-basicstudies'],
      withdateranges: true,
      hide_side_toolbar: false,
      show_popup_button: true,
      popup_width: 1200,
      popup_height: 700,
    });

    container.appendChild(widgetDiv);
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [symbol, interval]);

  return (
    <div
      ref={containerRef}
      className={`tradingview-widget-container h-full w-full min-h-[280px] ${className}`}
    />
  );
}
