
'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Global variable for the Supabase client singleton for use in the browser
let supabase: SupabaseClient | undefined;

// This function should only be called from client components
export function getClient(): SupabaseClient {
  // If the client instance already exists, return it.
  if (supabase) {
    return supabase;
  }

  // Get the Supabase URL and Key from environment variables.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and anonymous key must be provided in environment variables for the client.");
  }

  // Create, store, and return the Supabase client instance.
  // This instance uses the public 'anon' key, safe for client-side use.
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  return supabase;
}
