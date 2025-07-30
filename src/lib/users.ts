
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

const getUserByCedula = (cedula: string): User | undefined => {
    if (!cedula) return undefined;
    const users = store.getState().users || [];
    return users.find(user => user.cedula === cedula);
};


export const addUser = async (userData: Omit<User, 'id' | 'password' | 'temporaryPassword'>): Promise<{ newUser: User | null, tempPassword?: string, error?: string }> => {
    let tempPassword: string | undefined;

    // Check for duplicate cedula
    if (userData.cedula && getUserByCedula(userData.cedula)) {
        return { newUser: null, error: `La cédula ${userData.cedula} ya está registrada.` };
    }
    
    // Explicitly copy only the fields we expect, including the role
    const dataToPrepare: Partial<User> = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role, // Make sure role is included
        cedula: userData.cedula,
        birthDate: userData.birthDate,
        address: userData.address,
        emergencyContact: userData.emergencyContact,
        commentCategory: userData.commentCategory,
        comment: userData.comment,
    };

    if (userData.role === 'client') {
        dataToPrepare.password = undefined;
        dataToPrepare.temporaryPassword = false;
    } else if (userData.role === 'waiter' && userData.cedula) {
        dataToPrepare.password = userData.cedula;
        dataToPrepare.temporaryPassword = false;
    } else { // Admin or other roles
        tempPassword = Math.random().toString(36).slice(-8);
        dataToPrepare.password = tempPassword;
        dataToPrepare.temporaryPassword = true;
    }

    try {
        const supabase = getClient();
        const { data: newSupabaseUser, error } = await supabase
            .from('users')
            .insert(dataToPrepare)
            .select()
            .single();

        if (error) {
            console.error("Error inserting user into Supabase:", error);
            if (error.message.includes('duplicate key value violates unique constraint')) {
                 return { newUser: null, error: 'El correo electrónico ya está en uso.' };
            }
            throw error;
        }

        const newUser: User = newSupabaseUser;

        store.updateState(currentState => {
            const users = [...(currentState.users || []), newUser].sort((a, b) => a.id - b.id);
            return { ...currentState, users };
        });

        return { newUser, tempPassword };

    } catch (error) {
        console.error("Error adding user:", error);
        return { newUser: null, tempPassword: undefined, error: 'Ocurrió un error inesperado al registrar el usuario.' };
    }
};

export const updateUser = async (userId: number, updatedData: Partial<User>): Promise<void> => {
    try {
        const supabase = getClient();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...dataToSync } = updatedData;

        const { data: updatedSupabaseUser, error } = await supabase
            .from('users')
            .update(dataToSync)
            .eq('id', userId)
            .select()
            .single();
        
        if (error) {
            console.error("Error updating user in Supabase:", error);
            throw error;
        }
        
        store.updateState(currentState => {
            const users = currentState.users.map(user => 
                user.id === userId ? { ...user, ...updatedSupabaseUser } : user
            );
            return { ...currentState, users };
        });

    } catch(error) {
         console.error("Error updating user:", error);
    }
};

export const deleteUser = async (userId: number): Promise<void> => {
    try {
        const supabase = getClient();
        const { error } = await supabase.from('users').delete().eq('id', userId);
        
        if (error) {
            console.error("Error deleting user from Supabase:", error);
            throw error;
        }

        store.updateState(currentState => {
            const users = currentState.users.filter(user => user.id !== userId);
            return { ...currentState, users };
        });

    } catch (error) {
        console.error("Error deleting user:", error);
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...syncData } = userToUpdate;
        updateUser(id, syncData);
    }

    return success;
};

export const getUserFromStorage = (email: string): User | null => {
    const user = getUserByEmail(email);
    if(!user) return null;
    return user;
}
