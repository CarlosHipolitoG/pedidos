
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
