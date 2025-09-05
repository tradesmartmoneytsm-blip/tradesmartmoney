import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🕐 CRON: Starting daily FII/DII data collection...');
    
    // Use the correct production URL for Vercel
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://tradesmartmoney.vercel.app';
    
    console.log(`📡 CRON: Calling ${baseUrl}/api/fii-dii-data`);
    
    // Call our existing FII/DII data collection API
    const response = await fetch(`${baseUrl}/api/fii-dii-data`, {
      method: 'GET'
    });
    
    console.log(`📊 CRON: Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error');
      console.log(`❌ CRON: Error response: ${errorText}`);
      throw new Error(`FII/DII data collection failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    console.log('✅ CRON: Daily FII/DII data collection completed');
    
    return NextResponse.json({
      success: true,
      message: 'Daily FII/DII data collection completed',
      timestamp: new Date().toISOString(),
      result: result
    });
    
  } catch (error) {
    console.error('❌ CRON: Daily FII/DII data collection failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Allow GET requests for manual testing
export async function GET() {
  return POST();
} 