
'use client';

import {useAppStore, store} from './store';
import { getClient } from './supabaseClient';

export type PromotionalImage = {
  id: number;
  src: string | null;
  alt: string | null;
  hint: string | null;
};

// Esta estructura ahora combina datos de diferentes tablas
export type Settings = {
  barName: string; // seguirá viniendo de la tabla 'settings' por ahora
  logoUrl: string | null;
  backgroundUrl: string | null;
  promotionalImages: PromotionalImage[];
};

// --- Hook para obtener la configuración combinada desde el store ---
export function useSettings() {
    const { state, isInitialized } = useAppStore();
    // Devolvemos las partes del estado directamente para evitar re-renderizados innecesarios.
    return { 
        settings: state.settings,
        image_settings: state.image_settings,
        promotional_images: state.promotional_images,
        isInitialized 
    };
}

// --- Funciones de Manipulación de Datos ---

export const updateSettings = async (newSettings: Settings): Promise<void> => {
  const supabase = getClient();
  
  // 1. Actualizar el nombre del bar en la tabla 'settings' (la original)
  const { error: settingsError } = await supabase
    .from('settings')
    .update({ settings_data: { barName: newSettings.barName } })
    .eq('id', 1);

  if (settingsError) {
    console.error("Error updating bar name in Supabase:", settingsError);
  }

  // 2. Actualizar las URLs del logo y fondo en la nueva tabla 'image_settings'
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

  // 3. Sincronizar las imágenes promocionales
  try {
    const { data: currentDbImages } = await supabase.from('promotional_images').select('id');
    const currentDbIds = currentDbImages?.map(img => img.id) || [];
    const newImageIds = newSettings.promotionalImages.map(img => img.id);

    const idsToDelete = currentDbIds.filter(id => !newImageIds.includes(id));
    if (idsToDelete.length > 0) {
      await supabase.from('promotional_images').delete().in('id', idsToDelete);
    }
    
    // CORRECCIÓN: Separar los datos para inserción y actualización
    const imagesToUpsert = newSettings.promotionalImages
      .filter(img => img.id < 1000000) // Filtrar solo imágenes existentes
      .map(({ id, ...rest }) => ({ id, ...rest }));

    const imagesToInsert = newSettings.promotionalImages
      .filter(img => img.id >= 1000000) // Filtrar solo imágenes nuevas con ID temporal
      .map(({ src, alt, hint }) => ({ src, alt, hint })); // Omitir el ID temporal

    if (imagesToUpsert.length > 0) {
        const { error: upsertError } = await supabase.from('promotional_images').upsert(imagesToUpsert, { onConflict: 'id' });
        if (upsertError) {
            console.error("Error upserting promotional images:", upsertError);
        }
    }

    if (imagesToInsert.length > 0) {
        const { error: insertError } = await supabase.from('promotional_images').insert(imagesToInsert);
         if (insertError) {
            console.error("Error inserting new promotional images:", insertError);
        }
    }

  } catch (error) {
    console.error("Error managing promotional images:", error);
  }


  // 4. Finalmente, refrescar el estado local desde la DB para asegurar consistencia
  await store.fetchData();
};

export const addPromotionalImage = (newImage: Omit<PromotionalImage, 'id'>) => {
    store.updateState(currentState => {
        // Usamos un ID temporal muy grande para diferenciarlo de los IDs de la BD
        const nextId = Date.now(); 
        return {
            ...currentState,
            promotional_images: [...currentState.promotional_images, { ...newImage, id: nextId }]
        }
    });
}

export const removePromotionalImage = (id: number) => {
    store.updateState(currentState => ({
        ...currentState,
        promotional_images: currentState.promotional_images.filter(img => img.id !== id)
    }));
}
