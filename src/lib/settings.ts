
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
    const { data: currentDbImages, error: fetchError } = await supabase.from('promotional_images').select('id, src, alt, hint');
    if (fetchError) {
        console.error("Error fetching current images:", fetchError);
        return;
    }

    const localImages = newSettings.promotionalImages || [];

    // Imágenes para insertar: aquellas en local que no tienen un ID en la BD
    const imagesToInsert = localImages
        .filter(img => !currentDbImages.some(dbImg => dbImg.id === img.id))
        .map(img => ({ src: img.src, alt: img.alt, hint: img.hint })); // Corregido: Crear objeto nuevo sin 'id'

    // Imágenes para actualizar: aquellas que están en ambos y tienen diferente contenido
    const imagesToUpdate = localImages
        .filter(img => {
            const dbImg = currentDbImages.find(dbImg => dbImg.id === img.id);
            return dbImg && (dbImg.src !== img.src || dbImg.alt !== img.alt || dbImg.hint !== img.hint);
        })
        .map(({ id, src, alt, hint }) => ({ id, src, alt, hint }));

    // IDs para eliminar: aquellos que están en la BD pero no en local
    const localImageIds = localImages.map(img => img.id);
    const imageIdsToDelete = currentDbImages
        .filter(dbImg => !localImageIds.includes(dbImg.id))
        .map(dbImg => dbImg.id);

    // Realizar operaciones en la BD
    if (imagesToInsert.length > 0) {
        const { error: insertError } = await supabase.from('promotional_images').insert(imagesToInsert);
        if (insertError) console.error("Error inserting new promotional images:", insertError);
    }

    if (imagesToUpdate.length > 0) {
       for(const image of imagesToUpdate) {
           const { error: updateError } = await supabase.from('promotional_images').update({ src: image.src, alt: image.alt, hint: image.hint }).eq('id', image.id);
           if (updateError) console.error(`Error updating image ${image.id}:`, updateError);
       }
    }

    if (imageIdsToDelete.length > 0) {
        const { error: deleteError } = await supabase.from('promotional_images').delete().in('id', imageIdsToDelete);
        if (deleteError) console.error("Error deleting promotional images:", deleteError);
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
