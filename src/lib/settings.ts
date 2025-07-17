
'use client';

import {useAppStore, store} from './store';

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

export const initialSettings: Settings = {
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

// --- Hook to get settings from the central store ---
export function useSettings() {
    const { state, isInitialized } = useAppStore();
    return { settings: state.settings, isInitialized };
}

// --- Data Manipulation Functions ---

export const updateSettings = (newSettings: Partial<Settings>): void => {
  store.updateState(currentState => ({
    ...currentState,
    settings: { ...currentState.settings, ...newSettings }
  }));
};
