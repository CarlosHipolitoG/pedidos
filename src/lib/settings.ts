
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
    const localImages = newSettings.promotionalImages || [];
    
    // Step A: Get all current image IDs from the database
    const { data: dbImages, error: fetchError } = await supabase.from('promotional_images').select('id');
    if (fetchError) {
        console.error("Error fetching promotional images for sync:", fetchError);
        return;
    }
    const dbImageIds = dbImages.map(img => img.id);

    // Step B: Separate local images into insert, update, and delete lists
    const imagesToInsert = localImages.filter(img => img.id > 1000000000 || !dbImageIds.includes(img.id));
    const imagesToUpdate = localImages.filter(img => dbImageIds.includes(img.id));
    const localImageIds = localImages.map(img => img.id);
    const imageIdsToDelete = dbImageIds.filter(id => !localImageIds.includes(id));
    
    // Step C: Perform database operations
    if (imagesToInsert.length > 0) {
        // IMPORTANT: Create new objects without the temporary 'id' for insertion
        const insertData = imagesToInsert.map(({ src, alt, hint }) => ({ src, alt, hint }));
        const { error: insertError } = await supabase.from('promotional_images').insert(insertData);
        if (insertError) console.error("Error inserting new promotional images:", insertError);
    }

    if (imagesToUpdate.length > 0) {
        // The id already exists, so we just update the other fields
        const updatePromises = imagesToUpdate.map(img =>
            supabase.from('promotional_images').update({ src: img.src, alt: img.alt, hint: img.hint }).eq('id', img.id)
        );
        const results = await Promise.all(updatePromises);
        results.forEach(res => {
            if (res.error) console.error("Error updating promotional image:", res.error);
        });
    }

    if (imageIdsToDelete.length > 0) {
        const { error: deleteError } = await supabase.from('promotional_images').delete().in('id', imageIdsToDelete);
        if (deleteError) console.error("Error deleting old promotional images:", deleteError);
    }

  } catch (error) {
    console.error("An unexpected error occurred during promotional image sync:", error);
  }


  // 4. Finally, refresh the local state from the DB to ensure consistency
  await store.fetchData();
};
