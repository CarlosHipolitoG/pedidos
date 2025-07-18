
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
    settings: {barName: '', logoUrl: '', backgroundUrl: '', promotionalImages: []},
  };
  private listeners: Set<(state: AppData) => void> = new Set();
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

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
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch initial data');
        const data = await response.json();
        this.state = data;
        this.isInitialized = true;
        this.broadcast();
      } catch (error) {
        console.error('Initialization failed:', error);
        // In case of failure, you might want to set a default state or handle it differently
      } finally {
        this.initializationPromise = null;
      }
    })();
    return this.initializationPromise;
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
    const unsubscribe = store.subscribe((newState) => {
        setState(newState);
        if (!isInitialized && store.getIsInitialized()) {
            setIsInitialized(true);
        }
    });

    // Ensure we are initialized when the component mounts
    // This handles the case where the component mounts after initialization is complete
    store.ensureInitialized().then(() => {
        setState(store.getState());
        setIsInitialized(store.getIsInitialized());
    });

    return unsubscribe;
  }, [isInitialized]); // Depend on isInitialized to re-check if needed

  return { state, isInitialized };
}

// A hook that polls the server for updates to ensure sync
// This is a fallback for cases where another browser/device updates the data.
// In a real production app, you would use WebSockets for this.
export function useDataSync() {
    const POLLING_INTERVAL = 5000; // Poll every 5 seconds

    const fetchAndUpdate = useCallback(async () => {
        try {
            const response = await fetch('/api/data');
            if (!response.ok) return;
            const serverData = await response.json();
            
            // Simple check to see if data is different before forcing an update
            if (JSON.stringify(serverData) !== JSON.stringify(store.getState())) {
                 store.updateState(currentState => ({ ...currentState, ...serverData }));
            }
        } catch (error) {
            // console.error("Polling failed:", error);
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(fetchAndUpdate, POLLING_INTERVAL);
        return () => clearInterval(intervalId);
    }, [fetchAndUpdate]);
}
