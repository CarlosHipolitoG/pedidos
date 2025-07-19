
import {NextRequest, NextResponse} from 'next/server';
import { initialProductsData, initialUsersData, initialSettings } from '@/lib/initial-data';
import type { AppData } from '@/lib/store';

// This acts as a simple in-memory database for the demo.
let serverDataStore: AppData = {
  products: initialProductsData,
  users: initialUsersData,
  orders: [], // Orders start empty
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
 */
export async function POST(request: NextRequest) {
  // Wait if a write operation is already in progress
  while (isWriting) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  isWriting = true;

  try {
    const newData = await request.json();
    // Replace the entire in-memory store with the new data from the client
    serverDataStore = newData;
    return NextResponse.json({status: 'success'});
  } catch (error) {
    console.error("Error writing data:", error);
    return NextResponse.json({status: 'error', message: 'Failed to write data' }, {status: 500});
  } finally {
    isWriting = false;
  }
}
