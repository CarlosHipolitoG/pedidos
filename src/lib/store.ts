
'use client';

import {useState, useEffect} from 'react';
import type {Order} from './orders';
import type {Product} from './products';
import type {User} from './users';
import type {Settings} from './settings';
import { initialUsersData, initialSettings } from './initial-data';
import { supabase } from './supabaseClient';


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
    users: [],
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
    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        await this.fetchData();
      } catch (error) {
        console.error('Initialization failed during first fetch:', error);
        // Fallback to local data if API fails on first load
        this.state = {
            orders: [],
            products: [],
            users: initialUsersData,
            settings: initialSettings
        };
      } finally {
        this.isInitialized = true;
        this.broadcast();
        this.initializeRealtimeSync(); // Set up real-time listeners AFTER initial data is set.
        this.initializationPromise = null;
      }
    })();
    return this.initializationPromise;
  }
  
  private async fetchData() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            console.warn(`[AppStore] Failed to fetch data. Status: ${response.status}. The app will continue with local data.`);
            return;
        }
        const data = await response.json();
        // Only broadcast if there are actual changes
        if (JSON.stringify(this.state) !== JSON.stringify(data)) {
            this.state = data;
            this.broadcast();
        }
    } catch (error) {
        console.error("[AppStore] Fetching data failed:", error);
        // re-throw to be caught by initializer
        throw error;
    }
  }

  private initializeRealtimeSync() {
    // Ensure we only have one channel subscription.
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }

    const channel = supabase.channel('public-db-changes');
    
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'productos' },
      (payload) => {
        console.log('Realtime change received on productos!', payload);
        this.fetchData();
      }
    );

    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      (payload) => {
        console.log('Realtime change received on orders!', payload);
        this.fetchData();
      }
    );

    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'users' },
      (payload) => {
        console.log('Realtime change received on users!', payload);
        this.fetchData();
      }
    );

    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'settings' },
      (payload) => {
        console.log('Realtime change received on settings!', payload);
        this.fetchData();
      }
    );

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
          supabase.removeChannel(this.realtimeChannel);
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

        try {
          await fetch('/api/data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state),
          });
        } catch (error) {
          console.error('Failed to save state to server:', error);
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
    store.ensureInitialized().then(() => {
      setIsInitialized(store.getIsInitialized());
      setState(store.getState());
    });
    
    const unsubscribe = store.subscribe((newState) => {
        setState(newState);
        setIsInitialized(store.getIsInitialized());
    });

    return unsubscribe;
  }, []);

  return { state, isInitialized };
}
