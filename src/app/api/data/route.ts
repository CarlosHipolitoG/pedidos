
import {NextRequest, NextResponse} from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { initialProductsData } from '@/lib/initial-data';

/**
 * Handles GET requests to fetch the current state of all data from Supabase.
 * This function is now much simpler and only reads data.
 */
export async function GET() {
  try {
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
