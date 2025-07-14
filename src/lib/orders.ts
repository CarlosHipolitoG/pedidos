'use client';

import { useState, useEffect } from 'react';

// Data types for orders
export type OrderItem = {
    id: number;
    nombre: string;
    precio: number;
    quantity: number;
};

export type CustomerInfo = {
    name: string;
    phone: string;
    email?: string;
};

export type OrderStatus = 'Pendiente' | 'En Preparación' | 'Completado';
export type OrderedBy = { type: 'Cliente' | 'Mesero', name: string };

export type Order = {
    id: number;
    timestamp: number;
    customer: CustomerInfo;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    orderedBy: OrderedBy;
};

export type NewOrderPayload = Omit<Order, 'id' | 'timestamp' | 'status'>;

const initialSimulatedOrder: Order = {
    id: 999,
    timestamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago
    customer: {
        name: "Cliente de Prueba",
        phone: "3000000000",
        email: "prueba@example.com"
    },
    items: [
        { id: 1, nombre: 'AGUA', precio: 4500, quantity: 2 },
        { id: 3, nombre: 'AGUARDIENTE ANTIOQUEÑO AZUL 375', precio: 60000, quantity: 1 }
    ],
    total: 69000,
    status: 'Pendiente',
    orderedBy: { type: 'Cliente', name: 'Cliente de Prueba' }
};

// --- Centralized State Management ---
// We use a singleton pattern to ensure state is shared across client components.
class OrderStore {
    private static instance: OrderStore;
    private orders: Order[] = [initialSimulatedOrder];
    private nextOrderId = 1;
    private listeners: ((orders: Order[]) => void)[] = [];

    private constructor() {}

    public static getInstance(): OrderStore {
        if (!OrderStore.instance) {
            OrderStore.instance = new OrderStore();
        }
        return OrderStore.instance;
    }

    private broadcast() {
        this.listeners.forEach(listener => listener(this.orders));
    }

    public subscribe(listener: (orders: Order[]) => void): () => void {
        this.listeners.push(listener);
        // Provide the initial state immediately
        listener(this.orders);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public getOrders(): Order[] {
        return this.orders;
    }

    public addOrder(payload: NewOrderPayload) {
        const newOrder: Order = {
            ...payload,
            id: this.nextOrderId++,
            timestamp: Date.now(),
            status: 'Pendiente',
        };
        this.orders = [newOrder, ...this.orders];
        this.broadcast();
    }

    public updateOrderStatus(orderId: number, status: OrderStatus) {
        this.orders = this.orders.map(order => 
            order.id === orderId ? { ...order, status } : order
        );
        this.broadcast();
    }
    
    public addProductToOrder(orderId: number, product: OrderItem) {
        this.orders = this.orders.map(order => {
            if (order.id === orderId) {
                // Check if product already exists to update quantity, otherwise add it
                const existingItemIndex = order.items.findIndex(item => item.id === product.id);
                let newItems;
                if (existingItemIndex > -1) {
                    newItems = [...order.items];
                    newItems[existingItemIndex].quantity += product.quantity;
                } else {
                    newItems = [...order.items, product];
                }
                
                const newTotal = newItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);
                return { ...order, items: newItems, total: newTotal };
            }
            return order;
        });
        this.broadcast();
    }
}

const orderStoreInstance = OrderStore.getInstance();

// Exported functions to interact with the store
export const addOrder = (payload: NewOrderPayload) => {
    orderStoreInstance.addOrder(payload);
};

export const updateOrderStatus = (orderId: number, status: OrderStatus) => {
    orderStoreInstance.updateOrderStatus(orderId, status);
};

export const addProductToOrder = (orderId: number, product: OrderItem) => {
    orderStoreInstance.addProductToOrder(orderId, product);
};

// --- Custom Hook to Access Orders ---
export function useOrders() {
    const [orders, setOrders] = useState(orderStoreInstance.getOrders());

    useEffect(() => {
        const unsubscribe = orderStoreInstance.subscribe(newOrders => {
            setOrders([...newOrders]);
        });
        
        return () => unsubscribe();
    }, []);

    return { orders };
}
