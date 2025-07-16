
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

const initialProducts: Product[] = [
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
