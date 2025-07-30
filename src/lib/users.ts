
'use client';

import {useAppStore, store} from './store';
import { getClient } from './supabaseClient';

// Simplified user types
export type UserRole = 'admin' | 'waiter' | 'client';
export type CommentCategory = "queja" | "solicitud" | "felicitacion" | "objeto_perdido";

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password?: string; // Storing a "hash" for simulation, optional for clients
  role: UserRole;
  temporaryPassword?: boolean;
  cedula?: string;
  birthDate?: string;
  address?: string;
  emergencyContact?: string;
  commentCategory?: CommentCategory;
  comment?: string;
};

// --- Hook to use users from the central store ---
export function useUsers() {
    const { state, isInitialized } = useAppStore();
    return { users: state.users, isInitialized };
}

// --- Data Manipulation Functions ---

const getUserByEmail = (email: string): User | undefined => {
    if (!email) return undefined;
    const users = store.getState().users || [];
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

async function syncUserInSupabase(userData: Partial<User>, isNew: boolean, userIdToUpdate?: number) {
    try {
        const supabase = getClient();
        const { id, ...dataToSync } = userData;

        if (isNew) {
            const { error } = await supabase.from('users').insert(dataToSync);
            if (error) throw error;
        } else if (userIdToUpdate) {
            const { error } = await supabase.from('users').update(dataToSync).eq('id', userIdToUpdate);
            if (error) throw error;
        }
    } catch (error) {
        console.error("Error syncing user in Supabase:", error);
    }
}


export const addUser = (userData: Omit<User, 'id'>): { newUser: User | null, tempPassword?: string } => {
    let tempPassword: string | undefined;
    let newUser: User | null = null;
    let userToSync: Partial<User> = {};
    
    store.updateState(currentState => {
        const currentUsers = currentState.users || [];
        const nextUserId = (currentUsers.reduce((maxId, u) => Math.max(u.id, maxId), 0) || 0) + 1;
        
        let finalUserData: User;

        if (userData.role === 'client') {
            finalUserData = {
                ...userData,
                id: nextUserId,
                password: undefined,
                temporaryPassword: false,
            };
        } else if (userData.role === 'waiter' && userData.cedula) {
             finalUserData = {
                ...userData,
                id: nextUserId,
                password: userData.cedula,
                temporaryPassword: false,
            };
        } else { // Admin or other roles
            tempPassword = Math.random().toString(36).slice(-8);
            finalUserData = {
                ...userData,
                id: nextUserId,
                password: tempPassword,
                temporaryPassword: true,
            };
        }
        
        newUser = finalUserData;
        const { id, ...dataToInsert } = newUser; // Exclude 'id' for insertion
        userToSync = dataToInsert;

        const users = [...currentUsers, finalUserData].sort((a, b) => a.id - b.id);
        return { ...currentState, users };
    });

    if (Object.keys(userToSync).length > 0) {
        syncUserInSupabase(userToSync, true);
    }

    return { newUser, tempPassword };
};

export const updateUser = (userId: number, updatedData: Partial<Omit<User, 'id' | 'password' | 'temporaryPassword'>>): void => {
    let userToSync: Partial<User> = {};
    store.updateState(currentState => {
        const users = currentState.users.map(user => {
            if (user.id === userId) {
                let finalUpdatedUser = { ...user, ...updatedData };
                if(finalUpdatedUser.role === 'waiter' && updatedData.cedula) {
                    finalUpdatedUser.password = updatedData.cedula;
                    finalUpdatedUser.temporaryPassword = false;
                }
                 const { id, ...syncData } = finalUpdatedUser;
                 userToSync = syncData;
                return finalUpdatedUser;
            }
            return user;
        });
        return { ...currentState, users };
    });

    if (Object.keys(userToSync).length > 0) {
        syncUserInSupabase(userToSync, false, userId);
    }
};

export const deleteUser = async (userId: number): Promise<void> => {
    store.updateState(currentState => {
        const users = currentState.users.filter(user => user.id !== userId);
        return { ...currentState, users };
    });
    try {
        const supabase = getClient();
        const { error } = await supabase.from('users').delete().eq('id', userId);
        if (error) throw error;
    } catch (error) {
        console.error("Error deleting user from Supabase:", error);
    }
};

export const validateUser = (email: string, password_plaintext: string, requiredRole?: UserRole) => {
    const user = getUserByEmail(email);
    if (!user) {
        return { success: false, message: 'Usuario no encontrado.' };
    }
    if (requiredRole && user.role !== requiredRole) {
        return { success: false, message: 'El usuario no tiene el rol requerido.' };
    }
    if (user.role !== 'client' && user.password !== password_plaintext) {
         return { success: false, message: 'Contraseña incorrecta.' };
    }
    
    // If validation is successful and role is admin/waiter, setup realtime
    if(user.role === 'admin' || user.role === 'waiter') {
        store.setupRealtimeListeners();
    }

    return { success: true, user, isTemporaryPassword: !!user.temporaryPassword };
};

export const updateUserPassword = (email: string, newPassword_plaintext: string): boolean => {
    let success = false;
    let userToUpdate: User | null = null;
    store.updateState(currentState => {
        const userIndex = currentState.users.findIndex(user => user.email.toLowerCase() === email.toLowerCase());
        if (userIndex === -1) {
            success = false;
            return currentState;
        }

        const newUsers = [...currentState.users];
        userToUpdate = {
            ...newUsers[userIndex],
            password: newPassword_plaintext,
            temporaryPassword: false
        };
        newUsers[userIndex] = userToUpdate;
        
        success = true;
        return { ...currentState, users: newUsers };
    });

    if (success && userToUpdate) {
        const { id, ...syncData } = userToUpdate;
        syncUserInSupabase(syncData, false, id);
    }

    return success;
};

export const getUserFromStorage = (email: string): User | null => {
    const user = getUserByEmail(email);
    if(!user) return null;
    return user;
}
