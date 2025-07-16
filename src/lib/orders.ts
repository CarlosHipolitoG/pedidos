
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
    attendedBy?: string; // Name of the waiter or admin who last added a product
};

export type NewOrderPayload = Omit<Order, 'id' | 'timestamp' | 'status' | 'items' | 'attendedBy'> & {
    items: Omit<OrderItem, 'addedAt'>[];
};

const initialSimulatedOrders: Order[] = [];

// --- Centralized State Management ---
class OrderStore {
    private static instance: OrderStore;
    private orders: Order[];
    private nextOrderId: number;
    private listeners: ((orders: Order[]) => void)[] = [];

    private constructor() {
        this.orders = [...initialSimulatedOrders];
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

    public getOrdersByCustomerPhone(phone: string): Order[] {
        return this.orders
            .filter(order => order.customer.phone === phone)
            .sort((a, b) => b.timestamp - a.timestamp);
    }

    public getOrdersByWaiterName(waiterName: string): Order[] {
        return this.orders
            .filter(order => order.orderedBy.type === 'Mesero' && order.orderedBy.name === waiterName)
            .sort((a, b) => b.timestamp - a.timestamp);
    }
    
    public getOrdersByAttendedBy(userName: string): Order[] {
        return this.orders
            .filter(order => order.attendedBy === userName)
            .sort((a, b) => b.timestamp - a.timestamp);
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
            attendedBy: payload.orderedBy.type === 'Mesero' ? payload.orderedBy.name : undefined,
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
    
    public addProductToOrder(orderId: number, product: Omit<OrderItem, 'addedAt'>, attendedBy?: string) {
        this.orders = this.orders.map(order => {
            if (order.id === orderId) {
                const existingItemIndex = order.items.findIndex(item => item.id === product.id);
                let newItems;
                const now = Date.now();

                if (existingItemIndex > -1) {
                    newItems = [...order.items];
                    newItems[existingItemIndex].quantity += product.quantity;
                    // We don't update addedAt here, so the original 5-minute timer is respected
                } else {
                    newItems = [...order.items, { ...product, addedAt: now }];
                }
                
                const newTotal = newItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);
                const newStatus = (order.status === 'Completado' || order.status === 'Pagado') ? 'Pendiente' : order.status;

                return { ...order, items: newItems, total: newTotal, status: newStatus, timestamp: now, attendedBy };
            }
            return order;
        });
        this.broadcast();
    }
    
    public updateProductQuantityInOrder(orderId: number, itemId: number, newQuantity: number) {
        this.orders = this.orders.map(order => {
            if (order.id === orderId) {
                const itemIndex = order.items.findIndex(item => item.id === itemId);
                if (itemIndex === -1) return order;

                const item = order.items[itemIndex];
                // Only apply 5-minute lock for customers
                const isLocked = order.orderedBy.type === 'Cliente' && (Date.now() - item.addedAt) > 5 * 60 * 1000;
                
                if (isLocked) {
                    console.warn("Cannot edit quantity of a locked item for customers after 5 minutes.");
                    return order; // Do not update if item is locked
                }

                const newItems = [...order.items];
                newItems[itemIndex] = { ...item, quantity: newQuantity };
                
                const newTotal = newItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);
                return { ...order, items: newItems, total: newTotal };
            }
            return order;
        });
        this.broadcast();
    }

    public removeProductFromOrder(orderId: number, itemId: number): boolean {
        let success = false;
        this.orders = this.orders.map(order => {
            if (order.id === orderId) {
                const itemIndex = order.items.findIndex(item => item.id === itemId);
                if (itemIndex === -1) return order;
                
                const item = order.items[itemIndex];
                // Only apply 5-minute lock for customers
                const isLocked = order.orderedBy.type === 'Cliente' && (Date.now() - item.addedAt) > 5 * 60 * 1000;
                
                if (isLocked) {
                    console.warn("Cannot remove a locked item for customers after 5 minutes.");
                    success = false;
                    return order;
                }

                const newItems = order.items.filter(item => item.id !== itemId);
                const newTotal = newItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);
                success = true;
                return { ...order, items: newItems, total: newTotal };
            }
            return order;
        });
        this.broadcast();
        return success;
    }
}

const orderStoreInstance = OrderStore.getInstance();

export const addOrder = (payload: NewOrderPayload): number => {
    return orderStoreInstance.addOrder(payload);
};

export const updateOrderStatus = (orderId: number, status: OrderStatus) => {
    orderStoreInstance.updateOrderStatus(orderId, status);
};

export const addProductToOrder = (orderId: number, product: Omit<OrderItem, 'addedAt'>, attendedBy?: string) => {
    orderStoreInstance.addProductToOrder(orderId, product, attendedBy);
};

export const getOrderById = (orderId: number): Order | undefined => {
    return orderStoreInstance.getOrderById(orderId);
};

export const getOrdersByCustomerPhone = (phone: string): Order[] => {
    return orderStoreInstance.getOrdersByCustomerPhone(phone);
}

export const getOrdersByWaiterName = (waiterName: string): Order[] => {
    return orderStoreInstance.getOrdersByWaiterName(waiterName);
}

export const getOrdersByAttendedBy = (userName: string): Order[] => {
    return orderStoreInstance.getOrdersByAttendedBy(userName);
}

export const updateProductQuantityInOrder = (orderId: number, itemId: number, newQuantity: number) => {
    orderStoreInstance.updateProductQuantityInOrder(orderId, itemId, newQuantity);
};

export const removeProductFromOrder = (orderId: number, itemId: number): boolean => {
    return orderStoreInstance.removeProductFromOrder(orderId, itemId);
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
