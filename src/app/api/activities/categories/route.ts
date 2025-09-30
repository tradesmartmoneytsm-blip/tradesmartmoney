import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export interface ActivityCategory {
  id: number;
  name: string;
  display_name: string;
  icon: string;
  color: string;
  is_active: boolean;
  sort_order: number;
}

// GET /api/activities/categories - Fetch all activity categories
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('activity_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error('Failed to fetch categories');
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Categories API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
