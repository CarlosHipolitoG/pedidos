// IMPORTANT: This file is a simplified in-memory "database" for demonstration purposes.
// In a real-world application, you would replace this with a proper database like Firebase Firestore, Supabase, or a relational database.

import {NextRequest, NextResponse} from 'next/server';
import {initialProductsData} from '@/lib/products';
import {initialUsersData} from '@/lib/users';
import {initialSettings} from '@/lib/settings';

// This object will hold the state in memory on the server.
// It will be reset if the server restarts.
let serverDataStore = {
  products: initialProductsData,
  users: initialUsersData,
  orders: [],
  settings: initialSettings,
};

// A simple lock to prevent race conditions during writes
let isWriting = false;

/**
 * Handles GET requests to fetch the current state of all data.
 */
export async function GET() {
  return NextResponse.json(serverDataStore);
}

/**
 * Handles POST requests to update the state of the data.
 * The entire data object is sent in the body of the request.
 */
export async function POST(request: NextRequest) {
  // Wait if a write operation is already in progress
  while (isWriting) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  isWriting = true;

  try {
    const newData = await request.json();
    // Basic validation to ensure we're not overwriting with garbage
    if (newData && newData.products && newData.users && newData.orders && newData.settings) {
      serverDataStore = newData;
      return NextResponse.json({status: 'success'});
    } else {
      return NextResponse.json({status: 'error', message: 'Invalid data structure'}, {status: 400});
    }
  } catch (error) {
    return NextResponse.json({status: 'error', message: 'Failed to parse request body'}, {status: 500});
  } finally {
    isWriting = false;
  }
}
