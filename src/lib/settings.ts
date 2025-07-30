
'use client';

import {useAppStore, store} from './store';
import { getClient } from './supabaseClient';
import { useMemo } from 'react';

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

// --- Hook to get combined settings from the store ---
export function useSettings() {
    const { state, isInitialized } = useAppStore();
    
    // useMemo will prevent creating a new object on every render if the dependencies don't change.
    const settings = useMemo(() => {
        const generalSettings = state.settings || { barName: 'HOLIDAYS FRIENDS' };
        const imageSettings = state.image_settings || { logoUrl: null, backgroundUrl: null };
        const promotionalImages = state.promotional_images || [];

        return {
            barName: generalSettings.barName,
            logoUrl: imageSettings.logoUrl,
            backgroundUrl: imageSettings.backgroundUrl,
            promotionalImages: promotionalImages
        };
    }, [state.settings, state.image_settings, state.promotional_images]);

    return {
        settings,
        isInitialized
    };
}


// --- Data Manipulation Functions ---

export const updateSettings = async (formState: Settings): Promise<void> => {
  const supabase = getClient();

  // 1. Update bar name in 'settings' table
  const { error: settingsError } = await supabase
    .from('settings')
    .update({ settings_data: { barName: formState.barName } })
    .eq('id', 1);

  if (settingsError) {
    console.error("Error updating bar name in Supabase:", settingsError);
  }

  // 2. Update logo and background URLs in 'image_settings' table
  const { error: imageSettingsError } = await supabase
    .from('image_settings')
    .update({
      logo_url: formState.logoUrl,
      background_url: formState.backgroundUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', 1);

  if (imageSettingsError) {
    console.error("Error updating image settings in Supabase:", imageSettingsError);
  }

  // 3. Synchronize promotional images
  try {
    const { data: dbImages, error: fetchError } = await supabase.from('promotional_images').select('id');
    if (fetchError) {
      console.error("Error fetching promotional images for sync:", fetchError);
      // Don't proceed if we can't determine what's in the DB
      return;
    }
    const dbImageIds = dbImages.map(img => img.id);

    const localImages = formState.promotionalImages || [];
    const localImageIds = localImages.map(img => img.id).filter(id => typeof id === 'number' && id > 0);

    // New images have temporary negative IDs or are not in dbImageIds
    const imagesToInsert = localImages
      .filter(img => !dbImageIds.includes(img.id))
      .map(({ src, alt, hint }) => ({ src, alt, hint })); // Create new objects without ID

    const imagesToUpdate = localImages
      .filter(img => dbImageIds.includes(img.id));

    const imageIdsToDelete = dbImageIds.filter(id => !localImageIds.includes(id));

    if (imagesToInsert.length > 0) {
        const { error: insertError } = await supabase.from('promotional_images').insert(imagesToInsert);
        if (insertError) console.error("Error inserting new promotional images:", insertError);
    }

    if (imagesToUpdate.length > 0) {
      const updatePromises = imagesToUpdate.map(img => 
        supabase.from('promotional_images').update({ src: img.src, alt: img.alt, hint: img.hint }).eq('id', img.id)
      );
      // Use Promise.allSettled to wait for all updates and log any that fail
      const results = await Promise.allSettled(updatePromises);
      results.forEach(result => {
        if (result.status === 'rejected') {
          console.error("Error updating image:", result.reason);
        }
      });
    }

    if (imageIdsToDelete.length > 0) {
      const { error: deleteError } = await supabase.from('promotional_images').delete().in('id', imageIdsToDelete);
      if (deleteError) console.error("Error deleting old promotional images:", deleteError);
    }

  } catch (error) {
    console.error("An unexpected error occurred during promotional images sync:", error);
  }

  // 4. Finally, refresh the local state from the DB to ensure consistency
  // Defer this to a manual refresh or rely on realtime to avoid race conditions
  await store.fetchData();
};
