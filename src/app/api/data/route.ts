
import {NextRequest, NextResponse} from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initialProductsData } from '@/lib/initial-data';

// This file is no longer used for the main data fetching, 
// but is kept in case it's needed for other server-side-only operations in the future.

/**
 * Handles GET requests to fetch the current state of all data from Supabase.
 * This function is now much simpler and only reads data.
 */
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase credentials are not configured in environment variables.");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: products, error: productsError } = await supabase.from('productos').select('*');
    if (productsError) throw productsError;

    // For now, we only care about products. The other tables might not exist.
    // We return empty arrays or null for the others to keep the structure.
    return NextResponse.json({
        products: products || [],
        users: [],
        orders: [],
        settings: null
    });
  } catch(error: any) {
      console.error("Error fetching data from Supabase:", error);
       return NextResponse.json({
          message: `Error fetching data: ${error.message}`,
          products: initialProductsData, // Fallback to initial data on error
          users: [],
          orders: [],
          settings: null,
       }, { status: 500 });
  }
}
