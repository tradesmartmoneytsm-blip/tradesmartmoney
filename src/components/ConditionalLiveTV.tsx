'use client';

import { usePathname } from 'next/navigation';
import { ZeeBusinessLiveTV } from './ZeeBusinessLiveTV';

export function ConditionalLiveTV() {
  const pathname = usePathname();
  if (pathname?.startsWith('/terminal')) {
    return null;
  }
  return <ZeeBusinessLiveTV />;
}