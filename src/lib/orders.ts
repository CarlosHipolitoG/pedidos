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

// --- Centralized State Management ---
// We use a singleton pattern to ensure state is shared across client components.
class OrderStore {
    private static instance: OrderStore;
    private orders: Order[] = [];
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
                const newItems = [...order.items, product];
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
        
        // Ensure we have the latest state on mount
        setOrders([...orderStoreInstance.getOrders()]);

        return () => unsubscribe();
    }, []);

    return { orders };
}
