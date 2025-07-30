
'use client';

import {useAppStore, store} from './store';
import { getClient } from './supabaseClient';

export type PromotionalImage = {
  id: number;
  src: string | null;
  alt: string | null;
  hint: string | null;
};

// This structure now combines data from different tables
export type Settings = {
  barName: string; 
  logoUrl: string | null;
  backgroundUrl: string | null;
  promotionalImages: PromotionalImage[];
};

// --- Hook to get the combined settings from the store ---
export function useSettings() {
    const { state, isInitialized } = useAppStore();
    // We return the individual state parts to prevent unnecessary re-renders.
    return {
        settings: state.settings,
        image_settings: state.image_settings,
        promotional_images: state.promotional_images,
        isInitialized
    };
}

// --- Data Manipulation Functions ---

export const updateSettings = async (newSettings: Settings): Promise<void> => {
  const supabase = getClient();

  // 1. Update bar name in the 'settings' table
  const { error: settingsError } = await supabase
    .from('settings')
    .update({ settings_data: { barName: newSettings.barName } })
    .eq('id', 1);

  if (settingsError) {
    console.error("Error updating bar name in Supabase:", settingsError);
  }

  // 2. Update logo and background URLs in the 'image_settings' table
  const { error: imageSettingsError } = await supabase
    .from('image_settings')
    .update({
      logo_url: newSettings.logoUrl,
      background_url: newSettings.backgroundUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', 1);

  if (imageSettingsError) {
    console.error("Error updating image settings in Supabase:", imageSettingsError);
  }

  // 3. Sync promotional images
  try {
    const { data: currentDbImages, error: fetchError } = await supabase.from('promotional_images').select('id');
    if (fetchError) {
        console.error("Error fetching current images for sync:", fetchError);
        return;
    }

    const localImages = newSettings.promotionalImages || [];
    const localImageIds = localImages.map(img => img.id);
    const dbImageIds = currentDbImages.map(dbImg => dbImg.id);
    
    // DELETE images that are in the DB but not in the local state anymore
    const imageIdsToDelete = dbImageIds.filter(id => !localImageIds.includes(id));
    if (imageIdsToDelete.length > 0) {
        const { error: deleteError } = await supabase.from('promotional_images').delete().in('id', imageIdsToDelete);
        if (deleteError) console.error("Error deleting promotional images:", deleteError);
    }
    
    // UPSERT (Insert or Update) all local images
    if (localImages.length > 0) {
        const upsertData = localImages.map(img => {
            // If it's a new image (with a temporary large ID), prepare it for insertion by removing the id.
            // Supabase will generate a real ID.
            if (img.id >= 1000000000000) {
                return { src: img.src, alt: img.alt, hint: img.hint };
            }
            // If it's an existing image, include its ID for the upsert.
            return { id: img.id, src: img.src, alt: img.alt, hint: img.hint };
        });

        const { error: upsertError } = await supabase.from('promotional_images').upsert(upsertData);
        if (upsertError) {
            console.error("Error upserting promotional images:", upsertError);
        }
    }

  } catch (error) {
    console.error("An unexpected error occurred during promotional image sync:", error);
  }

  // 4. Finally, refresh the local state from the DB to ensure consistency
  await store.fetchData();
};
