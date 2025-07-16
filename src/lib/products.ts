
'use client';

import { useState, useEffect } from 'react';

export type Product = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  disponibilidad: 'PRODUCTO_DISPONIBLE' | 'PRODUCTO_AGOTADO';
  existencias: number;
  categoria: string;
};

const initialProducts: Product[] = [];

// --- Centralized State Management for Products ---
// This is a singleton class that will hold the state of the products.
// It ensures that all parts of the app are using the same data source.
class ProductStore {
    private static instance: ProductStore;
    private products: Product[];
    private nextProductId: number;
    private listeners: ((products: Product[]) => void)[] = [];

    private constructor() {
        // Start with the initial list of products
        this.products = initialProducts.map(p => ({...p}));
        // Determine the next ID based on the initial products
        this.nextProductId = this.products.reduce((maxId, product) => Math.max(product.id, maxId), 0) + 1;
    }

    public static getInstance(): ProductStore {
        if (!ProductStore.instance) {
            ProductStore.instance = new ProductStore();
        }
        return ProductStore.instance;
    }

    private broadcast() {
        // Notify all subscribed components about the change
        this.listeners.forEach(listener => listener(this.products));
    }

    public subscribe(listener: (products: Product[]) => void): () => void {
        this.listeners.push(listener);
        // Immediately provide the current list to the new subscriber
        listener(this.products);
        // Return an unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public getProducts(): Product[] {
        return this.products;
    }

    public addProduct(productData: Omit<Product, 'id'>): void {
        const newProduct: Product = {
            ...productData,
            id: this.nextProductId++,
        };
        this.products = [...this.products, newProduct];
        this.broadcast();
    }

    public updateProduct(productId: number, updatedData: Partial<Omit<Product, 'id'>>): void {
        this.products = this.products.map(product =>
            product.id === productId ? { ...product, ...updatedData } : product
        );
        this.broadcast();
    }
    
    public deleteProduct(productId: number): void {
        this.products = this.products.filter(product => product.id !== productId);
        this.broadcast();
    }
}

// Create and export a single instance of the store
const productStoreInstance = ProductStore.getInstance();

export const addProduct = (productData: Omit<Product, 'id'>): void => {
    productStoreInstance.addProduct(productData);
};

export const updateProduct = (productId: number, updatedData: Partial<Omit<Product, 'id'>>): void => {
    productStoreInstance.updateProduct(productId, updatedData);
};

export const deleteProduct = (productId: number): void => {
    productStoreInstance.deleteProduct(productId);
};

// This is the custom hook that components will use to access and react to product changes.
export function useProducts() {
    const [products, setProducts] = useState(productStoreInstance.getProducts());

    useEffect(() => {
        // Subscribe to the store on component mount
        const unsubscribe = productStoreInstance.subscribe(newProducts => {
            // When the store broadcasts a change, update the component's state
            setProducts([...newProducts]);
        });

        // Unsubscribe on component unmount
        return () => unsubscribe();
    }, []);

    return { products };
}
