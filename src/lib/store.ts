
'use client';

import {useState, useEffect, useCallback} from 'react';
import type {Order} from './orders';
import type {Product} from './products';
import type {User} from './users';
import type {Settings} from './settings';


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
    settings: { barName: '', logoUrl: '', backgroundUrl: '', promotionalImages: [] },
  };
  private listeners: Set<(state: AppData) => void> = new Set();
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;
  private pollingInterval: NodeJS.Timeout | null = null;


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
        this.isInitialized = true;
        this.broadcast();
        this.startPolling();
      } catch (error) {
        console.error('Initialization failed:', error);
        // Fallback to initial data if API fails on first load
        this.isInitialized = true;
        this.broadcast();
        this.startPolling();
      } finally {
        this.initializationPromise = null;
      }
    })();
    return this.initializationPromise;
  }
  
  private async fetchData() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            // Log the error quietly instead of throwing, to avoid console spam if DB is offline
            console.warn(`[AppStore] Failed to fetch data. Status: ${response.status}. The app will continue with local data.`);
            return;
        }
        const data = await response.json();

        // Simple deep-ish compare to see if an update is needed
        if (JSON.stringify(this.state) !== JSON.stringify(data)) {
            this.state = data;
            this.broadcast();
        }
    } catch (error) {
        console.warn("[AppStore] Polling failed:", error);
    }
  }
  
  private startPolling(interval = 5000) {
      if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
      }
      this.pollingInterval = setInterval(() => this.fetchData(), interval);
  }

  // Subscribe to state changes
  public subscribe(listener: (state: AppData) => void): () => void {
    this.listeners.add(listener);
    // Immediately call listener with current state if initialized
    if (this.isInitialized) {
      listener(this.state);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Notify all listeners of a state change
  private broadcast() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Get the current state
  public getState(): AppData {
    return this.state;
  }

  // Update the state and notify the server
  public async updateState(updater: (currentState: AppData) => AppData) {
    // Ensure we are initialized before updating
    await this.ensureInitialized();
    
    // Stop polling to prevent race conditions
    if (this.pollingInterval) clearInterval(this.pollingInterval);

    const newState = updater(this.state);
    this.state = newState;

    // Immediately update local UI
    this.broadcast();

    // Persist the new state to the server
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
      // Optional: handle save failure (e.g., show a toast to the user)
    } finally {
        // Resume polling
        this.startPolling();
    }
  }

  // A helper to ensure initialization is complete before any action
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

// A generic hook to subscribe to the store's state
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
