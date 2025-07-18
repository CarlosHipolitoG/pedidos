
'use client';

import {useAppStore, store} from './store';

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

// Initial admin user. The password is 'admin123'.
export const initialUsersData: User[] = [
  {
    id: 1,
    name: 'Admin Principal',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    temporaryPassword: false
  },
  {
    id: 2,
    name: 'Juan Mesero',
    email: 'mesero@example.com',
    password: 'password123',
    role: 'waiter',
    temporaryPassword: true
  },
];

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

export const addUser = (userData: Omit<User, 'id'>): { newUser: User, tempPassword?: string } => {
    let tempPassword: string | undefined;
    let newUser: User | null = null;
    
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
        } else {
            tempPassword = Math.random().toString(36).slice(-8);
            finalUserData = {
                ...userData,
                id: nextUserId,
                password: tempPassword,
                temporaryPassword: true,
            };
        }
        
        newUser = finalUserData;
        const users = [...currentUsers, finalUserData].sort((a, b) => a.id - b.id);
        return { ...currentState, users };
    });

    return { newUser: newUser!, tempPassword };
};

export const updateUser = (userId: number, updatedData: Partial<Omit<User, 'id' | 'password' | 'temporaryPassword'>>): void => {
    store.updateState(currentState => {
        const users = currentState.users.map(user =>
            user.id === userId ? { ...user, ...updatedData } : user
        );
        return { ...currentState, users };
    });
};

export const deleteUser = (userId: number): void => {
    store.updateState(currentState => {
        const users = currentState.users.filter(user => user.id !== userId);
        return { ...currentState, users };
    });
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
    return { success: true, user, isTemporaryPassword: !!user.temporaryPassword };
};

export const updateUserPassword = (email: string, newPassword_plaintext: string): boolean => {
    let success = false;
    store.updateState(currentState => {
        const userIndex = currentState.users.findIndex(user => user.email.toLowerCase() === email.toLowerCase());
        if (userIndex === -1) {
            success = false;
            return currentState;
        }

        const newUsers = [...currentState.users];
        newUsers[userIndex] = {
            ...newUsers[userIndex],
            password: newPassword_plaintext,
            temporaryPassword: false
        };
        success = true;
        return { ...currentState, users: newUsers };
    });
    return success;
};

export const getUserFromStorage = (email: string): User | null => {
    const user = getUserByEmail(email);
    if(!user) return null;
    return user;
}
