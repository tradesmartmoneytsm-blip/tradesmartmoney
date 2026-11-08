import * as cheerio from 'cheerio';
import { supabaseAdmin } from '@/lib/supabase';

// ============================================================
// India market news ingestion
// ------------------------------------------------------------
// - Fetches publisher RSS + Google News RSS DIRECTLY (no
//   rss2json proxy), parses XML server-side with cheerio.
// - Dedupes by source_url and upserts into Supabase
//   `news_articles` (see database/schemas/news-articles-schema.sql).
// - No fabricated fallback articles: if a fetch fails it is
//   skipped, never faked.
// ============================================================

interface FeedSource {
  name: string;
  url: string;
  category: string;
  maxItems: number;
  /** Which relevance filter to apply. Defaults to 'market' (India markets). */
  relevance?: 'market' | 'global';
}

// Verified working feeds (checked 2026-10-25)
// NOTE: order matters — publisher feeds come first, so Google News
// syndication copies lose the fuzzy-dedupe race against originals.
const FEED_SOURCES: FeedSource[] = [
  { name: 'Economic Times Markets', url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms', category: 'Markets', maxItems: 20 },
  { name: 'Economic Times Earnings', url: 'https://economictimes.indiatimes.com/markets/earnings/rssfeeds/2146843.cms', category: 'Results', maxItems: 15 },
  { name: 'MoneyControl Markets', url: 'https://www.moneycontrol.com/rss/marketreports.xml', category: 'Markets', maxItems: 20 },
  { name: 'MoneyControl Results', url: 'https://www.moneycontrol.com/rss/results.xml', category: 'Results', maxItems: 15 },
  { name: 'Business Standard Markets', url: 'https://www.business-standard.com/rss/markets-106.rss', category: 'Markets', maxItems: 15 },
  { name: 'Livemint Markets', url: 'https://www.livemint.com/rss/markets', category: 'Markets', maxItems: 15 },
  { name: 'Livemint Companies', url: 'https://www.livemint.com/rss/companies', category: 'Companies', maxItems: 15 },
  // Google News aggregates all Indian outlets; parametrizable per topic.
  { name: 'Google News India', url: 'https://news.google.com/rss/search?q=%22indian%20stock%20market%22%20OR%20nifty%20OR%20sensex%20OR%20%22fii%22%20when:3h&hl=en-IN&gl=IN&ceid=IN:en', category: 'Markets', maxItems: 12 },
  { name: 'Google News Results', url: 'https://news.google.com/rss/search?q=%22Q2%20results%22%20OR%20%22quarterly%20results%22%20OR%20%22Q2%20earnings%22%20when:3d&hl=en-IN&gl=IN&ceid=IN:en', category: 'Results', maxItems: 12 },

  // ── Global economics / geopolitics (war, macro, impactful) ──
  { name: 'Google News War & Geopolitics', url: 'https://news.google.com/rss/search?q=war%20OR%20geopolitics%20OR%20conflict%20OR%20sanctions%20OR%20ceasefire%20when:3h&hl=en&gl=IN&ceid=IN:en', category: 'Global', maxItems: 12, relevance: 'global' },
  { name: 'Google News Global Economy', url: 'https://news.google.com/rss/search?q=%22global%20economy%22%20OR%20inflation%20OR%20%22federal%20reserve%22%20OR%20%22oil%20prices%22%20when:3h&hl=en&gl=IN&ceid=IN:en', category: 'Global', maxItems: 12, relevance: 'global' },
  { name: 'BBC Business', url: 'https://feeds.bbci.co.uk/news/business/rss.xml', category: 'Global', maxItems: 15, relevance: 'global' },
  { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'Global', maxItems: 15, relevance: 'global' },
];

// Syndication aggregators that republish wire stories — dropped before storage.
const BLOCKED_SOURCE_PATTERNS = [
  /india tribune/i,
  /india new england/i,
  /india education diary/i,
  /imeche/i,
  /tradingview news/i,
  /moneylife news/i,
];

const MARKET_KEYWORDS = [
  'nifty', 'sensex', 'stock', 'share', 'market', 'trading', 'investor', 'equity', 'bse', 'nse',
  'fii', 'dii', 'ipo', 'earnings', 'results', 'dividend', 'rupee', 'sebi', 'rbi', 'repo',
  'quarterly', 'mutual fund', 'benchmark', 'psu', 'mid-cap', 'small-cap', 'sensex', 'indices',
];

const POSITIVE_KEYWORDS = [
  'surge', 'surges', 'surged', 'gain', 'gains', 'jump', 'jumps', 'jumps', 'rally', 'rallies',
  'record high', 'all-time high', 'beats estimates', 'beats expectations', 'upgrade',
  'upgrade to', 'buy rating', 'profit rises', 'profit jumps', 'profit surges', 'net profit rises',
  'inflow', 'inflows', 'bullish', 'soars', 'hits high', 'sharp rise', 'strong growth',
  'revenue rises', 'sales rise', 'dividend declared', 'buyback', 'golden cross',
];

const NEGATIVE_KEYWORDS = [
  'fall', 'falls', 'drop', 'drops', 'slump', 'slumps', 'crash', 'plunge', 'plunges', 'sink',
  'sinks', 'slide', 'slides', 'downgrade', 'cut', 'cuts', 'loss', 'outflow', 'outflows',
  'bearish', 'selloff', 'sell-off', 'sell off', 'cracks', 'worst', 'rupee falls', 'misses estimates',
  'misses expectations', 'profit falls', 'profit drops', 'net loss', 'revenue falls',
  'weak demand', 'lowest in', 'blame', 'warning', 'probe', 'sebi action', 'fraud', 'resigns',
];

// Popular NSE stocks for symbol tagging (subset; mirrors /api/stock-news map)
const SYMBOL_KEYWORDS: Array<[string, string[]]> = [
  ['RELIANCE', ['reliance', 'ril', 'mukesh ambani']],
  ['TCS', ['tcs', 'tata consultancy']],
  ['HDFCBANK', ['hdfc bank', 'hdfc']],
  ['INFY', ['infosys', 'infy']],
  ['ICICIBANK', ['icici bank', 'icici']],
  ['HINDUNILVR', ['hindustan unilever', 'hul']],
  ['ITC', ['itc ']],
  ['SBIN', ['sbi', 'state bank of india']],
  ['BHARTIARTL', ['bharti airtel', 'airtel']],
  ['KOTAKBANK', ['kotak']],
  ['LT', ['larsen', 'l&t']],
  ['MARUTI', ['maruti']],
  ['TITAN', ['titan']],
  ['WIPRO', ['wipro']],
  ['NESTLEIND', ['nestle india', 'nestlé']],
  ['BAJFINANCE', ['bajaj finance']],
  ['TECHM', ['tech mahindra']],
  ['HCLTECH', ['hcl technologies', 'hcl tech']],
  ['AXISBANK', ['axis bank']],
  ['NIFTY', ['nifty', 'benchmark indices']],
  ['SENSEX', ['sensex']],
];

const cleanHtml = (text: string): string =>
  (text || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;g/g, '>')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Headlines that are not market news even if they contain market words
// ("makes a nifty one-handed catch" — NFL). Checked after positive match,
// before the item is accepted.
const NON_MARKET_PATTERNS = [
  /\bnfl\b/i, /\bnba\b/i, /\bnhl\b/i, /\bmlb\b/i, /\bncaa\b/i,
  /touchdown/i, /end zone/i, /quarterback/i, /premier league/i,
  /goal of the season/i, /grand slam/i, /olympic/i, /fifa/i,
  /bollywood|box office|film|movie review|trailer/i,
];

const isMarketRelated = (title: string, description = ''): boolean => {
  const content = `${title} ${description}`;
  const lower = content.toLowerCase();
  if (NON_MARKET_PATTERNS.some((pattern) => pattern.test(content))) return false;
  return MARKET_KEYWORDS.some((keyword) => lower.includes(keyword));
};

// Multi-word phrases for global economic / geopolitical relevance.
const GLOBAL_PHRASES = [
  'federal reserve', 'interest rate', 'rate cut', 'rate hike', 'rate decision',
  'central bank', 'trade war', 'stock market', 'crude oil', 'oil price',
  'global economy', 'world economy', 'economic growth', 'bond yield',
  'ceasefire', 'geopolit' /* geopolitics / geopolitical */, 'sanction', 'tariff',
  'energy crisis', 'commodit' /* commodity / commodities */, 'imf', 'world bank',
];

// Word-boundary single-word terms (avoids "software" matching "war", "soil"→"oil").
const GLOBAL_WORD_REGEX =
  /\b(war|wars|conflict|invasion|missile|drone|nuclear|inflation|recession|economy|economic|gdp|oil|crude|gold|silver|currency|currencies|dollar|rupee|stocks?|markets?|sensex|nifty|dow|nasdaq|china|europe|eurozone|fed|rbi|ecb|treasury|yield|bonds?|sanctions|tariffs)\b/i;

// War, geopolitics, global macro and other market-impactful world news.
const isGlobalEconomicRelated = (title: string, description = ''): boolean => {
  const content = `${title} ${description}`;
  if (NON_MARKET_PATTERNS.some((pattern) => pattern.test(content))) return false;
  const lower = content.toLowerCase();
  return (
    GLOBAL_PHRASES.some((phrase) => lower.includes(phrase)) ||
    GLOBAL_WORD_REGEX.test(content)
  );
};

const scoreImpact = (content: string): 'Positive' | 'Negative' | 'Neutral' => {
  const lower = content.toLowerCase();

  // Percent moves are strong signals regardless of vocabulary
  const pubDrops = /(fall|fell|drop|drops|plunge|plunged|plunges|slide|slides|slump|slumps|crash|cracks|tumbles)[^.!?]*?(\d+(?:\.\d+)?)\s*%/.test(lower);
  const pubRises = /(jump|jumps|jumped|surge|surges|surged|gains?|rallies|rally|rises?|soars?)[^.!?]*?(\d+(?:\.\d+)?)\s*%/.test(lower);
  const wasPercentPatternApplied = pubDrops || pubRises;

  const idxNeg = NEGATIVE_KEYWORDS.findIndex((k) => lower.includes(k));
  const idxPos = POSITIVE_KEYWORDS.findIndex((k) => lower.includes(k));

  if (pubDrops && (idxNeg !== -1 || !pubRises)) return 'Negative';
  if (pubRises && (idxPos !== -1 || !pubDrops)) return 'Positive';
  if (wasPercentPatternApplied) return pubDrops ? 'Negative' : 'Positive';

  if (idxNeg !== -1 && idxPos !== -1) return idxNeg < idxPos ? 'Negative' : 'Positive';
  if (idxNeg !== -1) return 'Negative';
  if (idxPos !== -1) return 'Positive';
  return 'Neutral';
};

// Google News titles end with " - <Provider>" (sometimes "- <Provider> - <Edition>")
const stripProviderSuffix = (title: string, provider: string): string => {
  let cleaned = title;
  if (provider) {
    while (cleaned.toLowerCase().endsWith(provider.toLowerCase().trim())) {
      cleaned = cleaned.slice(0, cleaned.length - provider.trim().length);
      if (cleaned.endsWith(' - ')) cleaned = cleaned.slice(0, -3);
      else if (cleaned.endsWith('- ')) cleaned = cleaned.slice(0, -2);
      else if (cleaned.endsWith(' -')) cleaned = cleaned.slice(0, -2);
      else break;
    }
  }
  return cleaned.trim();
};

const isBlockedSource = (name: string): boolean =>
  BLOCKED_SOURCE_PATTERNS.some((pattern) => pattern.test(name));

// ── Fuzzy duplicate detection ──────────────────────────────
const normalizeTitle = (title: string): string =>
  title.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();

const tokenize = (title: string): Set<string> => {
  const STOP = new Set(['the', 'a', 'an', 'of', 'in', 'on', 'for', 'to', 'and', 'as', 'is', 'its', 'with', 'at', 'by', 'from']);
  return new Set(normalizeTitle(title).split(' ').filter((w) => w.length > 2 && !STOP.has(w)));
};

/** Token-set Jaccard similarity between two titles (0..1) */
const titleSimilarity = (a: string, b: string): number => {
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  let common = 0;
  tokensA.forEach((t) => {
    if (tokensB.has(t)) common += 1;
  });
  return common / (tokensA.size + tokensB.size - common);
};

const tagSymbols = (content: string): string[] => {
  const lower = content.toLowerCase();
  const tags = SYMBOL_KEYWORDS.filter(([, words]) => words.some((w) => lower.includes(w)))
    .map(([symbol]) => symbol);
  return tags.length ? Array.from(new Set(tags)) : [];
};

interface ParsedItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  providerName?: string;
}

