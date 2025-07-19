import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Global variable for the Supabase client singleton
let supabase: SupabaseClient | undefined;

// Mock client for server-side rendering or when variables are missing
const mockSupabase = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: (data: any) => Promise.resolve({ data, error: null }),
    update: (data: any) => Promise.resolve({ data, error: null }),
    delete: () => Promise.resolve({ data: [], error: null }),
    upsert: (data: any) => Promise.resolve({ data, error: null }),
  }),
  channel: (name: string) => ({
    on: (event: any, filter: any, callback: any) => mockSupabase.channel(name),
    subscribe: (callback: (status: string, err?: Error) => void) => {
      if (typeof callback === 'function') {
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

  // If the variables are not set on the client, throw an error.
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and anonymous key must be provided in .env");
  }

  // Create, store, and return the Supabase client instance.
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  return supabase;
}
