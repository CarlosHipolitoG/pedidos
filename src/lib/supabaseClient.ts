
import { createClient } from '@supabase/supabase-js'
import type { AppData } from './store'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in .env file')
}

export const supabase = createClient<AppData>(supabaseUrl, supabaseAnonKey)
