
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
  barName: string; 
  logoUrl: string | null;
  backgroundUrl: string | null;
  promotionalImages: PromotionalImage[];
};

// --- Hook para obtener las configuraciones combinadas del store ---
export function useSettings() {
    const { state, isInitialized } = useAppStore();
    // Devolvemos las partes individuales del estado para evitar re-renderizados innecesarios.
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

  // 1. Actualizar el nombre del bar en la tabla 'settings'
  const { error: settingsError } = await supabase
    .from('settings')
    .update({ settings_data: { barName: newSettings.barName } })
    .eq('id', 1);

  if (settingsError) {
    console.error("Error al actualizar el nombre del bar en Supabase:", settingsError);
  }

  // 2. Actualizar las URLs del logo y del fondo en la tabla 'image_settings'
  const { error: imageSettingsError } = await supabase
    .from('image_settings')
    .update({
      logo_url: newSettings.logoUrl,
      background_url: newSettings.backgroundUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', 1);

  if (imageSettingsError) {
    console.error("Error al actualizar la configuración de imágenes en Supabase:", imageSettingsError);
  }

  // 3. Sincronizar las imágenes promocionales
  try {
    const localImages = newSettings.promotionalImages || [];
    
    // Paso A: Obtener todas las imágenes actuales de la base de datos
    const { data: dbImages, error: fetchError } = await supabase.from('promotional_images').select('id, src, alt, hint');
    if (fetchError) {
        console.error("Error al obtener las imágenes promocionales para la sincronización:", fetchError);
        return; // No continuar si no podemos obtener el estado actual
    }
    const dbImageIds = dbImages.map(img => img.id);

    // Paso B: Separar las imágenes locales en listas para insertar, actualizar y eliminar
    const imagesToInsert = localImages.filter(img => !dbImageIds.includes(img.id));
    const imagesToUpdate = localImages.filter(img => {
      const dbImg = dbImages.find(i => i.id === img.id);
      return dbImg && (dbImg.src !== img.src || dbImg.alt !== img.alt || dbImg.hint !== img.hint);
    });
    const localImageIds = localImages.map(img => img.id);
    const imageIdsToDelete = dbImageIds.filter(id => !localImageIds.includes(id));
    
    // Paso C: Realizar operaciones en la base de datos
    if (imagesToInsert.length > 0) {
        // IMPORTANTE: Crear nuevos objetos sin el 'id' temporal para la inserción
        const insertData = imagesToInsert.map(({ src, alt, hint }) => ({ src, alt, hint }));
        const { error: insertError } = await supabase.from('promotional_images').insert(insertData);
        if (insertError) console.error("Error al insertar nuevas imágenes promocionales:", insertError);
    }

    if (imagesToUpdate.length > 0) {
        const updatePromises = imagesToUpdate.map(img =>
            supabase.from('promotional_images').update({ src: img.src, alt: img.alt, hint: img.hint }).eq('id', img.id)
        );
        const results = await Promise.all(updatePromises);
        results.forEach(res => {
            if (res.error) console.error("Error al actualizar imagen promocional:", res.error);
        });
    }

    if (imageIdsToDelete.length > 0) {
        const { error: deleteError } = await supabase.from('promotional_images').delete().in('id', imageIdsToDelete);
        if (deleteError) console.error("Error al eliminar imágenes promocionales antiguas:", deleteError);
    }

  } catch (error) {
    console.error("Un error inesperado ocurrió durante la sincronización de imágenes promocionales:", error);
  }

  // 4. Finalmente, refrescar el estado local desde la BD para asegurar consistencia
  await store.fetchData();
};
