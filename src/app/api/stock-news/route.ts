import { NextRequest, NextResponse } from 'next/server';

interface RSSItem {
  title: string;
  description?: string;
  link: string;
  pubDate: string;
}

interface RSSResponse {
  status: string;
  feed: {
    title: string;
  };
  items: RSSItem[];
}

interface StockNews {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  source: string;
  url?: string;
  pubDate: string;
  stockSymbols: string[];
}

interface StockNewsSummary {
  symbol: string;
  name: string;
  newsCount: number;
  latestNews: string;
  lastUpdated: string;
}

// Major Indian stocks with their symbols and keywords
const INDIAN_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', keywords: ['reliance', 'ril', 'mukesh ambani'] },
  { symbol: 'TCS', name: 'Tata Consultancy Services', keywords: ['tcs', 'tata consultancy', 'tata sons'] },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', keywords: ['hdfc bank', 'hdfc', 'housing development finance'] },
  { symbol: 'INFY', name: 'Infosys', keywords: ['infosys', 'infy', 'narayana murthy'] },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', keywords: ['icici bank', 'icici'] },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', keywords: ['hindustan unilever', 'hul'] },
  { symbol: 'ITC', name: 'ITC Limited', keywords: ['itc', 'itc limited'] },
  { symbol: 'SBIN', name: 'State Bank of India', keywords: ['sbi', 'state bank of india', 'state bank'] },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', keywords: ['bharti airtel', 'airtel', 'bharti'] },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', keywords: ['kotak', 'kotak mahindra', 'kotak bank'] },
  { symbol: 'LT', name: 'Larsen & Toubro', keywords: ['larsen', 'toubro', 'l&t'] },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', keywords: ['asian paints', 'asian paint'] },
  { symbol: 'HCLTECH', name: 'HCL Technologies', keywords: ['hcl technologies', 'hcl tech', 'hcl'] },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', keywords: ['maruti suzuki', 'maruti'] },
  { symbol: 'TITAN', name: 'Titan Company', keywords: ['titan', 'titan company'] },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', keywords: ['ultratech cement', 'ultratech'] },
  { symbol: 'WIPRO', name: 'Wipro Limited', keywords: ['wipro'] },
  { symbol: 'NESTLEIND', name: 'Nestle India', keywords: ['nestle india', 'nestle'] },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', keywords: ['bajaj finance'] },
  { symbol: 'TECHM', name: 'Tech Mahindra', keywords: ['tech mahindra'] }
];

const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';

const NEWS_SOURCES = [
  'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
  'https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms',
  'https://www.moneycontrol.com/rss/marketreports.xml',
  'https://www.business-standard.com/rss/markets-106.rss'
];

// Clean HTML tags and entities from text
const cleanHTML = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const formatTimestamp = (pubDate: string): string => {
  try {
    const date = new Date(pubDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  } catch {
    return 'Recently';
  }
};

// Detect which stocks are mentioned in news content
const detectStocks = (title: string, description: string = ''): string[] => {
  const content = (title + ' ' + description).toLowerCase();
  const detectedStocks: string[] = [];
  
  for (const stock of INDIAN_STOCKS) {
    if (stock.keywords.some(keyword => content.includes(keyword.toLowerCase()))) {
      detectedStocks.push(stock.symbol);
    }
  }
  
  return detectedStocks;
};

// Fetch news from all sources
const fetchAllStockNews = async (): Promise<StockNews[]> => {
  const allNews: StockNews[] = [];
  
  for (const rssUrl of NEWS_SOURCES) {
    try {
      const response = await fetch(`${RSS_TO_JSON_API}?rss_url=${encodeURIComponent(rssUrl)}`);
      const data: RSSResponse = await response.json();
      
      if (data.status === 'ok' && data.items) {
        for (const item of data.items.slice(0, 10)) {
          const stockSymbols = detectStocks(item.title, item.description);
          
          if (stockSymbols.length > 0) {
            allNews.push({
              id: `${item.title.slice(0, 20).replace(/\s+/g, '-')}-${Date.now()}`,
              title: cleanHTML(item.title),
              summary: item.description ? cleanHTML(item.description).substring(0, 200) + '...' : 'Click to read more',
              timestamp: formatTimestamp(item.pubDate),
              source: data.feed.title || 'News Source',
              url: item.link,
              pubDate: item.pubDate,
              stockSymbols
            });
          }
        }
      }
    } catch (error) {
      console.error(`Failed to fetch from ${rssUrl}:`, error);
    }
  }
  
  return allNews;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stockSymbol = searchParams.get('stock');
    const mode = searchParams.get('mode') || 'search'; // 'search' or 'list'
    
    console.log('🔄 Stock News API: Fetching stock-specific news...');
    
    const allStockNews = await fetchAllStockNews();
    
    if (mode === 'list') {
      // Return list of stocks with news counts
      const stockSummary: StockNewsSummary[] = [];
      
      for (const stock of INDIAN_STOCKS) {
        const stockNews = allStockNews.filter(news => 
          news.stockSymbols.includes(stock.symbol)
        );
        
        if (stockNews.length > 0) {
          stockSummary.push({
            symbol: stock.symbol,
            name: stock.name,
            newsCount: stockNews.length,
            latestNews: stockNews[0].title,
            lastUpdated: stockNews[0].timestamp
          });
        }
      }
      
      return NextResponse.json({
        success: true,
        mode: 'list',
        stocks: stockSummary.sort((a, b) => b.newsCount - a.newsCount),
        totalStocks: stockSummary.length
      });
    }
    
    if (stockSymbol) {
      // Return news for specific stock
      const stockNews = allStockNews.filter(news => 
        news.stockSymbols.includes(stockSymbol.toUpperCase())
      );
      
      const stockInfo = INDIAN_STOCKS.find(s => s.symbol === stockSymbol.toUpperCase());
      
      return NextResponse.json({
        success: true,
        mode: 'search',
        stock: {
          symbol: stockSymbol.toUpperCase(),
          name: stockInfo?.name || stockSymbol,
          newsCount: stockNews.length
        },
        articles: stockNews.slice(0, 20)
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Please provide a stock symbol or use mode=list'
    }, { status: 400 });
    
  } catch (error) {
    console.error('❌ Stock News API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stock news' },
      { status: 500 }
    );
  }
} 