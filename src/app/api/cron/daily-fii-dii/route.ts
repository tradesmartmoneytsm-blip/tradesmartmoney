import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🕐 CRON: Starting daily FII/DII data collection...');
    
    // Call our existing FII/DII data collection API
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/fii-dii-data`, {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error(`FII/DII data collection failed: ${response.status}`);
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