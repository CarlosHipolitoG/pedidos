
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

  // 3. Sync promotional images using upsert
  try {
    const localImages = newSettings.promotionalImages || [];
    
    // Upsert all local images
    if (localImages.length > 0) {
      const upsertData = localImages.map(img => ({
          // If the ID is a large temporary one, we let the DB generate it
          id: img.id > 1000000000 ? undefined : img.id,
          src: img.src,
          alt: img.alt,
          hint: img.hint
      }));

      const { error: upsertError } = await supabase.from('promotional_images').upsert(upsertData, { onConflict: 'id' });
      if (upsertError) {
          console.error("Error upserting promotional images:", upsertError);
      }
    }

    // Delete images that are in the DB but not in the local state anymore
    const { data: currentDbImages, error: fetchError } = await supabase.from('promotional_images').select('id');
    if (fetchError) {
      console.error("Error fetching current images for sync:", fetchError);
    } else {
      const localImageIds = localImages.map(img => img.id);
      const dbImageIds = currentDbImages.map(dbImg => dbImg.id);
      const imageIdsToDelete = dbImageIds.filter(id => !localImageIds.includes(id));

      if (imageIdsToDelete.length > 0) {
        const { error: deleteError } = await supabase.from('promotional_images').delete().in('id', imageIdsToDelete);
        if (deleteError) {
          console.error("Error deleting old promotional images:", deleteError);
        }
      }
    }

  } catch (error) {
    console.error("An unexpected error occurred during promotional image sync:", error);
  }

  // 4. Finally, refresh the local state from the DB to ensure consistency
  await store.fetchData();
};
