import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Direct fetch from Supabase REST API
    const response = await fetch(
      'https://ejnuocizpsfcobhyxgrd.supabase.co/rest/v1/momentum_stocks?select=*&order=market_cap.desc&limit=50',
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbnVvY2l6cHNmY29iaHl4Z3JkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAxMjAyMCwiZXhwIjoyMDcyNTg4MDIwfQ.VvnrQCXDcya-pHhKn7Jp9bUgzj61eLFrdO8r-0fZhmY',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbnVvY2l6cHNmY29iaHl4Z3JkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAxMjAyMCwiZXhwIjoyMDcyNTg4MDIwfQ.VvnrQCXDcya-pHhKn7Jp9bUgzj61eLFrdO8r-0fZhmY'
        }
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Database query failed' },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data,
      count: data.length,
      message: `Found ${data.length} momentum stocks`
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
