'use client';

import { usePathname } from 'next/navigation';
import { ActivityManager } from './ActivityManager';

export function ConditionalActivityManager() {
  const pathname = usePathname();
  if (pathname?.startsWith('/terminal')) {
    return null;
  }
  return <ActivityManager />;
}

