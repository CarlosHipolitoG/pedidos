
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
        if (!supabase) throw new Error("Supabase client is not available.");
        
        const { data: products, error: productsError } = await supabase.from('productos').select('*');
        if (productsError) throw new Error(`Failed to fetch products: ${productsError.message}`);

        this.state.products = products || initialProductsData;
        
        // Also fetch existing orders
        const { data: ordersData, error: ordersError } = await supabase.from('pedidos').select('*').order('timestamp', { ascending: false });
        
        if (ordersError) {
            // It's ok if the orders table doesn't exist yet, don't throw.
            console.warn("[AppStore] Could not fetch orders, maybe the table doesn't exist yet?", ordersError.message);
            this.state.orders = [];
        } else {
             // Map Supabase data (Spanish columns) to application's Order type
             this.state.orders = (ordersData || []).map((o: any) => ({
                id: o.id,
                timestamp: new Date(o.timestamp).getTime(),
                customer: o.cliente,
                items: o.elementos,
                total: o.total_numerico,
                status: o.texto_de_estado,
                orderedBy: o.ordenadoPor,
                attendedBy: o.atendidoPor
             }));
        }

    } catch (error: any) {
        console.error("[AppStore] Fetching data failed, using fallback data:", error.message);
        // If fetching fails, we stick with the initial local data
        this.state.products = initialProductsData;
        this.state.orders = [];
    } finally {
        this.broadcast();
    }
  }

  private setupRealtimeListeners() {
      // Don't run on server or if channel already exists
      if (typeof window === 'undefined' || this.realtimeChannel) return;

      const supabase = getClient();
      if (!supabase) return; // Do not proceed if client is not available
      
      this.realtimeChannel = supabase
        .channel('public:pedidos')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, (payload) => {
            console.log('Realtime change received!', payload);
            this.fetchData(); // Refetch all data to ensure consistency
        })
        .subscribe((status, err) => {
             if (status === 'SUBSCRIBED') {
                console.log('Successfully subscribed to realtime pedidos channel.');
            }
             if (status === 'CHANNEL_ERROR') {
                console.error('Realtime channel error. Retrying connection...', err);
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


  // Subscribe to state changes
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
