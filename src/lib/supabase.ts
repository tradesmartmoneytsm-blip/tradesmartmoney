import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Public client (for client-side operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service client (for server-side operations with elevated permissions)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

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