'use client';

import { useState, useEffect, useCallback } from 'react';

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

// --- Centralized State Management ---

// This is our in-memory "database"
let ordersStore: Order[] = [];
let nextOrderId = 1;

// Listeners to notify components of changes
type Listener = (orders: Order[]) => void;
let listeners: Listener[] = [];

// Function to notify all subscribed components
const broadcast = () => {
    for (const listener of listeners) {
        listener(ordersStore);
    }
};

// Function to add an order to the store and notify listeners
export const addOrder = (payload: NewOrderPayload) => {
    const newOrder: Order = {
        ...payload,
        id: nextOrderId++,
        timestamp: Date.now(),
        status: 'new',
    };
    // Add new order to the beginning of the array
    ordersStore = [newOrder, ...ordersStore]; 
    broadcast(); // Notify all subscribed components
};


// --- Custom Hook to Access Orders ---

// A custom hook to manage and access orders state across components
export function useOrders() {
    // We use useState to make our component re-render when the orders data changes.
    const [orders, setOrders] = useState(ordersStore);

    useEffect(() => {
        // When the component mounts, it subscribes to changes.
        const newListener: Listener = (newOrders) => {
            setOrders([...newOrders]);
        };
        listeners.push(newListener);
        
        // When the component first mounts, ensure it has the latest data.
        setOrders([...ordersStore]);

        // When the component unmounts, it unsubscribes.
        return () => {
            listeners = listeners.filter(l => l !== newListener);
        };
    }, []);

    return { orders, addOrder };
}
