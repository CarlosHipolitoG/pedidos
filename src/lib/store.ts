
'use client';

import {useState, useEffect} from 'react';
import type {Order} from './orders';
import type {Product} from './products';
import type {User} from './users';
import type {Settings} from './settings';
import { initialUsersData, initialSettings, initialProductsData } from './initial-data';
import { getClient } from './supabaseClient';


// Define the shape of our entire application's data
export type AppData = {
  orders: Order[];
  products: Product[];
  users: User[];
  settings: Settings;
};

// This class will manage the application's state.
class AppStore {
  private static instance: AppStore;
  private state: AppData = {
    orders: [],
    products: [],
    users: initialUsersData, // Start with default users
    settings: initialSettings,
  };
  private listeners: Set<(state: AppData) => void> = new Set();
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;
  private realtimeChannel: any = null;


  private constructor() {}

  public static getInstance(): AppStore {
    if (!AppStore.instance) {
      AppStore.instance = new AppStore();
    }
    return AppStore.instance;
  }

  // Fetch initial data from the server
  private async initialize() {
    // Prevent initialization on the server
    if (typeof window === 'undefined') {
        return;
    }

    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        await this.fetchData(); // Perform the initial fetch
        
        // Only start realtime sync if a privileged user is logged in.
        const userName = localStorage.getItem('userName');
        if (userName) {
            const user = this.state.users.find(u => u.name === userName);
            if (user && (user.role === 'admin' || user.role === 'waiter')) {
                this.initializeRealtimeSync();
            }
        }

      } catch (error) {
        console.error("[AppStore] Initialization failed, falling back to local data:", error);
        // Fallback to initial data if fetch fails
        this.state = {
            orders: [],
            products: initialProductsData,
            users: initialUsersData,
            settings: initialSettings
        };
      } finally {
        this.isInitialized = true;
        this.broadcast();
        this.initializationPromise = null;
      }
    })();
    return this.initializationPromise;
  }
  
  public async fetchData() {
    try {
        const supabase = getClient();
        
        const { data: products, error: productsError } = await supabase.from('productos').select('*');
        if (productsError) throw productsError;

        // The 'orders' table might not exist yet, so we'll handle this gracefully.
        const { data: orders, error: ordersError } = await supabase.from('orders').select('*').order('timestamp', { ascending: false });
        if (ordersError) {
          console.warn("Could not fetch orders, maybe the table doesn't exist yet.", ordersError.message);
        }
        
        this.state.products = products || initialProductsData;
        this.state.orders = orders || [];


    } catch (error: any) {
        console.error("[AppStore] Fetching data failed, using fallback data:", error.message);
        // If fetching fails, we stick with the initial local data
        this.state.products = initialProductsData;
        this.state.orders = [];
    } finally {
        // Broadcast changes to all subscribed components
        this.broadcast();
    }
  }

  private initializeRealtimeSync() {
    const supabase = getClient();
    if (typeof window === 'undefined' || this.realtimeChannel) {
        return;
    }
    
    console.log("Attempting to initialize realtime sync...");

    const handleDbChange = (payload: any) => {
        console.log(`Realtime change received!`, payload);
        this.fetchData(); 
    };

    const channel = supabase.channel('public-changes');
    channel
      .on('postgres_changes', { event: '*', schema: 'public' }, handleDbChange)
      .subscribe((status, err) => { 
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to Supabase Realtime!');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Realtime subscription error:', err);
        }
         if (status === 'TIMED_OUT') {
          console.warn('Realtime subscription timed out.');
        }
    });

    this.realtimeChannel = channel;
  }

  // Subscribe to state changes
  public subscribe(listener: (state: AppData) => void): () => void {
    this.listeners.add(listener);
    if (this.isInitialized) {
      listener(this.state);
    }
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0 && this.realtimeChannel) {
          getClient().removeChannel(this.realtimeChannel);
          this.realtimeChannel = null;
          console.log("Removed realtime channel.");
      }
    };
  }

  private broadcast() {
    this.listeners.forEach(listener => listener(this.state));
  }
  
  public getState(): AppData {
    return this.state;
  }

  public async updateState(updater: (currentState: AppData) => AppData) {
    await this.ensureInitialized();
    
    this.state = updater(this.state);
    
    this.broadcast();
  }

  public async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  public getIsInitialized(): boolean {
      return this.isInitialized;
  }
}

export const store = AppStore.getInstance();

export function useAppStore() {
  const [state, setState] = useState(() => store.getState());
  const [isInitialized, setIsInitialized] = useState(() => store.getIsInitialized());

  useEffect(() => {
    // Only run on the client
    if (typeof window !== 'undefined') {
        store.ensureInitialized().then(() => {
          setIsInitialized(store.getIsInitialized());
          setState(store.getState());
        });
        
        const unsubscribe = store.subscribe((newState) => {
            setState(newState);
            setIsInitialized(store.getIsInitialized());
        });

        return unsubscribe;
    }
  }, []);

  return { state, isInitialized };
}
