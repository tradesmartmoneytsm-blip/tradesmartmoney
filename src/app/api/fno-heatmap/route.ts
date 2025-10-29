import { NextRequest, NextResponse } from 'next/server';

/**
 * F&O Options Heatmap API
 * Fetches data from Research360 and serves it to our frontend
 */

interface HeatmapParams {
  ftype: 'price' | 'oi' | 'volume';
  explist: string; // e.g., "25-Nov-2025"
  bulist: 'long' | 'short' | 'long_unwind' | 'short_cover' | 'all';
  sectorfno: string; // e.g., "all" or specific sector
  indexlist: string; // e.g., "all" or specific index
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Get parameters from query string
    const ftype = searchParams.get('ftype') || 'price';
    const explist = searchParams.get('explist') || getCurrentExpiry();
    const bulist = searchParams.get('bulist') || 'all';
    const sectorfno = searchParams.get('sectorfno') || 'all';
    const indexlist = searchParams.get('indexlist') || 'all';
    
    // Call Research360 API
    const response = await fetch('https://www.research360.in/ajax/heatmapAPIHandler.php', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-GB,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'origin': 'https://www.research360.in',
        'referer': 'https://www.research360.in/future-and-options/heatmap',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'x-requested-with': 'XMLHttpRequest',
      },
      body: new URLSearchParams({
        ftype: ftype,
        explist: explist,
        bulist: bulist,
        sectorfno: sectorfno,
        indexlist: indexlist,
        page: 'heatmap'
      }).toString()
    });
    
    if (!response.ok) {
      throw new Error(`Research360 API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data,
      params: {
        ftype,
        explist,
        bulist,
        sectorfno,
        indexlist
      }
    });
    
  } catch (error) {
    console.error('F&O Heatmap API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch heatmap data'
      },
      { status: 500 }
    );
  }
}

/**
 * Get current week's expiry date in format "25-Nov-2025"
 */
function getCurrentExpiry(): string {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 4 = Thursday
  
  // Find next Thursday (FNO expiry day)
  let daysUntilThursday = 4 - dayOfWeek;
  if (daysUntilThursday <= 0) {
    daysUntilThursday += 7; // Next week's Thursday
  }
  
  const expiryDate = new Date(now);
  expiryDate.setDate(now.getDate() + daysUntilThursday);
  
  // Format as "25-Nov-2025"
  const day = expiryDate.getDate();
  const month = expiryDate.toLocaleString('en-US', { month: 'short' });
  const year = expiryDate.getFullYear();
  
  return `${day}-${month}-${year}`;
}

/**
 * POST endpoint for custom filtering
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as HeatmapParams;
    
    const response = await fetch('https://www.research360.in/ajax/heatmapAPIHandler.php', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'origin': 'https://www.research360.in',
        'referer': 'https://www.research360.in/future-and-options/heatmap',
        'user-agent': 'Mozilla/5.0',
        'x-requested-with': 'XMLHttpRequest',
      },
      body: new URLSearchParams({
        ...body,
        page: 'heatmap'
      }).toString()
    });
    
    if (!response.ok) {
      throw new Error(`Research360 API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data
    });
    
  } catch (error) {
    console.error('F&O Heatmap POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch heatmap data'
      },
      { status: 500 }
    );
  }
}

