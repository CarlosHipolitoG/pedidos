
'use client';

import { useState, useEffect } from 'react';

export type PromotionalImage = {
  id: number;
  src: string;
  alt: string;
  hint: string;
};

export type Settings = {
  barName: string;
  logoUrl: string;
  backgroundUrl: string;
  promotionalImages: PromotionalImage[];
};

const SETTINGS_STORAGE_KEY = 'holiday-friends-settings';

const initialSettings: Settings = {
  barName: 'HOLIDAYS FRIENDS',
  logoUrl: 'https://storage.googleapis.com/project-spark-b6b15e45/c015b678-9e5c-4467-8566-3c0a4c079237.png',
  backgroundUrl: 'https://storage.googleapis.com/project-spark-b6b15e45/dc407172-5953-4565-a83a-48a58ca7694f.png',
  promotionalImages: [
      { id: 1, src: "https://storage.googleapis.com/project-spark-b6b15e45/c015b678-9e5c-4467-8566-3c0a4c079237.png", alt: "Promoción 1", hint: "promotion event" },
      { id: 2, src: "https://storage.googleapis.com/project-spark-b6b15e45/f8365f57-631d-4475-a083-207d5781a7b4.png", alt: "Promoción 2", hint: "special offer" },
      { id: 3, src: "https://storage.googleapis.com/project-spark-b6b15e45/dc407172-5953-4565-a83a-48a58ca7694f.png", alt: "Promoción 3", hint: "discount party" },
      { id: 4, src: "https://storage.googleapis.com/project-spark-b6b15e45/05459f37-64cd-4e89-9a7c-1795c6439167.png", alt: "Promoción 4", hint: "happy hour" },
  ]
};

class SettingsStore {
  private static instance: SettingsStore;
  private settings: Settings;
  private listeners: ((settings: Settings) => void)[] = [];

  private constructor() {
    this.settings = this.loadFromStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageChange);
    }
  }

  private handleStorageChange = (event: StorageEvent) => {
    if (event.key === SETTINGS_STORAGE_KEY && event.newValue) {
      try {
        this.settings = JSON.parse(event.newValue);
        this.broadcast(false);
      } catch (e) {
        console.error("Failed to parse settings from storage event", e);
      }
    }
  }

  private loadFromStorage(): Settings {
    if (typeof window === 'undefined') return initialSettings;
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      try {
        const parsedSettings = JSON.parse(stored);
        // Ensure promotionalImages is an array
        if (!Array.isArray(parsedSettings.promotionalImages)) {
          parsedSettings.promotionalImages = initialSettings.promotionalImages;
        }
        return { ...initialSettings, ...parsedSettings };
      } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
        return initialSettings;
      }
    }
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(initialSettings));
    return initialSettings;
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
  }

  public static getInstance(): SettingsStore {
    if (!SettingsStore.instance) {
      SettingsStore.instance = new SettingsStore();
    }
    return SettingsStore.instance;
  }

  private broadcast(save = true) {
    if (save) {
      this.saveToStorage();
    }
    this.listeners.forEach(listener => listener(this.settings));
  }

  public subscribe(listener: (settings: Settings) => void): () => void {
    this.listeners.push(listener);
    listener(this.settings);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageChange);
    }
  }

  public getSettings(): Settings {
    return this.settings;
  }

  public updateSettings(newSettings: Partial<Settings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.broadcast();
  }
}

const settingsStoreInstance = SettingsStore.getInstance();

export const updateSettings = (newSettings: Partial<Settings>): void => {
  settingsStoreInstance.updateSettings(newSettings);
};

export function useSettings() {
  const [settings, setSettings] = useState(settingsStoreInstance.getSettings());

  useEffect(() => {
    const unsubscribe = settingsStoreInstance.subscribe(newSettings => {
      setSettings({ ...newSettings });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { settings };
}
