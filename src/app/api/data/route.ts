
import {NextRequest, NextResponse} from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// A simple lock to prevent race conditions during writes
let isWriting = false;

/**
 * Handles GET requests to fetch the current state of all data from Supabase.
 */
export async function GET() {
  try {
    const [productsRes, usersRes, ordersRes, settingsRes] = await Promise.all([
      supabase.from('products').select('*').order('id', { ascending: true }),
      supabase.from('users').select('*').order('id', { ascending: true }),
      supabase.from('orders').select('*').order('timestamp', { ascending: false }),
      supabase.from('settings').select('*').limit(1).single(),
    ]);

    if (productsRes.error) throw productsRes.error;
    if (usersRes.error) throw usersRes.error;
    if (ordersRes.error) throw ordersRes.error;
    if (settingsRes.error) throw settingsRes.error;

    const serverDataStore = {
      products: productsRes.data || [],
      users: usersRes.data || [],
      orders: ordersRes.data || [],
      settings: settingsRes.data || { barName: '', logoUrl: '', backgroundUrl: '', promotionalImages: [] },
    };
    
    return NextResponse.json(serverDataStore);
  } catch(error) {
     console.error("Error fetching data from Supabase:", error);
     return NextResponse.json({ status: 'error', message: 'Failed to fetch data from Supabase' }, { status: 500 });
  }
}

/**
 * Handles POST requests to update the state of the data in Supabase.
 */
export async function POST(request: NextRequest) {
  // Wait if a write operation is already in progress
  while (isWriting) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  isWriting = true;

  try {
    const newData = await request.json();
    
    // In a real Supabase app, you'd handle granular updates (e.g., upserting a single product)
    // For this migration, we'll replace the data to mimic the old logic, though this is inefficient.
    // NOTE: This assumes you have RLS policies that allow these operations.
    // It's generally better to handle updates via specific API endpoints or RPC functions.

    const { products, users, orders, settings } = newData;

    const operations = [];

    // Products
    if (products) {
        // Simple approach: delete all and insert new. Inefficient for large datasets.
        operations.push(supabase.from('products').delete().neq('id', -1));
        operations.push(supabase.from('products').insert(products));
    }
    // Users
     if (users) {
        operations.push(supabase.from('users').delete().neq('id', -1));
        operations.push(supabase.from('users').insert(users));
    }
    // Orders
     if (orders) {
        operations.push(supabase.from('orders').delete().neq('id', -1));
        operations.push(supabase.from('orders').insert(orders));
    }
    // Settings - assuming one row with a known id, e.g., 1
    if (settings) {
        operations.push(supabase.from('settings').update(settings).eq('id', 1));
    }

    const results = await Promise.all(operations);
    const firstError = results.find(res => res.error);

    if (firstError && firstError.error) {
       throw firstError.error;
    }

    return NextResponse.json({status: 'success'});

  } catch (error) {
    console.error("Error writing data to Supabase:", error);
    return NextResponse.json({status: 'error', message: 'Failed to write data to Supabase' }, {status: 500});
  } finally {
    isWriting = false;
  }
}
