import { createClient } from '@supabase/supabase-js'

let supabase: any;

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

// Check if we are running on the client side
if (typeof window !== 'undefined') {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and anonymous key are required on the client side.");
  }
  supabase = createClient(supabaseUrl, supabaseAnonKey);

} else {
  // We are on the server, use the mock client
  supabase = mockSupabase;
}

export { supabase };
