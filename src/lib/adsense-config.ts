/** Google AdSense configuration — set slot IDs in .env.local when approved */

export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? 'ca-pub-6601377389077210';

export const ADSENSE_SLOTS = {
  leaderboard: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD ?? '',
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? '',
  skyscraper: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SKYSCRAPER ?? '',
  inArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE ?? '',
  mobile: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE ?? '',
} as const;

export type AdSenseSlotKey = keyof typeof ADSENSE_SLOTS;

export function isAdSlotConfigured(slot: AdSenseSlotKey): boolean {
  return Boolean(ADSENSE_SLOTS[slot]);
}