const fetchFeed = async (source: FeedSource): Promise<ParsedItem[]> => {
  try {
    const response = await fetch(source.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', 'Accept': 'application/rss+xml, application/xml, text/xml, */*' },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.warn(`📥 News ingestion: ${source.name} responded ${response.status}`);
      return [];
    }
    const xml = await response.text();
    const $ = cheerio.load(xml, { xml: true });

    const items: ParsedItem[] = [];
    $('item').each((_, el) => {
      const item = $(el);
      const title = cleanHtml(item.find('title').first().text());
      const link = (item.find('link').first().text() || item.find('guid').first().text()).trim();
      const description = cleanHtml(item.find('description').first().text());
      const pubDate = item.find('pubDate').first().text().trim();
      const providerName = cleanHtml(item.find('source').first().text()) || source.name;
      if (title && link) items.push({ title, link, description, pubDate, providerName });
    });
    return items;
  } catch (error) {
    console.warn(`📥 News ingestion: failed to fetch ${source.name}:`, error instanceof Error ? error.message : error);
    return [];
  }
};

const toRow = (item: ParsedItem, source: FeedSource) => {
  const isGoogleNews = /Google News/.test(source.name);

  // Google News wraps providers; otherwise use our configured name
  const displaySource = isGoogleNews && item.providerName ? item.providerName : source.name;

  // Provider suffix inside the title ("Big story - Business Standard - Mumbai") is noise
  const title = isGoogleNews ? stripProviderSuffix(item.title, item.providerName || '') : item.title;

  // Skip syndicators republishing wire stories
  if (isBlockedSource(displaySource)) return null;

  const summary = item.description ? item.description.substring(0, 200) : '';
  const content = `${title} ${summary}`;

  return {
    source_url: item.link,
    title,
    summary: summary || title,
    category: source.category,
    source: displaySource,
    impact: scoreImpact(content),
    symbols: tagSymbols(content),
    published_at: new Date(item.pubDate || Date.now()).toISOString(),
  };
};
export interface IngestionResult {
  fetched: number;
  inserted: number;
  sourcesOk: number;
  sourcesTotal: number;
}

/** Fetch all feeds, dedupe, and upsert into Supabase. */
export async function ingestMarketNews(): Promise<IngestionResult> {
  const results = await Promise.allSettled(FEED_SOURCES.map(fetchFeed));

  const rows: Array<Record<string, unknown>> = [];
  let sourcesOk = 0;

  FEED_SOURCES.forEach((source, i) => {
    const result = results[i];
    if (result.status !== 'fulfilled' || result.value.length === 0) return;
    sourcesOk += 1;

    const items = result.value
      .filter((item) =>
        source.relevance === 'global'
          ? isGlobalEconomicRelated(item.title, item.description)
          : isMarketRelated(item.title, item.description),
      )
      .slice(0, source.maxItems);

    for (const item of items) {
      try {
        const row = toRow(item, source);
        if (row) rows.push(row);
      } catch {
        // skip malformed dates/rows
      }
    }
  });

  // ── Two-level dedupe (first occurrence wins; feeds are ordered best-first) ──
  // 1. Exact source_url
  // 2. Fuzzy title similarity — catches the same story syndicated with a
  //    different URL by Google News (e.g. "F&O Talk..." in ET and The ET)
  const seenUrls = new Set<string>();
  const seenTitles: string[] = [];
  const uniqueRows = rows.filter((row) => {
    const key = String(row.source_url);
    if (seenUrls.has(key)) return false;

    const title = String(row.title);
    if (seenTitles.some((t) => titleSimilarity(t, title) >= 0.55)) return false;

    seenUrls.add(key);
    seenTitles.push(title);
    return true;
  });

  let inserted = 0;
  const CHUNK = 50;
  for (let i = 0; i < uniqueRows.length; i += CHUNK) {
    const chunk = uniqueRows.slice(i, i + CHUNK);
    const { error, count } = await supabaseAdmin
      .from('news_articles')
      .upsert(chunk, { onConflict: 'source_url', ignoreDuplicates: true, count: 'exact' });
    if (error) {
      console.error('📥 News ingestion: upsert error:', error.message);
    } else if (count) {
      inserted += count;
    }
  }

  // Housekeeping: drop anything older than 7 days
  const cutoff = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  await supabaseAdmin.from('news_articles').delete().lt('published_at', cutoff);

  return { fetched: uniqueRows.length, inserted, sourcesOk, sourcesTotal: FEED_SOURCES.length };
}

/** Newest cached row timestamp, or null when the table is empty. */
export async function getNewestPublishedAt(): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('news_articles')
    .select('published_at')
    .order('published_at', { ascending: false })
    .limit(1);
  return data?.[0]?.published_at ?? null;
}
