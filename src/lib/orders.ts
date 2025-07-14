'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from './products';

// Data types for orders
export type OrderItem = {
    id: number;
    nombre: string;
    precio: number;
    quantity: number;
}

export type CustomerInfo = {
    name: string;
    phone: string;
    email?: string;
}

export type Order = {
    id: number;
    timestamp: number;
    customer: CustomerInfo;
    items: OrderItem[];
    total: number;
    status: 'new' | 'viewed' | 'completed';
};

type NewOrderPayload = Omit<Order, 'id' | 'timestamp' | 'status'>;

// This is our in-memory "database"
let orders: Order[] = [];
let nextOrderId = 1;

// Listeners to notify components of changes
type Listener = (orders: Order[]) => void;
let listeners: Listener[] = [];

// A custom hook to manage and access orders state across components
export function useOrders() {
    // We use useState to make our component re-render when the orders data changes.
    const [ordersSnapshot, setOrdersSnapshot] = useState(orders);

    const broadcast = () => {
        for (const listener of listeners) {
            listener(orders);
        }
    };

    // The component subscribes to changes when it mounts.
    useEffect(() => {
        const newListener: Listener = (newOrders) => {
            setOrdersSnapshot([...newOrders]);
        };
        listeners.push(newListener);

        // It unsubscribes when it unmounts.
        return () => {
            listeners = listeners.filter(l => l !== newListener);
        };
    }, []);

    const addOrder = useCallback((payload: NewOrderPayload) => {
        const newOrder: Order = {
            ...payload,
            id: nextOrderId++,
            timestamp: Date.now(),
            status: 'new',
        };
        orders = [newOrder, ...orders]; // Add new order to the beginning
        broadcast(); // Notify all subscribed components
    }, []);

    return { orders: ordersSnapshot, addOrder };
}
