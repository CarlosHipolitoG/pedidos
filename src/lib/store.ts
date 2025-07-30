
'use client';

import {useState, useEffect} from 'react';
import type {Order} from './orders';
import type {Product} from './products';
import type {User} from './users';
import { initialUsersData, initialProductsData } from './initial-data';
import { getClient } from './supabaseClient';

// Definir tipos para los nuevos almacenes de datos
type ImageSettings = {
    logoUrl: string | null;
    backgroundUrl: string | null;
};
type PromotionalImage = {
    id: number;
    src: string | null;
    alt: string | null;
    hint: string | null;
};
type GeneralSettings = {
    barName: string;
}

// Define la forma de nuestro entero estado de aplicación
export type AppData = {
  orders: Order[];
  products: Product[];
  users: User[];
  settings: GeneralSettings; // Configuración general (ej. nombre del bar)
  image_settings: ImageSettings; // Configuración de imágenes principales
  promotional_images: PromotionalImage[]; // Lista de imágenes promocionales
};

// Esta clase manejará el estado de la aplicación.
class AppStore {
  private static instance: AppStore;
  private state: AppData = {
    orders: [],
    products: [],
    users: [],
    settings: { barName: 'HOLIDAYS FRIENDS'},
    image_settings: { logoUrl: '', backgroundUrl: '' },
    promotional_images: [],
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

  // Obtener datos iniciales del servidor
  private async initialize() {
    if (typeof window === 'undefined') {
        return;
    }

    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        await this.fetchData(); // Realizar la obtención inicial
      } catch (error) {
        console.error("Initialization failed, will retry on next interaction:", error);
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
        
        const [productsResponse, ordersResponse, settingsResponse, usersResponse, imageSettingsResponse, promoImagesResponse] = await Promise.all([
            supabase.from('products').select('*').order('id', { ascending: true }),
            supabase.from('orders').select('*').order('timestamp', { ascending: false }),
            supabase.from('settings').select('settings_data').eq('id', 1).single(),
            supabase.from('users').select('*').order('id', { ascending: true }),
            supabase.from('image_settings').select('logo_url, background_url').eq('id', 1).single(),
            supabase.from('promotional_images').select('*').order('id', { ascending: true })
        ]);
        
        this.state.products = productsResponse.data || initialProductsData.map((p, i) => ({ ...p, id: i + 1 }));
        this.state.users = usersResponse.data || initialUsersData;
        this.state.orders = (ordersResponse.data || []).map((o: any) => ({ ...o, timestamp: new Date(o.timestamp).getTime() }));

        if (settingsResponse.data) {
             this.state.settings = { barName: settingsResponse.data.settings_data.barName || 'HOLIDAYS FRIENDS' };
        }
        if (imageSettingsResponse.data) {
            this.state.image_settings = { logoUrl: imageSettingsResponse.data.logo_url, backgroundUrl: imageSettingsResponse.data.background_url };
        }
        if (promoImagesResponse.data) {
            this.state.promotional_images = promoImagesResponse.data;
        }

    } catch (error: any) {
        console.error("Critical error in fetchData:", error);
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
          console.log("Realtime listeners torn down.");
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
