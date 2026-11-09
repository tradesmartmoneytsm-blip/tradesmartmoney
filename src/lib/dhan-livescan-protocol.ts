/**
 * Captured from DEXT T3 `main-*.js` (Nov 2025) — reference for full parity.
 *
 * **Live feed (authoritative in DEXT)**
 * - WebSocket: `wss://analytics-livescan.dhan.co/clients/connect?token=<dhan_jwt>`
 * - Subscribe: `{ action: "subscribe", type: <number>, data: [{ SegId, SecId: number[] }] }`
 * - Stocks: `type=0`, `SegId=0`, `SecId=[filterSecId]` (e.g. 311 F&O, 19 Nifty 500)
 * - F&O derivatives: `type=2`, `SegId=0`, `SecId=[underlying sid]`
 * - Commodity: `type=2`, `SegId=5`, `SecId=[...]`
 * - Binary frames bundled; equity scanner events use msg codes 100–102, 106, 139–140
 *
 * **Polling fallback (TradeSmart — no Dhan login)**
 * - ScanX `fetchdt` via `/api/live-scanner` + constituent filter
 * - Same UI; events synthesized on poll (~12s) instead of push
 *
 * **Pivot / volume / near-52W extras**
 * - Delivered only on the DEXT WebSocket (not exposed on public ScanX in our probes)
 * - Equity: msg 100 (high/low by dayIndicator), 101 circuit, 102 pivot, 106 unusual volume, 139–140 near-52W
 * - F&O: msg 300–304 (`DHAN_LIVESCAN_FNO_EVENTS` in `dhan-livescan-catalog.ts`)
 *
 * **Catalogs**
 * - Stock indices: `dhan-livescan-indices.ts` (`mP`)
 * - F&O underlyings / commodities: `dhan-livescan-catalog.ts` (`fP`, `yP`)
 */

export const DHAN_LIVESCAN_WS_URL = 'wss://analytics-livescan.dhan.co/clients/connect';
