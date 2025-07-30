
'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- Singleton Pattern for Supabase Client ---

// Declare a global variable to hold the client instance.
// Using `globalThis` ensures it works across different environments (browser, server, serverless).
declare global {
  var supabase: SupabaseClient | undefined;
}

let supabase: SupabaseClient | undefined = globalThis.supabase;

// This function gets or creates the Supabase client instance.
export function getClient(): SupabaseClient {
  // If the instance doesn't exist, create it.
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase URL and anonymous key are not configured in client environment variables.");
    }
    
    // Create the client instance.
    supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Store the created instance in the global scope.
    globalThis.supabase = supabase;
  }

  // Return the single, shared instance.
  return supabase;
}
