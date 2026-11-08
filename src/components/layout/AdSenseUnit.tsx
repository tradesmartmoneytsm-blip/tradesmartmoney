'use client';

import { useEffect, useRef } from 'react';
import {
  ADSENSE_CLIENT_ID,
  ADSENSE_SLOTS,
  type AdSenseSlotKey,
  isAdSlotConfigured,
} from '@/lib/adsense-config';

interface AdSenseUnitProps {
  slot: AdSenseSlotKey;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'fluid';
  className?: string;
  minHeight?: number;
  /** Show a subtle placeholder when slot ID is not configured (default: false) */
  showPlaceholder?: boolean;
}

export function AdSenseUnit({
  slot,
  format = 'auto',
  className = '',
  minHeight = 90,
  showPlaceholder = false,
}: AdSenseUnitProps) {
  const pushed = useRef(false);
  const configured = isAdSlotConfigured(slot);

  useEffect(() => {
    if (!configured || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense script not ready
    }
  }, [configured]);

  if (!configured) {
    if (!showPlaceholder) return null;
    return (
      <div
        className={`flex items-center justify-center rounded-md bg-slate-100/80 text-[9px] text-slate-400 ${className}`}
        style={{ minHeight: Math.min(minHeight, 72) }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className={className} style={{ minHeight }}>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={ADSENSE_SLOTS[slot]}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
