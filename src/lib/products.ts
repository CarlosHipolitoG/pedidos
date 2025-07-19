
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

async function updateProductsInSupabase(products: Product[]) {
    try {
        const supabase = getClient();
        // This is a simple but potentially inefficient way to sync.
        // It deletes all products and re-inserts them.
        // For a real-world app, you'd want more granular updates.
        
        const { error: deleteError } = await supabase.from('products').delete().neq('id', -1); // delete all
        if (deleteError) throw deleteError;

        // We don't want to send the `id` on insert, as it's auto-generated.
        const productsToInsert = products.map(({ id, ...rest }) => rest);

        if (productsToInsert.length > 0) {
            const { error: insertError } = await supabase.from('products').insert(productsToInsert);
            if (insertError) throw insertError;
        }

    } catch(error) {
        console.error("Error updating products in Supabase:", error);
    }
}


// --- Data Manipulation Functions ---

export const addProduct = (productData: Omit<Product, 'id'>): void => {
    let newProducts: Product[] = [];
    store.updateState(currentState => {
        const currentProducts = currentState.products || [];
        const nextProductId = (currentProducts.reduce((maxId, p) => Math.max(p.id, maxId), 0) || 0) + 1;
        const newProduct: Product = {
            ...productData,
            id: nextProductId,
        };
        newProducts = [...currentProducts, newProduct].sort((a,b) => a.id - b.id);
        return { ...currentState, products: newProducts };
    });
    updateProductsInSupabase(newProducts);
};

export const updateProduct = (productId: number, updatedData: Partial<Omit<Product, 'id'>>): void => {
    let newProducts: Product[] = [];
    store.updateState(currentState => {
        newProducts = currentState.products.map(p =>
            p.id === productId ? { ...p, ...updatedData } : p
        ).sort((a,b) => a.id - b.id);
        return { ...currentState, products: newProducts };
    });
    updateProductsInSupabase(newProducts);
};

export const deleteProduct = (productId: number): void => {
    let newProducts: Product[] = [];
    store.updateState(currentState => {
        newProducts = currentState.products.filter(p => p.id !== productId);
        return { ...currentState, products: newProducts };
    });
     updateProductsInSupabase(newProducts);
};

    
