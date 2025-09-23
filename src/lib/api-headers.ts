/**
 * Standardized headers for external API calls
 * Emulates real browser clients to avoid detection
 */

// Rotate between different realistic User-Agent strings
const USER_AGENTS = [
  // Chrome on Windows
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  
  // Chrome on Mac
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  
  // Firefox on Windows
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0',
  
  // Firefox on Mac
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0',
  
  // Safari on Mac
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  
  // Edge on Windows
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
];

// Common realistic referrers (not our site)
const REFERRERS = [
  'https://www.google.com/',
  'https://www.bing.com/',
  'https://duckduckgo.com/',
  'https://in.search.yahoo.com/',
  'https://www.google.co.in/',
  '', // Direct visit (no referrer)
];

// Get a random user agent
function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Get a random referrer
function getRandomReferrer(): string {
  return REFERRERS[Math.floor(Math.random() * REFERRERS.length)];
}

/**
 * Get standard headers for web scraping (HTML content)
 */
export function getWebScrapingHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'User-Agent': getRandomUserAgent(),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
  };

  // Add referrer if not empty
  const referrer = getRandomReferrer();
  if (referrer) {
    headers['Referer'] = referrer;
  }

  return headers;
}

/**
 * Get standard headers for API calls (JSON content)
 */
export function getApiHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'User-Agent': getRandomUserAgent(),
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'cross-site',
  };

  // Add referrer if not empty
  const referrer = getRandomReferrer();
  if (referrer) {
    headers['Referer'] = referrer;
  }

  return headers;
}

/**
 * Get headers for AJAX/XHR requests
 */
export function getXhrHeaders(origin?: string): HeadersInit {
  const headers: HeadersInit = {
    'User-Agent': getRandomUserAgent(),
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
  };

  // Add origin and referrer for XHR requests
  if (origin) {
    headers['Origin'] = origin;
    headers['Referer'] = `${origin}/`;
  }

  return headers;
}

/**
 * Get headers specifically for Chartink API
 */
export function getChartinkHeaders(): HeadersInit {
  return {
    ...getXhrHeaders('https://chartink.com'),
    'Referer': 'https://chartink.com/screener',
  };
}

/**
 * Get headers specifically for Groww API  
 */
export function getGrowwHeaders(): HeadersInit {
  return {
    ...getApiHeaders(),
    'Origin': 'https://groww.in',
    'Referer': 'https://groww.in/',
  };
}
