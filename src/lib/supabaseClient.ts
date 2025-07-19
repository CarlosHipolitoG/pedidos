import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// A mock client for server-side rendering, where environment variables might not be available.
// This allows the application to build without errors.
const mockSupabase = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: [], error: null }),
    delete: () => Promise.resolve({ data: [], error: null }),
    upsert: () => Promise.resolve({ data: [], error: null }),
  }),
  channel: () => ({
    on: () => mockSupabase.channel(), // Return the mock channel to allow chaining
    subscribe: (callback: (status: string, err?: Error) => void) => {
      // Immediately call back with a 'SUBSCRIBED' status for consistency.
      if (typeof callback === 'function') {
        callback('SUBSCRIBED');
      }
      return mockSupabase.channel(); // Return for chaining
    },
  }),
  removeChannel: () => {},
};

const supabase = typeof window === 'undefined'
  ? mockSupabase
  : createClient(supabaseUrl, supabaseAnonKey);


export { supabase };