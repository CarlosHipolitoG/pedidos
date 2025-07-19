import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabaseInstance;

// This check allows the project to build on Vercel/Netlify without having the environment variables set.
// The real connection will be established on the client-side where the env vars are available.
if (supabaseUrl && supabaseAnonKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn("Supabase environment variables not found. Using a mock client. THIS IS EXPECTED DURING BUILD, BUT NOT IN PRODUCTION RUNTIME.");
  // Create a mock client that won't throw errors but will have no functionality.
  // This allows the build process (which might not have env vars) to complete.
  const mockSupabase = {
    from: () => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => ({ data: [], error: { message: 'Mock client', details: 'Not configured' } }),
      update: async () => ({ data: [], error: { message: 'Mock client', details: 'Not configured' } }),
      delete: async () => ({ data: [], error: { message: 'Mock client', details: 'Not configured' } }),
      upsert: async () => ({ data: [], error: { message: 'Mock client', details: 'Not configured' } }),
    }),
  };
  supabaseInstance = mockSupabase as any;
}

export const supabase = supabaseInstance;
