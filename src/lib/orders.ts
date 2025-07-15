
'use client';

import { useState, useEffect } from 'react';

// Data types for orders
export type OrderItem = {
    id: number;
    nombre: string;
    precio: number;
    quantity: number;
    addedAt: number; // Timestamp for when the item was added
};

export type CustomerInfo = {
    name: string;
    phone: string;
    email?: string;
};

export type OrderStatus = 'Pendiente' | 'En Preparación' | 'Completado' | 'Pagado';
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

export type NewOrderPayload = Omit<Order, 'id' | 'timestamp' | 'status' | 'items'> & {
    items: Omit<OrderItem, 'addedAt'>[];
};

const initialSimulatedOrders: Order[] = [
    {
        id: 999,
        timestamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago
        customer: { name: "Cliente de Prueba", phone: "3000000000", email: "prueba@example.com" },
        items: [
            { id: 1, nombre: 'AGUA', precio: 4500, quantity: 2, addedAt: Date.now() - 5 * 60 * 1000 },
            { id: 3, nombre: 'AGUARDIENTE ANTIOQUEÑO AZUL 375', precio: 60000, quantity: 1, addedAt: Date.now() - 5 * 60 * 1000 }
        ],
        total: 69000,
        status: 'Pendiente',
        orderedBy: { type: 'Cliente', name: 'Cliente de Prueba' }
    },
    {
        id: 998,
        timestamp: Date.now() - 15 * 60 * 1000, // 15 minutes ago
        customer: { name: "Maria Rodriguez", phone: "3101234567" },
        items: [
            { id: 4, nombre: 'AGUARDIENTE ANTIOQUEÑO AZUL 750', precio: 120000, quantity: 1, addedAt: Date.now() - 15 * 60 * 1000 }
        ],
        total: 120000,
        status: 'En Preparación',
        orderedBy: { type: 'Mesero', name: 'Ana López' }
    },
    {
        id: 997,
        timestamp: Date.now() - 30 * 60 * 1000, // 30 minutes ago
        customer: { name: "Carlos Gomez", phone: "3209876543" },
        items: [
            { id: 12, nombre: 'AGUARDIENTE NÉCTAR DORADO 750 M', precio: 100000, quantity: 1, addedAt: Date.now() - 30 * 60 * 1000 },
            { id: 2, nombre: 'AGUA GAS', precio: 4500, quantity: 4, addedAt: Date.now() - 30 * 60 * 1000 }
        ],
        total: 118000,
        status: 'Completado',
        orderedBy: { type: 'Cliente', name: 'Carlos Gomez' }
    }
];

// --- Centralized State Management ---
class OrderStore {
    private static instance: OrderStore;
    private orders: Order[] = [...initialSimulatedOrders];
    private nextOrderId = 1;
    private listeners: ((orders: Order[]) => void)[] = [];

    private constructor() {
        this.nextOrderId = this.orders.reduce((maxId, order) => Math.max(order.id, maxId), 0) + 1;
    }

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
        listener(this.orders);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public getOrders(): Order[] {
        return this.orders;
    }
    
    public getOrderById(orderId: number): Order | undefined {
        return this.orders.find(order => order.id === orderId);
    }

    public addOrder(payload: NewOrderPayload): number {
        const now = Date.now();
        const itemsWithTimestamp: OrderItem[] = payload.items.map(item => ({
            ...item,
            addedAt: now
        }));

        const newOrder: Order = {
            ...payload,
            items: itemsWithTimestamp,
            id: this.nextOrderId++,
            timestamp: now,
            status: 'Pendiente',
        };
        this.orders = [newOrder, ...this.orders];
        this.broadcast();
        return newOrder.id;
    }

    public updateOrderStatus(orderId: number, status: OrderStatus) {
        this.orders = this.orders.map(order => 
            order.id === orderId ? { ...order, status } : order
        );
        this.broadcast();
    }
    
    public addProductToOrder(orderId: number, product: Omit<OrderItem, 'addedAt'>) {
        this.orders = this.orders.map(order => {
            if (order.id === orderId) {
                const existingItemIndex = order.items.findIndex(item => item.id === product.id);
                let newItems;
                const now = Date.now();

                if (existingItemIndex > -1) {
                    newItems = [...order.items];
                    newItems[existingItemIndex].quantity += product.quantity;
                    newItems[existingItemIndex].addedAt = now; // Update timestamp on modification
                } else {
                    newItems = [...order.items, { ...product, addedAt: now }];
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

export const addOrder = (payload: NewOrderPayload): number => {
    return orderStoreInstance.addOrder(payload);
};

export const updateOrderStatus = (orderId: number, status: OrderStatus) => {
    orderStoreInstance.updateOrderStatus(orderId, status);
};

export const addProductToOrder = (orderId: number, product: Omit<OrderItem, 'addedAt'>) => {
    orderStoreInstance.addProductToOrder(orderId, product);
};

export const getOrderById = (orderId: number): Order | undefined => {
    return orderStoreInstance.getOrderById(orderId);
};

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
