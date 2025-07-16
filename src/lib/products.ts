
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

const initialProductsData: Product[] = [
    { id: 1, nombre: 'Cerveza Club Colombia', precio: 5000, imagen: 'https://placehold.co/600x400.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 100, categoria: 'Cervezas' },
    { id: 2, nombre: 'Cerveza Aguila Light', precio: 4500, imagen: 'https://placehold.co/600x400.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 80, categoria: 'Cervezas' },
    { id: 3, nombre: 'Margarita Clásica', precio: 15000, imagen: 'https://placehold.co/600x400.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 50, categoria: 'Cócteles' },
    { id: 4, nombre: 'Mojito Cubano', precio: 18000, imagen: 'https://placehold.co/600x400.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 40, categoria: 'Cócteles' },
    { id: 5, nombre: 'Gaseosa Coca-Cola', precio: 3000, imagen: 'https://placehold.co/600x400.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 200, categoria: 'Bebidas sin Alcohol' },
    { id: 6, nombre: 'Jugo de Mango', precio: 6000, imagen: 'https://placehold.co/600x400.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 60, categoria: 'Bebidas sin Alcohol' },
    { id: 7, nombre: 'Nachos con Queso', precio: 12000, imagen: 'https://placehold.co/600x400.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 30, categoria: 'Comidas' },
    { id: 8, nombre: 'Alitas BBQ', precio: 20000, imagen: 'https://placehold.co/600x400.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 25, categoria: 'Comidas' },
    { id: 9, nombre: 'Cerveza Corona', precio: 7000, imagen: 'https://placehold.co/600x400.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 70, categoria: 'Cervezas' },
    { id: 10, nombre: 'Piña Colada', precio: 16000, imagen: 'https://placehold.co/600x400.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 35, categoria: 'Cócteles' },
    { id: 11, nombre: 'Agua con Gas', precio: 2500, imagen: 'https://placehold.co/600x400.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 150, categoria: 'Bebidas sin Alcohol' },
    { id: 12, nombre: 'Papas a la Francesa', precio: 8000, imagen: 'https://placehold.co/600x400.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 50, categoria: 'Comidas' },
];

const PRODUCTS_STORAGE_KEY = 'holiday-friends-products';

// --- Centralized State Management for Products ---
class ProductStore {
    private static instance: ProductStore;
    private products: Product[];
    private nextProductId: number;
    private listeners: ((products: Product[]) => void)[] = [];

    private constructor() {
        this.products = this.loadFromStorage();
        this.nextProductId = this.products.reduce((maxId, product) => Math.max(product.id, maxId), 0) + 1;
        
        if (typeof window !== 'undefined') {
            window.addEventListener('storage', this.handleStorageChange);
        }
    }
    
    private handleStorageChange = (event: StorageEvent) => {
        if (event.key === PRODUCTS_STORAGE_KEY && event.newValue) {
            this.products = JSON.parse(event.newValue);
            this.broadcast();
        }
    }

    private loadFromStorage(): Product[] {
        if (typeof window === 'undefined') return initialProductsData;
        const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (storedProducts) {
            try {
                return JSON.parse(storedProducts);
            } catch (e) {
                console.error("Failed to parse products from localStorage", e);
                return initialProductsData;
            }
        }
        return initialProductsData;
    }

    private saveToStorage() {
        if (typeof window === 'undefined') return;
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(this.products));
    }

    public static getInstance(): ProductStore {
        if (!ProductStore.instance) {
            ProductStore.instance = new ProductStore();
        }
        return ProductStore.instance;
    }

    private broadcast() {
        this.listeners.forEach(listener => listener(this.products));
        this.saveToStorage();
    }

    public subscribe(listener: (products: Product[]) => void): () => void {
        this.listeners.push(listener);
        listener(this.products);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    
    public destroy() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('storage', this.handleStorageChange);
        }
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

export function useProducts() {
    const [products, setProducts] = useState(productStoreInstance.getProducts());

    useEffect(() => {
        const unsubscribe = productStoreInstance.subscribe(newProducts => {
            setProducts([...newProducts]);
        });
        
        return () => {
            unsubscribe();
        };
    }, []);

    return { products };
}
