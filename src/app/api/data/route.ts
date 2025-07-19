
import {NextRequest, NextResponse} from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * Handles GET requests to fetch the current state of all data from Supabase.
 * This function is now much simpler and only reads data.
 */
export async function GET() {
  try {
    const { data: products, error: productsError } = await supabase.from('productos').select('*');
    if (productsError) throw productsError;

    const { data: users, error: usersError } = await supabase.from('users').select('*');
    if (usersError) throw usersError;

    const { data: orders, error: ordersError } = await supabase.from('orders').select('*');
    if (ordersError) throw ordersError;
    
    const { data: settings, error: settingsError } = await supabase.from('settings').select('*');
    if (settingsError) throw settingsError;

    const settingsObject = settings && settings.length > 0 ? settings[0] : null;

    return NextResponse.json({
        products: products || [],
        users: users || [],
        orders: orders || [],
        settings: settingsObject
    });
  } catch(error: any) {
      console.error("Error fetching data from Supabase:", error);
       return NextResponse.json({
          message: `Error fetching data: ${error.message}`,
          products: [],
          users: [],
          orders: [],
          settings: null,
       }, { status: 500 });
  }
}
