
'use client';

import { useState, useEffect } from 'react';

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
// In a real app, use a proper hashing library like bcrypt.
const simpleHash = (s: string): string => {
  return 'hashed_' + s;
};
const simpleCompare = (s: string, hash: string): boolean => {
  return 'hashed_' + s === hash;
};


const USERS_STORAGE_KEY = 'holiday-friends-users';

// Initial admin user. The password is 'admin123'.
const initialUsersData: User[] = [
  {
    id: 1,
    name: 'Admin Principal',
    email: 'admin@example.com',
    password_hash: simpleHash('admin123'),
    role: 'admin',
    temporaryPassword: false
  },
];

// --- Centralized State Management for Users ---
class UserStore {
    private static instance: UserStore;
    private users: User[];
    private nextUserId: number;
    private listeners: ((users: User[]) => void)[] = [];

    private constructor() {
        this.users = this.loadFromStorage();
        this.nextUserId = this.users.reduce((maxId, user) => Math.max(user.id, maxId), 0) + 1;
        
        if (typeof window !== 'undefined') {
            window.addEventListener('storage', this.handleStorageChange);
        }
    }
    
    private handleStorageChange = (event: StorageEvent) => {
        if (event.key === USERS_STORAGE_KEY && event.newValue) {
            try {
                this.users = JSON.parse(event.newValue);
                this.broadcast(false); // Do not save again, just notify listeners
            } catch(e) {
                console.error("Failed to parse users from storage event", e);
            }
        }
    }

    private loadFromStorage(): User[] {
        if (typeof window === 'undefined') return initialUsersData;
        const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
        if (storedUsers) {
            try {
                return JSON.parse(storedUsers);
            } catch (e) {
                console.error("Failed to parse users from localStorage", e);
                return initialUsersData;
            }
        }
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsersData));
        return initialUsersData;
    }

    private saveToStorage() {
        if (typeof window === 'undefined') return;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    }

    public static getInstance(): UserStore {
        if (!UserStore.instance) {
            UserStore.instance = new UserStore();
        }
        return UserStore.instance;
    }

    private broadcast(save = true) {
        if (save) {
            this.saveToStorage();
        }
        this.listeners.forEach(listener => listener(this.users));
    }

    public subscribe(listener: (users: User[]) => void): () => void {
        this.listeners.push(listener);
        listener(this.users);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    
    public destroy() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('storage', this.handleStorageChange);
        }
    }

    public getUsers(): User[] {
        return this.users;
    }

    public getUserByEmail(email: string): User | undefined {
        return this.users.find(user => user.email.toLowerCase() === email.toLowerCase());
    }

    public addUser(userData: Omit<User, 'id' | 'password_hash' | 'temporaryPassword'>): string {
        const tempPassword = Math.random().toString(36).slice(-8);
        const newUser: User = {
            ...userData,
            id: this.nextUserId++,
            password_hash: simpleHash(tempPassword),
            temporaryPassword: true,
        };
        this.users = [...this.users, newUser].sort((a,b) => a.id - b.id);
        this.broadcast();
        return tempPassword;
    }

    public updateUser(userId: number, updatedData: Partial<Omit<User, 'id' | 'password_hash' | 'temporaryPassword'>>): void {
        this.users = this.users.map(user =>
            user.id === userId ? { ...user, ...updatedData } : user
        );
        this.broadcast();
    }
    
    public deleteUser(userId: number): void {
        this.users = this.users.filter(user => user.id !== userId);
        this.broadcast();
    }

    public validateUser(email: string, password_plaintext: string, requiredRole?: UserRole) {
        const user = this.getUserByEmail(email);
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
    }

    public updateUserPassword(email: string, newPassword_plaintext: string): boolean {
        const userIndex = this.users.findIndex(user => user.email.toLowerCase() === email.toLowerCase());
        if (userIndex === -1) {
            return false;
        }

        this.users[userIndex].password_hash = simpleHash(newPassword_plaintext);
        this.users[userIndex].temporaryPassword = false;
        this.broadcast();
        return true;
    }
    
    // Unsafe function for demo password recovery
    public getPasswordForRecovery(email: string): { password_plaintext: string, isTemporary: boolean } | null {
        // This is highly insecure and for demo purposes only.
        // It "reverses" the hash to show the password.
        const user = this.getUserByEmail(email);
        if(!user) return null;

        return {
            password_plaintext: user.password_hash.replace('hashed_',''),
            isTemporary: !!user.temporaryPassword
        }
    }
}

const userStoreInstance = UserStore.getInstance();

export const addUser = (userData: Omit<User, 'id' | 'password_hash' | 'temporaryPassword'>): string => {
    return userStoreInstance.addUser(userData);
};

export const updateUser = (userId: number, updatedData: Partial<Omit<User, 'id' | 'password_hash'>>): void => {
    userStoreInstance.updateUser(userId, updatedData);
};

export const deleteUser = (userId: number): void => {
    userStoreInstance.deleteUser(userId);
};

export const validateUser = (email: string, password_plaintext: string, requiredRole?: UserRole) => {
    return userStoreInstance.validateUser(email, password_plaintext, requiredRole);
};

export const updateUserPassword = (email: string, newPassword_plaintext: string): boolean => {
    return userStoreInstance.updateUserPassword(email, newPassword_plaintext);
};

// This is a helper for pages that need to read user info without a full hook
export const getUserFromStorage = (email: string): { email: string, role: UserRole, password: string, temporaryPassword?: boolean } | null => {
    const users = userStoreInstance.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if(!user) return null;
    return {
        email: user.email,
        role: user.role,
        password: user.password_hash.replace('hashed_', ''),
        temporaryPassword: user.temporaryPassword
    };
}

export function useUsers() {
    const [users, setUsers] = useState(userStoreInstance.getUsers());

    useEffect(() => {
        const unsubscribe = userStoreInstance.subscribe(newUsers => {
            setUsers([...newUsers]);
        });
        
        return () => {
            unsubscribe();
        };
    }, []);

    return { users };
}
