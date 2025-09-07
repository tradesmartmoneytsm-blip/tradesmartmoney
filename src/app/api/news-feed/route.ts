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

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  timestamp: string;
  impact: 'Positive' | 'Negative' | 'Neutral';
  source: string;
  url?: string;
  pubDate: string;
}

const NEWS_SOURCES = [
  {
    name: 'Economic Times Markets',
    rss: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
    category: 'Markets'
  },
  {
    name: 'MoneyControl Markets',  
    rss: 'https://www.moneycontrol.com/rss/marketreports.xml',
    category: 'Markets'
  },
  {
    name: 'MoneyControl Results',  
    rss: 'https://www.moneycontrol.com/rss/results.xml',
    category: 'Results'
  },
  {
    name: 'Business Standard Markets',
    rss: 'https://www.business-standard.com/rss/markets-106.rss', 
    category: 'Markets'
  }
];

const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';

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

// Keywords to filter for stock market related content
const MARKET_KEYWORDS = [
  'nifty', 'sensex', 'stock', 'share', 'market', 'trading', 'investor', 'investment',
  'equity', 'dividend', 'earnings', 'profit', 'revenue', 'ipo', 'listing', 'sector',
  'bse', 'nse', 'fii', 'dii', 'mutual fund', 'portfolio', 'rupee', 'index',
  'commodity', 'gold', 'silver', 'crude', 'currency', 'forex', 'banking', 'finance',
  'company', 'corporate', 'quarterly', 'results', 'analyst', 'rating', 'target',
  'buy', 'sell', 'hold', 'recommendation', 'valuation', 'psu', 'mid-cap', 'small-cap'
];

const isMarketRelated = (title: string, description: string = ''): boolean => {
  const content = (title + ' ' + description).toLowerCase();
  return MARKET_KEYWORDS.some(keyword => content.includes(keyword));
};

// Clean HTML tags and entities from text
const cleanHTML = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
};

// Check if two titles are similar (for duplicate detection)
const areTitlesSimilar = (title1: string, title2: string): boolean => {
  const clean1 = title1.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const clean2 = title2.toLowerCase().replace(/[^\w\s]/g, '').trim();
  
  // Check if titles are identical after cleaning
  if (clean1 === clean2) return true;
  
  // Check if one title contains most words of the other (for similar articles)
  const words1 = clean1.split(' ').filter(word => word.length > 3);
  const words2 = clean2.split(' ').filter(word => word.length > 3);
  
  if (words1.length === 0 || words2.length === 0) return false;
  
  const commonWords = words1.filter(word => words2.includes(word));
  const similarity = commonWords.length / Math.max(words1.length, words2.length);
  
  return similarity > 0.6; // 60% similarity threshold
};

// Remove duplicate articles
const removeDuplicates = (articles: NewsArticle[]): NewsArticle[] => {
  const uniqueArticles: NewsArticle[] = [];
  
  for (const article of articles) {
    const isDuplicate = uniqueArticles.some(existing => 
      areTitlesSimilar(article.title, existing.title)
    );
    
    if (!isDuplicate) {
      uniqueArticles.push(article);
    }
  }
  
  return uniqueArticles;
};

const fetchNewsFromRSS = async (source: typeof NEWS_SOURCES[0]): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(`${RSS_TO_JSON_API}?rss_url=${encodeURIComponent(source.rss)}`);
    const data: RSSResponse = await response.json();
    
    if (data.status === 'ok' && data.items) {
      return data.items
        .slice(0, 8) // Get more items to filter from
        .filter(item => isMarketRelated(item.title, item.description || '')) // Filter for market content
        .slice(0, 6) // Take top 6 market-related articles per source
        .map((item: RSSItem) => ({
          id: `${source.name}-${item.title.slice(0, 20).replace(/\s+/g, '-')}`,
          title: cleanHTML(item.title),
          summary: item.description ? 
            cleanHTML(item.description).substring(0, 150) + '...' : 
            'Click to read more about this market development',
          category: source.category,
          timestamp: formatTimestamp(item.pubDate),
          impact: 'Neutral' as const,
          source: source.name,
          url: item.link,
          pubDate: item.pubDate
        }));
    }
    return [];
  } catch (error) {
    console.error(`Failed to fetch news from ${source.name}:`, error);
    return [];
  }
};

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 API: Fetching news feeds...');
    
    // Fetch from all RSS sources
    const newsPromises = NEWS_SOURCES.map(fetchNewsFromRSS);
    const results = await Promise.all(newsPromises);
    
    // Combine and sort by publication date
    const allNews = results.flat().sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );
    
    // Remove duplicates
    const uniqueNews = removeDuplicates(allNews);

    console.log(`✅ API: Found ${uniqueNews.length} news articles`);
    
    if (uniqueNews.length > 0) {
      return NextResponse.json({
        success: true,
        articles: uniqueNews.slice(0, 8), // Return top 8 articles
        lastUpdated: new Date().toISOString()
      });
    } else {
      // Return fallback articles if RSS fails
      const fallbackArticles: NewsArticle[] = [
        {
          id: '1',
          title: 'Nifty Hits Fresh All-Time High Above 25,000',
          summary: 'Indian benchmark indices surge to record levels driven by strong FII inflows and positive earnings.',
          category: 'Markets',
          timestamp: '2 hours ago',
          impact: 'Positive',
          source: 'Economic Times Markets',
          pubDate: new Date().toISOString()
        },
        {
          id: '2', 
          title: 'RBI Repo Rate Decision Awaited This Week',
          summary: 'Market expects central bank to maintain current rates amid balanced inflation and growth outlook.',
          category: 'Policy',
          timestamp: '4 hours ago',
          impact: 'Neutral',
          source: 'MoneyControl Markets',
          pubDate: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Banking Sector Leads Market Rally', 
          summary: 'HDFC Bank, ICICI Bank, and SBI gain 3-5% on strong quarterly results and NIM improvement.',
          category: 'Stocks',
          timestamp: '6 hours ago',
          impact: 'Positive',
          source: 'Business Standard Markets',
          pubDate: new Date().toISOString()
        },
        {
          id: '4',
          title: 'IT Stocks Under Pressure on US Slowdown Fears', 
          summary: 'TCS, Infosys, and Wipro decline 2-4% as investors worry about reduced technology spending.',
          category: 'Stocks',
          timestamp: '8 hours ago',
          impact: 'Negative',
          source: 'Economic Times Stocks',
          pubDate: new Date().toISOString()
        }
      ];
      
      return NextResponse.json({
        success: true,
        articles: fallbackArticles,
        lastUpdated: new Date().toISOString(),
        note: 'Using fallback articles - RSS feeds temporarily unavailable'
      });
    }
  } catch (error) {
    console.error('❌ API: Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
} 