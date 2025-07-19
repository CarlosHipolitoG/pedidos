
'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Global variable for the Supabase client singleton
let supabase: SupabaseClient | undefined;

// Mock client for server-side rendering or when variables are missing
const mockSupabase = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: { message: 'Mock client used', details: 'Environment variables likely missing', hint: '' } }),
    insert: (data: any) => Promise.resolve({ data, error: null }),
    update: (data: any) => Promise.resolve({ data, error: null }),
    delete: () => Promise.resolve({ data: [], error: null }),
    upsert: (data: any) => Promise.resolve({ data, error: null }),
  }),
  channel: (name: string) => ({
    on: () => mockSupabase.channel(name),
    subscribe: (callback: (status: string, err?: Error) => void) => {
      if (typeof callback === 'function') {
        // Immediately call with a mock status to prevent hangs
        callback('SUBSCRIBED');
      }
      return mockSupabase.channel(name);
    },
  }),
  removeChannel: (channel: any) => {},
};

/**
 * Gets the Supabase client.
 * Implements a lazy singleton pattern to ensure the client is created only once.
 */
export function getClient(): SupabaseClient {
  // If we're on the server, always return the mock client.
  if (typeof window === 'undefined') {
    return mockSupabase as unknown as SupabaseClient;
  }
  
  // If the client instance already exists, return it.
  if (supabase) {
    return supabase;
  }

  // Get the Supabase URL and Key from environment variables.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If the variables are not set, return the mock client instead of throwing an error.
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not found. Using mock client. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.");
    return mockSupabase as unknown as SupabaseClient;
  }

  // Create, store, and return the Supabase client instance.
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  return supabase;
}
