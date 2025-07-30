
'use client';

import {useAppStore, store} from './store';
import { useMemo } from 'react';
import { getClient } from './supabaseClient';

export type PromotionalImage = {
  id: number;
  src: string | null;
  alt: string | null;
  hint: string | null;
};

export type Settings = {
  barName: string;
  logoUrl: string | null;
  backgroundUrl: string | null;
  promotionalImages: PromotionalImage[];
  taxRate?: number;
};

// --- Hook to get combined settings from the store ---
export function useSettings() {
    const { state, isInitialized } = useAppStore();
    
    const settings: Settings | null = useMemo(() => {
        const generalSettings = state.settings;
        if (!generalSettings) return null;

        // Direct mapping from the fetched Supabase data to the application's Settings type
        return {
            barName: generalSettings.barName,
            logoUrl: generalSettings.logoUrl, // Correctly map from the database field name
            backgroundUrl: generalSettings.background_url,
            promotionalImages: state.promotional_images || [],
            taxRate: generalSettings.taxRate ?? 19,
        };
    }, [state.settings, state.promotional_images]);

    return {
        settings,
        isInitialized
    };
}


// --- Data Manipulation Functions ---

export const updateSettings = async (formState: Settings): Promise<void> => {
  const supabase = getClient();

  // 1. Update general settings (name, logo, background)
  const { error: settingsError } = await supabase
    .from('settings')
    .update({
      barName: formState.barName, 
      taxRate: formState.taxRate,
      logoUrl: formState.logoUrl,
      background_url: formState.backgroundUrl
    })
    .eq('id', 1);

  if (settingsError) {
    console.error("Error updating general settings in Supabase:", settingsError);
  }

  // 2. Synchronize promotional images
  try {
    const { data: dbImages, error: fetchError } = await supabase.from('promotional_images').select('id');
    if (fetchError) {
      console.error("Error fetching promotional images for sync:", fetchError);
      return;
    }
    
    const dbImageIds = dbImages.map(img => img.id);
    const localImages = formState.promotionalImages || [];
    const localImageIds = localImages.map(img => img.id).filter(id => typeof id === 'number' && id > 0);

    const imagesToInsert = localImages
      .filter(img => img.id <= 0)
      .map(({ src, alt, hint }) => ({ src, alt, hint }));

    const imagesToUpdate = localImages.filter(img => dbImageIds.includes(img.id));
    const imageIdsToDelete = dbImageIds.filter(id => !localImageIds.includes(id));

    if (imagesToInsert.length > 0) {
        const { error: insertError } = await supabase.from('promotional_images').insert(imagesToInsert);
        if (insertError) console.error("Error inserting new promotional images:", insertError);
    }

    if (imagesToUpdate.length > 0) {
      const updatePromises = imagesToUpdate.map(img =>
        supabase.from('promotional_images').update({ src: img.src, alt: img.alt, hint: img.hint }).eq('id', img.id)
      );
       try {
        await Promise.all(updatePromises);
      } catch (e) {
        console.error("Error during one of the image updates:", e);
      }
    }

    if (imageIdsToDelete.length > 0) {
      const { error: deleteError } = await supabase.from('promotional_images').delete().in('id', imageIdsToDelete);
      if (deleteError) console.error("Error deleting old promotional images:", deleteError);
    }

  } catch (error) {
    console.error("An unexpected error occurred during promotional images sync:", error);
  }

  await store.fetchData();
};
