import { NextResponse } from 'next/server';

interface AdvanceDeclineData {
  date: string;
  advances: number;
  declines: number;
}

export async function GET() {
  try {
    console.log('🔄 Fetching advance-decline data...');
    
    const response = await fetch('https://api.vrdnation.org/service/advance-decline/details/1', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 60 } // 1 minute cache
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data: AdvanceDeclineData[] = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid or empty data received');
    }

    // Sort data by date to ensure chronological order
    const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    console.log(`✅ Successfully fetched ${sortedData.length} advance-decline records`);

    return NextResponse.json({
      success: true,
      data: sortedData,
      count: sortedData.length,
      lastUpdated: sortedData[sortedData.length - 1]?.date || new Date().toISOString(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Advance-decline API error:', error);
    
    // Return fallback data
    const fallbackData: AdvanceDeclineData[] = [
      { date: '2025-09-22T15:30:00', advances: 650, declines: 1202 },
      { date: '2025-09-22T15:29:00', advances: 647, declines: 1209 },
      { date: '2025-09-22T15:28:00', advances: 640, declines: 1211 },
      { date: '2025-09-22T15:27:00', advances: 634, declines: 1212 },
      { date: '2025-09-22T15:26:00', advances: 638, declines: 1208 }
    ];

    return NextResponse.json({
      success: false,
      message: 'Using fallback data due to API error',
      data: fallbackData,
      count: fallbackData.length,
      lastUpdated: fallbackData[0].date,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
