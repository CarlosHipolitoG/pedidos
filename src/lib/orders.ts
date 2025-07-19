
'use client';

import {useAppStore, store} from './store';
import { getClient } from './supabaseClient';

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
        const supabase = getClient();
        if (!supabase) throw new Error("Supabase client not initialized");
        const now = Date.now();
        const itemsWithTimestamp: OrderItem[] = payload.items.map(item => ({
            ...item,
            addedAt: now
        }));
        
        // Map application payload to Supabase table schema (Spanish columns)
        const newOrderDataForSupabase = {
            timestamp: new Date(now).toISOString(),
            cliente: payload.customer,
            elementos: itemsWithTimestamp,
            total_numerico: payload.total,
            texto_de_estado: 'Pendiente',
            ordenadoPor: payload.orderedBy,
            atendidoPor: payload.orderedBy.type === 'Mesero' ? payload.orderedBy.name : undefined,
        };

        const { data, error } = await supabase
            .from('pedidos')
            .insert(newOrderDataForSupabase)
            .select()
            .single();

        if (error) {
            console.error('Error inserting order:', error);
            throw error;
        }

        // The state will be updated by the realtime listener, but we can return the created order
        // We must map it back from the Spanish columns to the application's Order type
        return {
            id: data.id,
            timestamp: new Date(data.timestamp).getTime(),
            customer: data.cliente,
            items: data.elementos,
            total: data.total_numerico,
            status: data.texto_de_estado,
            orderedBy: data.ordenadoPor,
            attendedBy: data.atendidoPor
        };

    } catch (error) {
        console.error("Error in addOrder:", error);
        return null;
    }
}

async function updateOrderInSupabase(orderId: number, updateData: { [key: string]: any }) {
    try {
        const supabase = getClient();
        if (!supabase) throw new Error("Supabase client not initialized");
        const { error } = await supabase
            .from('pedidos')
            .update(updateData)
            .eq('id', orderId);
        if (error) throw error;
    } catch(error) {
        console.error("Error updating order in Supabase:", error);
    }
}

export function updateOrderStatus(orderId: number, status: OrderStatus) {
    store.updateState(currentState => {
        const orders = currentState.orders.map(order =>
            order.id === orderId ? { ...order, status } : order
        );
        return { ...currentState, orders };
    });
    // Map to Supabase column name
    updateOrderInSupabase(orderId, { texto_de_estado: status });
}

export function addProductToOrder(orderId: number, product: Omit<OrderItem, 'addedAt'>, attendedBy?: string) {
    let updatedOrder: Order | undefined;
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

                updatedOrder = { ...order, items: newItems, total: newTotal, status: newStatus, timestamp: now, attendedBy };
                return updatedOrder;
            }
            return order;
        });
        return { ...currentState, orders: newOrders };
    });

    if (updatedOrder) {
        updateOrderInSupabase(orderId, {
            elementos: updatedOrder.items,
            total_numerico: updatedOrder.total,
            texto_de_estado: updatedOrder.status,
            timestamp: new Date(updatedOrder.timestamp).toISOString(),
            atendidoPor: updatedOrder.attendedBy
        });
    }
}

export function updateProductQuantityInOrder(orderId: number, itemId: number, newQuantity: number) {
    let updatedOrder: Order | undefined;
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
                updatedOrder = { ...order, items: newItems, total: newTotal };
                return updatedOrder;
            }
            return order;
        });
        return { ...currentState, orders: newOrders };
    });

     if (updatedOrder) {
        updateOrderInSupabase(orderId, {
            elementos: updatedOrder.items,
            total_numerico: updatedOrder.total,
        });
    }
}

export function removeProductFromOrder(orderId: number, itemId: number): boolean {
    let success = false;
    let updatedOrder: Order | undefined;
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
                updatedOrder = { ...order, items: newItems, total: newTotal };
                return updatedOrder;
            }
            return order;
        });
        return { ...currentState, orders: newOrders };
    });
    
    if (updatedOrder) {
        updateOrderInSupabase(orderId, {
            elementos: updatedOrder.items,
            total_numerico: updatedOrder.total,
        });
    }
    return success;
}

export async function deleteOrder(orderId: number): Promise<void> {
    store.updateState(currentState => ({
        ...currentState,
        orders: currentState.orders.filter(order => order.id !== orderId)
    }));
     try {
        const supabase = getClient();
        if (!supabase) throw new Error("Supabase client not initialized");
        const { error } = await supabase.from('pedidos').delete().eq('id', orderId)
        if (error) console.error("Error deleting order from Supabase:", error);
    } catch (error) {
        console.error("Error deleting order:", error);
    }
}
