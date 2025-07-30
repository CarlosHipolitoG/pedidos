
'use client';

import {useAppStore, store} from './store';
import { getClient } from './supabaseClient';


export type Product = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  disponibilidad: 'PRODUCTO_DISPONIBLE' | 'PRODUCTO_AGOTADO';
  existencias: number;
  categoria: string;
};

// --- Hook to get products from the central store ---
export function useProducts() {
    const { state, isInitialized } = useAppStore();
    return { products: state.products, isInitialized };
}

async function syncProductInSupabase(productData: Omit<Product, 'id'>, productId?: number) {
    try {
        const supabase = getClient();
        if (productId) { // Update
            const { error } = await supabase.from('products').update(productData).eq('id', productId);
            if (error) throw error;
        } else { // Insert
            const { error } = await supabase.from('products').insert(productData).select().single();
            if (error) throw error;
        }
    } catch (error) {
        console.error("Error syncing product in Supabase:", error);
    }
}

async function deleteProductFromSupabase(productId: number) {
     try {
        const supabase = getClient();
        const { error } = await supabase.from('products').delete().eq('id', productId);
        if (error) throw error;
    } catch (error) {
        console.error("Error deleting product from Supabase:", error);
    }
}


// --- Data Manipulation Functions ---

export const addProduct = (productData: Omit<Product, 'id'>): void => {
    store.updateState(currentState => {
        const currentProducts = currentState.products || [];
        const nextProductId = (currentProducts.reduce((maxId, p) => Math.max(p.id, maxId), 0) || 0) + 1;
        const newProduct = {
            ...productData,
            id: nextProductId,
        };
        const newProducts = [...currentProducts, newProduct].sort((a,b) => a.id - b.id);
        return { ...currentState, products: newProducts };
    });
    syncProductInSupabase(productData);
};

export const updateProduct = (productId: number, updatedData: Partial<Omit<Product, 'id'>>): void => {
    store.updateState(currentState => {
        const newProducts = currentState.products.map(p => {
            if (p.id === productId) {
                return { ...p, ...updatedData };
            }
            return p;
        }).sort((a,b) => a.id - b.id);
        return { ...currentState, products: newProducts };
    });
    syncProductInSupabase(updatedData, productId);
};

export const deleteProduct = (productId: number): void => {
    store.updateState(currentState => {
        const newProducts = currentState.products.filter(p => p.id !== productId);
        return { ...currentState, products: newProducts };
    });
     deleteProductFromSupabase(productId);
};

    