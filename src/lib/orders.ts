
'use client';

import {useAppStore, store} from './store';
import {useMemo} from 'react';

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

// --- Hook to get orders from the central store ---
export function useOrders() {
    const { state, isInitialized } = useAppStore();
    return { orders: state.orders, isInitialized };
}

// --- Data Manipulation Functions ---

export function getOrderById(orderId: number): Order | undefined {
    return store.getState().orders.find(order => order.id === orderId);
}

export function getOrdersByCustomerPhone(phone: string): Order[] {
    return store.getState().orders
        .filter(order => order.customer.phone === phone)
        .sort((a, b) => b.timestamp - a.timestamp);
}

export function getOrdersByWaiterName(waiterName: string): Order[] {
    return store.getState().orders
        .filter(order => order.orderedBy.type === 'Mesero' && order.orderedBy.name === waiterName)
        .sort((a, b) => b.timestamp - a.timestamp);
}

export function getOrdersByAttendedBy(userName: string): Order[] {
    return store.getState().orders
        .filter(order => order.attendedBy === userName)
        .sort((a, b) => b.timestamp - a.timestamp);
}

export async function addOrder(payload: NewOrderPayload): Promise<Order | null> {
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || 'Failed to create order');
        }

        const newOrder: Order = await response.json();
        
        // Manually add the new order to the local store to update UI immediately
        store.updateState(currentState => ({
            ...currentState,
            orders: [newOrder, ...currentState.orders]
        }));
        
        return newOrder;

    } catch (error) {
        console.error("Error in addOrder:", error);
        return null;
    }
}

export function updateOrderStatus(orderId: number, status: OrderStatus) {
    store.updateState(currentState => ({
        ...currentState,
        orders: currentState.orders.map(order =>
            order.id === orderId ? { ...order, status } : order
        )
    }));
}

export function addProductToOrder(orderId: number, product: Omit<OrderItem, 'addedAt'>, attendedBy?: string) {
    store.updateState(currentState => {
        const newOrders = currentState.orders.map(order => {
            if (order.id === orderId) {
                const existingItemIndex = order.items.findIndex(item => item.id === product.id);
                let newItems;
                const now = Date.now();

                if (existingItemIndex > -1) {
                    newItems = [...order.items];
                    newItems[existingItemIndex].quantity += product.quantity;
                } else {
                    newItems = [...order.items, { ...product, addedAt: now }];
                }
                
                const newTotal = newItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);
                const newStatus = (order.status === 'Completado' || order.status === 'Pagado') ? 'Pendiente' : order.status;

                return { ...order, items: newItems, total: newTotal, status: newStatus, timestamp: now, attendedBy };
            }
            return order;
        });
        return { ...currentState, orders: newOrders };
    });
}

export function updateProductQuantityInOrder(orderId: number, itemId: number, newQuantity: number) {
    store.updateState(currentState => {
        const newOrders = currentState.orders.map(order => {
            if (order.id === orderId) {
                const itemIndex = order.items.findIndex(item => item.id === itemId);
                if (itemIndex === -1) return order;

                const item = order.items[itemIndex];
                const isLocked = order.orderedBy.type === 'Cliente' && (Date.now() - item.addedAt) > 5 * 60 * 1000;
                
                if (isLocked) {
                    console.warn("Cannot edit quantity of a locked item for customers after 5 minutes.");
                    return order;
                }

                const newItems = [...order.items];
                newItems[itemIndex] = { ...item, quantity: newQuantity };
                
                const newTotal = newItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);
                return { ...order, items: newItems, total: newTotal };
            }
            return order;
        });
        return { ...currentState, orders: newOrders };
    });
}

export function removeProductFromOrder(orderId: number, itemId: number): boolean {
    let success = false;
    store.updateState(currentState => {
        const newOrders = currentState.orders.map(order => {
            if (order.id === orderId) {
                const itemIndex = order.items.findIndex(item => item.id === itemId);
                if (itemIndex === -1) return order;
                
                const item = order.items[itemIndex];
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
        return { ...currentState, orders: newOrders };
    });
    return success;
}

export function deleteOrder(orderId: number): void {
    store.updateState(currentState => ({
        ...currentState,
        orders: currentState.orders.filter(order => order.id !== orderId)
    }));
}
