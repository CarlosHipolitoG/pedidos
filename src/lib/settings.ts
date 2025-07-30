
'use client';

import {useAppStore, store} from './store';
import { getClient } from './supabaseClient';

export type PromotionalImage = {
  id: number;
  src: string;
  alt: string;
  hint: string;
};

// Esta estructura ahora combina datos de diferentes tablas
export type Settings = {
  barName: string; // seguirá viniendo de la tabla 'settings' por ahora
  logoUrl: string;
  backgroundUrl: string;
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
  // Primero, obtener las imágenes actuales de la DB
  const { data: currentDbImages } = await supabase.from('promotional_images').select('id');
  const currentDbIds = currentDbImages?.map(img => img.id) || [];
  const newImageIds = newSettings.promotionalImages.map(img => img.id);

  // Borrar las que ya no están
  const idsToDelete = currentDbIds.filter(id => !newImageIds.includes(id));
  if (idsToDelete.length > 0) {
    const { error: deleteError } = await supabase
        .from('promotional_images')
        .delete()
        .in('id', idsToDelete);
     if (deleteError) console.error("Error deleting promo images:", deleteError);
  }

  // Actualizar o insertar las nuevas/existentes
  const upsertPromises = newSettings.promotionalImages.map(img => {
    const { id, ...imgData } = img;
    return supabase.from('promotional_images').upsert({ id: id > 1000000 ? undefined : id, ...imgData });
  });
  await Promise.all(upsertPromises);


  // 4. Finalmente, refrescar el estado local desde la DB para asegurar consistencia
  await store.fetchData();
};

export const addPromotionalImage = (newImage: Omit<PromotionalImage, 'id'>) => {
    store.updateState(currentState => {
        const nextId = (currentState.promotional_images.reduce((maxId, p) => Math.max(p.id, maxId), 0) || 0) + 1;
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
