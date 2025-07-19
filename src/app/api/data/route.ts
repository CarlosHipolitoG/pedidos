
import {NextRequest, NextResponse} from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { initialProductsData, initialUsersData, initialSettings } from '@/lib/initial-data';
import type { AppData } from '@/lib/store';

// A simple lock to prevent race conditions during writes
let isWriting = false;

/**
 * Handles GET requests to fetch the current state of all data.
 * It prioritizes data from Supabase and falls back to initial mock data if Supabase returns nothing.
 */
export async function GET() {
  try {
    const [productsRes, usersRes, ordersRes, settingsRes] = await Promise.all([
      supabase.from('products').select('*').order('id', { ascending: true }),
      supabase.from('users').select('*').order('id', { ascending: true }),
      supabase.from('orders').select('*').order('timestamp', { ascending: false }),
      supabase.from('settings').select('*').limit(1).single(),
    ]);

    // Error handling can be more granular, but for now, we'll log and continue
    if (productsRes.error) console.warn("Supabase products fetch error:", productsRes.error.message);
    if (usersRes.error) console.warn("Supabase users fetch error:", usersRes.error.message);
    if (ordersRes.error) console.warn("Supabase orders fetch error:", ordersRes.error.message);
    if (settingsRes.error) console.warn("Supabase settings fetch error:", settingsRes.error.message);
    
    // Fallback logic: If Supabase returns no data (e.g., empty table or RLS blocks it), use initial data.
    const serverDataStore: AppData = {
      products: productsRes.data && productsRes.data.length > 0 ? productsRes.data : initialProductsData,
      users: usersRes.data && usersRes.data.length > 0 ? usersRes.data : initialUsersData,
      orders: ordersRes.data || [], // Orders usually start empty
      settings: settingsRes.data || initialSettings,
    };
    
    return NextResponse.json(serverDataStore);
  } catch(error) {
     console.error("Error fetching data from Supabase:", error);
     // Fallback to initial data on catastrophic failure
     const fallbackData = {
        products: initialProductsData,
        users: initialUsersData,
        orders: [],
        settings: initialSettings
     }
     return NextResponse.json(fallbackData);
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

    // Products - Upsert is safer and more efficient than delete/insert
    if (products) {
        operations.push(supabase.from('products').upsert(products, { onConflict: 'id' }));
    }
    // Users - Upsert
     if (users) {
        operations.push(supabase.from('users').upsert(users, { onConflict: 'id' }));
    }
    // Orders - Upsert
     if (orders) {
        operations.push(supabase.from('orders').upsert(orders, { onConflict: 'id' }));
    }
    // Settings - assuming one row with a known id, e.g., 1
    if (settings) {
        // Upsert with a known ID to create if it doesn't exist
        operations.push(supabase.from('settings').upsert({ ...settings, id: 1 }));
    }

    const results = await Promise.allSettled(operations);
    
    const errors = results.filter(res => res.status === 'rejected' || (res.status === 'fulfilled' && res.value?.error));
    if (errors.length > 0) {
       console.error("Errors during Supabase write operation:", errors);
       // We won't throw an error to the client, but log it server-side
    }

    return NextResponse.json({status: 'success'});

  } catch (error) {
    console.error("Error writing data to Supabase:", error);
    return NextResponse.json({status: 'error', message: 'Failed to write data to Supabase' }, {status: 500});
  } finally {
    isWriting = false;
  }
}
