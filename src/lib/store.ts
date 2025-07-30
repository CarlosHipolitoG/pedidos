
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
    // Prevent initialization on the server
    if (typeof window === 'undefined') {
        return;
    }

    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        await this.fetchData(); // Perform the initial fetch
        
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            const user = this.state.users.find(u => u.email === userEmail);
            if (user && (user.role === 'admin' || user.role === 'waiter')) {
                this.setupRealtimeListeners();
            }
        }

      } catch (error) {
        // Fallback to initial data if fetch fails
        console.error("Initialization failed, falling back to initial data:", error);
        this.state = {
            orders: [],
            products: initialProductsData.map((p, i) => ({ ...p, id: i + 1 })),
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
        
        // Parallel fetching for better performance
        const [productsResponse, ordersResponse, settingsResponse, usersResponse] = await Promise.all([
            supabase.from('products').select('*').order('id', { ascending: true }),
            supabase.from('orders').select('*').order('timestamp', { ascending: false }),
            supabase.from('settings').select('settings_data').eq('id', 1).single(), // Use single() for one expected row
            supabase.from('users').select('*').order('id', { ascending: true }),
        ]);
        
        // Handle Products
        if (productsResponse.error) {
            console.warn("Could not fetch products, using initial data.", productsResponse.error);
            this.state.products = initialProductsData.map((p, i) => ({ ...p, id: i + 1 }));
        } else {
            this.state.products = productsResponse.data || [];
        }
        
        // Handle Orders
        if (ordersResponse.error) {
             console.warn("Could not fetch orders.", ordersResponse.error);
            this.state.orders = [];
        } else {
             this.state.orders = (ordersResponse.data || []).map((o: any) => ({
                id: o.id,
                timestamp: new Date(o.timestamp).getTime(),
                customer: o.customer,
                items: o.items,
                total: o.total,
                status: o.status,
                orderedBy: o.orderedBy,
                attendedBy: o.attendedBy
             }));
        }

        // Handle Settings
        if (settingsResponse.error || !settingsResponse.data || !settingsResponse.data.settings_data) {
           console.warn("Could not fetch settings, using initial data.", settingsResponse.error);
           this.state.settings = initialSettings;
        } else {
           this.state.settings = settingsResponse.data.settings_data;
        }
        
        // Handle Users
        if (usersResponse.error) {
             console.warn("Could not fetch users, using initial data.", usersResponse.error);
             this.state.users = initialUsersData;
        } else {
            this.state.users = usersResponse.data || [];
        }


    } catch (error: any) {
        console.error("Critical error in fetchData, falling back to all initial data:", error);
        this.state = {
            products: initialProductsData.map((p, i) => ({ ...p, id: i + 1 })),
            orders: [],
            users: initialUsersData,
            settings: initialSettings,
        };
    } finally {
        this.broadcast();
    }
  }

  public setupRealtimeListeners() {
      if (typeof window === 'undefined' || this.realtimeChannel) return;

      const supabase = getClient();
      
      this.realtimeChannel = supabase
        .channel('public-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
            console.log('Realtime change received:', payload);
            this.fetchData();
        })
        .subscribe((status, err) => {
             if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                console.error('Realtime channel error:', err);
             }
        });
  }
  
  public teardownRealtimeListeners() {
      if (this.realtimeChannel) {
          this.realtimeChannel.unsubscribe();
          this.realtimeChannel = null;
      }
  }

  public subscribe(listener: (state: AppData) => void): () => void {
    this.listeners.add(listener);
    if (this.isInitialized) {
      listener(this.state);
    }
    return () => {
      this.listeners.delete(listener);
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
    if (typeof window !== 'undefined') {
        const initializeApp = async () => {
            await store.ensureInitialized();
            setIsInitialized(store.getIsInitialized());
            setState(store.getState());
        };
        initializeApp();
        
        const unsubscribe = store.subscribe((newState) => {
            setState(newState);
            setIsInitialized(store.getIsInitialized());
        });

        return unsubscribe;
    }
  }, []);

  return { state, isInitialized };
}

    