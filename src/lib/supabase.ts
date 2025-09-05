import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Public client (for client-side operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service client (for server-side operations with elevated permissions)  
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-anon-key' && 
         supabaseServiceKey !== 'placeholder-service-key'
}

// Types for FII/DII data
export interface FiiDiiData {
  id?: number
  date: string
  category: 'FII' | 'DII'
  buy_value: number    // in crores
  sell_value: number   // in crores
  net_value: number    // in crores
  created_at?: string
}

export interface FiiDiiSummary {
  date: string
  fii_buy: number
  fii_sell: number
  fii_net: number
  dii_buy: number
  dii_sell: number
  dii_net: number
  net_combined: number
} 