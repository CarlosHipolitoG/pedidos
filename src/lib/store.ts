
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
        
        // Only setup realtime for staff (admin/waiter)
        const userName = localStorage.getItem('userName');
        const user = this.state.users.find(u => u.name === userName);

        if (user && (user.role === 'admin' || user.role === 'waiter')) {
          this.setupRealtimeListeners();
        } else {
          this.teardownRealtimeListeners();
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
        
        // Parallel fetching for better performance
        const [productsResponse, ordersResponse, settingsResponse, usersResponse] = await Promise.all([
            supabase.from('products').select('*'),
            supabase.from('orders').select('*').order('timestamp', { ascending: false }),
            supabase.from('settings').select('settings_data').eq('id', 1).maybeSingle(),
            supabase.from('users').select('*'),
        ]);
        
        // Handle Products
        if (productsResponse.error) throw new Error(`Failed to fetch products: ${productsResponse.error.message}`);
        this.state.products = productsResponse.data?.length ? productsResponse.data : initialProductsData;
        
        // Handle Orders
        if (ordersResponse.error) {
            console.warn("[AppStore] Could not fetch orders:", ordersResponse.error.message);
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
        if (settingsResponse.error) {
           console.error("Error fetching settings:", settingsResponse.error.message);
           this.state.settings = initialSettings;
        } else {
          if (settingsResponse.data && settingsResponse.data.settings_data) {
             this.state.settings = settingsResponse.data.settings_data;
          } else {
            // No settings found, just use the initial ones locally.
            // Admin can save them for the first time from the settings page.
            this.state.settings = initialSettings;
          }
        }
        
        // Handle Users
        if (usersResponse.error) {
             console.error("Error fetching users:", usersResponse.error.message);
             this.state.users = initialUsersData;
        } else {
            this.state.users = usersResponse.data?.length ? usersResponse.data : initialUsersData;
        }


    } catch (error: any) {
        console.error("[AppStore] Fetching data failed, using fallback data:", error.message);
        this.state = {
            products: initialProductsData,
            orders: [],
            users: initialUsersData,
            settings: initialSettings,
        };
    } finally {
        this.broadcast();
    }
  }

  private setupRealtimeListeners() {
      if (typeof window === 'undefined' || this.realtimeChannel) return;

      const supabase = getClient();
      
      const tables = ['orders', 'products', 'settings', 'users'];
      
      this.realtimeChannel = supabase
        .channel('public-dynamic-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
            if (tables.includes(payload.table)) {
                console.log(`Realtime change in ${payload.table} detected!`, payload);
                this.fetchData();
            }
        })
        .subscribe((status, err) => {
             if (status === 'SUBSCRIBED') {
                console.log('Successfully subscribed to realtime channel.');
            }
             if (status === 'CHANNEL_ERROR') {
                console.error('Realtime channel error.', err);
            }
        });
  }
  
  private teardownRealtimeListeners() {
      if (this.realtimeChannel) {
          console.log('Tearing down realtime channel.');
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
