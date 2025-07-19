
'use client';

import {useAppStore, store} from './store';

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

// --- Data Manipulation Functions ---

export const addProduct = (productData: Omit<Product, 'id'>): void => {
    store.updateState(currentState => {
        const currentProducts = currentState.products || [];
        const nextProductId = (currentProducts.reduce((maxId, p) => Math.max(p.id, maxId), 0) || 0) + 1;
        const newProduct: Product = {
            ...productData,
            id: nextProductId,
        };
        const products = [...currentProducts, newProduct].sort((a,b) => a.id - b.id);
        return { ...currentState, products };
    });
};

export const updateProduct = (productId: number, updatedData: Partial<Omit<Product, 'id'>>): void => {
    store.updateState(currentState => {
        const products = currentState.products.map(p =>
            p.id === productId ? { ...p, ...updatedData } : p
        ).sort((a,b) => a.id - b.id);
        return { ...currentState, products };
    });
};

export const deleteProduct = (productId: number): void => {
    store.updateState(currentState => {
        const products = currentState.products.filter(p => p.id !== productId);
        return { ...currentState, products };
    });
};

    
