import { NextResponse } from 'next/server';
import { GET as fiiDiiDataHandler } from '../../fii-dii-data/route';

async function handleCronExecution() {
  try {
    console.log('🕐 CRON: Starting daily FII/DII data collection...');
    
    // Call the FII/DII data collection function directly instead of HTTP request
    const response = await fiiDiiDataHandler();
    const result = await response.json();
    
    console.log(`✅ CRON: Data collection completed successfully`);
    
    return NextResponse.json({
      success: true,
      message: 'Daily FII/DII data collection completed',
      timestamp: new Date().toISOString(),
      result
    });

  } catch (error) {
    console.error('❌ CRON: FII/DII data collection failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Handle both POST (from cron/GitHub Actions) and GET (for testing)
export async function POST() {
  return handleCronExecution();
}

export async function GET() {
  return handleCronExecution();
} 