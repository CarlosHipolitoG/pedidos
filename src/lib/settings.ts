
'use client';

import {useAppStore, store} from './store';
import { getClient } from './supabaseClient';

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

export const updateSettings = async (newSettings: Settings): Promise<void> => {
  // Update local store immediately for responsiveness
  store.updateState(currentState => ({
    ...currentState,
    settings: newSettings
  }));

  // Then, persist the changes to Supabase
  try {
    const supabase = getClient();
    // Assuming we have only one row for settings in the DB, with id=1
    const { error } = await supabase
      .from('settings')
      .update({ settings_data: newSettings })
      .eq('id', 1); 
    
    if (error) {
      console.error("Error updating settings in Supabase:", error);
      // Optional: handle error, maybe revert local state or show a toast
    }
  } catch (error) {
     console.error("Error in updateSettings:", error);
  }
};
