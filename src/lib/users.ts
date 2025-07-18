
'use client';

import {useAppStore, store} from './store';

// Simplified user types
export type UserRole = 'admin' | 'waiter';

export type User = {
  id: number;
  name: string;
  email: string;
  password_hash: string; // Storing a "hash" for simulation
  role: UserRole;
  temporaryPassword?: boolean;
};

// This is NOT secure for production. For demo purposes only.
const simpleHash = (s: string): string => {
  return 'hashed_' + s;
};
const simpleCompare = (s: string, hash: string): boolean => {
  return 'hashed_' + s === hash;
};

// Initial admin user. The password is 'admin123'.
export const initialUsersData: User[] = [
  {
    id: 1,
    name: 'Admin Principal',
    email: 'admin@example.com',
    password_hash: simpleHash('admin123'),
    role: 'admin',
    temporaryPassword: false
  },
];

// --- Hook to use users from the central store ---
export function useUsers() {
    const { state, isInitialized } = useAppStore();
    return { users: state.users, isInitialized };
}

// --- Data Manipulation Functions ---

const getUserByEmail = (email: string): User | undefined => {
    return store.getState().users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export const addUser = (userData: Omit<User, 'id' | 'password_hash' | 'temporaryPassword'>): string => {
    const tempPassword = Math.random().toString(36).slice(-8);
    store.updateState(currentState => {
        const currentUsers = currentState.users || [];
        const nextUserId = (currentUsers.reduce((maxId, u) => Math.max(u.id, maxId), 0) || 0) + 1;
        const newUser: User = {
            ...userData,
            id: nextUserId,
            password_hash: simpleHash(tempPassword),
            temporaryPassword: true,
        };
        const users = [...currentUsers, newUser].sort((a, b) => a.id - b.id);
        return { ...currentState, users };
    });
    return tempPassword;
};

export const updateUser = (userId: number, updatedData: Partial<Omit<User, 'id' | 'password_hash' | 'temporaryPassword'>>): void => {
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
    if (!simpleCompare(password_plaintext, user.password_hash)) {
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
            password_hash: simpleHash(newPassword_plaintext),
            temporaryPassword: false
        };
        success = true;
        return { ...currentState, users: newUsers };
    });
    return success;
};

export const getUserFromStorage = (email: string): { email: string, role: UserRole, password: string, temporaryPassword?: boolean } | null => {
    const user = getUserByEmail(email);
    if(!user) return null;
    return {
        email: user.email,
        role: user.role,
        password: user.password_hash.replace('hashed_',''),
        temporaryPassword: user.temporaryPassword
    };
}
