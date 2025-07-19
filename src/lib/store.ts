
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
        this.initializeRealtimeSync(); // Set up real-time listeners AFTER initial data is set.
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
  
  private async fetchData() {
    try {
        const supabase = getClient();
        const { data: products, error: productsError } = await supabase.from('productos').select('*');
        if (productsError) throw productsError;

        const { data: users, error: usersError } = await supabase.from('users').select('*');
        if (usersError) throw usersError;

        const { data: orders, error: ordersError } = await supabase.from('orders').select('*');
        if (ordersError) throw ordersError;
        
        const { data: settings, error: settingsError } = await supabase.from('settings').select('*');
        if (settingsError) throw settingsError;

        const settingsObject = settings && settings.length > 0 ? settings[0] : initialSettings;
        
        const hasProducts = products && products.length > 0;

        const newState = {
            products: hasProducts ? products : initialProductsData,
            users: (users && users.length > 0) ? users : initialUsersData,
            orders: orders || [],
            settings: settingsObject
        };
        
        if (!hasProducts && initialProductsData.length > 0) {
            console.log("No products found in the database. Seeding with initial data.");
            const { error: seedError } = await supabase.from('productos').upsert(initialProductsData);
            if (seedError) {
                console.error("Error seeding products:", seedError);
            }
        }
        
        this.state = newState;

    } catch (error: any) {
        console.error("[AppStore] Fetching data failed, using fallback data:", error.message);
        // If fetching fails, we stick with the initial local data
        this.state = {
            orders: [],
            products: initialProductsData,
            users: initialUsersData,
            settings: initialSettings
        };
    } finally {
        this.broadcast();
    }
  }

  private initializeRealtimeSync() {
    // Prevent initialization on the server
    const supabase = getClient();
    if (typeof window === 'undefined' || !supabase.channel) {
        return;
    }
    // Ensure we only have one channel subscription.
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
    
    const channel = supabase.channel('public-db-changes');
    
    const tables = ['productos', 'orders', 'users', 'settings'];
    tables.forEach(table => {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: table },
        (payload) => {
          console.log(`Realtime change received on ${table}!`, payload);
          this.fetchData();
        }
      );
    });

    channel.subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to Supabase Realtime!');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Realtime subscription error:', err);
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
    
    const newState = updater(this.state);
    const hasChanges = JSON.stringify(this.state) !== JSON.stringify(newState);
    
    this.state = newState;
    
    if (hasChanges) {
        this.broadcast();
        
        const supabase = getClient();

        // No need to use the API route anymore, just write directly
        try {
            if (newState.products && newState.products.length > 0) {
              const { error } = await supabase.from('productos').upsert(newState.products);
              if (error) console.error("Error saving products", error);
            }
            if (newState.users && newState.users.length > 0) {
              const { error } = await supabase.from('users').upsert(newState.users);
              if (error) console.error("Error saving users", error);
            }
             if (newState.orders && newState.orders.length > 0) {
              const { error } = await supabase.from('orders').upsert(newState.orders);
              if (error) console.error("Error saving orders", error);
            }
            if (newState.settings) {
              const { error } = await supabase.from('settings').upsert(newState.settings);
              if (error) console.error("Error saving settings", error);
            }
        } catch (error) {
          console.error('Failed to save state to Supabase:', error);
        }
    }
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
