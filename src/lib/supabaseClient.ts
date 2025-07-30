
'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- Singleton Pattern for Supabase Client ---
let supabase: SupabaseClient | undefined;

export function getClient(): SupabaseClient {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase URL and anonymous key are not configured in client environment variables.");
    }
    
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabase;
}
