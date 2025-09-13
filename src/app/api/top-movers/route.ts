import { NextRequest, NextResponse } from 'next/server';

interface TopMoverStock {
  isin: string;
  companyName: string;
  companyShortName: string;
  ltp: number;
  close: number;
  logoUrl: string;
  nseScriptCode: string;
  change: number;
  changePercent: number;
  marketCap: number;
  yearHigh: number;
  yearLow: number;
}

interface StockData {
  isin: string;
  companyName: string;
  companyShortName: string;
  ltp: number;
  close: number;
  logoUrl: string;
  nseScriptCode: string;
  marketCap: number;
  yearHigh: number;
  yearLow: number;
}

    interface TopMoversResponse {
      success: boolean;
      data?: TopMoverStock[];
      error?: string;
      lastUpdated: string;
    }

// Index mapping
const INDEX_MAPPING = {
  'NIFTY_100': 'GIDXNIFTY100',
  'NIFTY_500': 'GIDXNIFTY500', 
  'NIFTY_MIDCAP_100': 'GIDXNIFMDCP100',
  'NIFTY_SMALLCAP_100': 'GIDXNIFSMCP100',
  'NIFTY_TOTAL_MARKET': 'GIDXNIFTYTOTALMCAP'
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const moverType = searchParams.get('type') || 'TOP_GAINERS'; // TOP_GAINERS, TOP_LOSERS, YEARLY_HIGH, YEARLY_LOW
  const indexKey = searchParams.get('index') || 'NIFTY_TOTAL_MARKET';
  
  try {
    console.log(`🔄 API: Fetching ${moverType} for ${indexKey}...`);
    
    // Get the correct index code
    const indiceCode = INDEX_MAPPING[indexKey as keyof typeof INDEX_MAPPING];
    if (!indiceCode) {
      throw new Error(`Invalid index: ${indexKey}`);
    }
    
        // Fetch data from API
    const apiUrl = `https://groww.in/bff/web/stocks/web-pages/top_movers?indice=${indiceCode}&moverType=${moverType}&pageSize=50`;

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TradeSmartMoney/1.0)',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const apiData = await response.json();
    
    if (!apiData?.data?.stocks) {
      throw new Error('Invalid response format');
    }
    
    // Process and enhance the data
    const processedStocks: TopMoverStock[] = apiData.data.stocks.map((stock: StockData) => {
      const change = stock.ltp - stock.close;
      const changePercent = ((change / stock.close) * 100);
      
      return {
        isin: stock.isin,
        companyName: stock.companyName,
        companyShortName: stock.companyShortName,
        ltp: stock.ltp,
        close: stock.close,
        logoUrl: stock.logoUrl,
        nseScriptCode: stock.nseScriptCode,
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        marketCap: stock.marketCap,
        yearHigh: stock.yearHigh,
        yearLow: stock.yearLow
      };
    });
    
    console.log(`✅ API: Retrieved ${processedStocks.length} ${moverType.toLowerCase()} for ${indexKey}`);
    
    const result: TopMoversResponse = {
      success: true,
      data: processedStocks,
      lastUpdated: new Date().toISOString()
    };
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' // 5min cache
      }
    });
    
  } catch (error) {
    console.error(`❌ API: Failed to fetch ${moverType}:`, error);
    
    const result: TopMoversResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      lastUpdated: new Date().toISOString()
    };
    
    return NextResponse.json(result, { status: 500 });
  }
} 