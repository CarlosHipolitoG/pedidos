
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings, updateSettings, Settings, PromotionalImage } from '@/lib/settings';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const { settings } = useSettings();
  const [formState, setFormState] = useState<Settings>({ barName: '', logoUrl: '', backgroundUrl: '', promotionalImages: [] });
  const [newImageUrl, setNewImageUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (settings) {
      setFormState(settings);
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = () => {
    updateSettings(formState);
    toast({
      title: "Configuración Guardada",
      description: "Los cambios se han guardado exitosamente.",
    });
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() === '') return;
    const newImage: PromotionalImage = {
        id: Date.now(), // simple unique id
        src: newImageUrl.trim(),
        alt: 'Promoción',
        hint: 'promotion event'
    };
    setFormState(prev => ({
        ...prev,
        promotionalImages: [...(prev.promotionalImages || []), newImage]
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (id: number) => {
    setFormState(prev => ({
        ...prev,
        promotionalImages: (prev.promotionalImages || []).filter(img => img.id !== id)
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Button variant="ghost" asChild>
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel Principal
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Configuración General</CardTitle>
          <CardDescription>
            Personaliza la apariencia y la información de tu negocio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="barName">Nombre del Bar</Label>
            <Input
              id="barName"
              value={formState.barName}
              onChange={handleInputChange}
              placeholder="Ej: HOLIDAYS FRIENDS"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoUrl">URL del Logotipo</Label>
            <Input
              id="logoUrl"
              value={formState.logoUrl}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com/logo.png"
            />
            {formState.logoUrl && (
                <div className="p-4 bg-muted rounded-md flex justify-center">
                    <img src={formState.logoUrl} alt="Vista previa del logo" className="h-20 w-20 object-contain rounded-full" />
                </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="backgroundUrl">URL de la Imagen de Fondo</Label>
            <Input
              id="backgroundUrl"
              value={formState.backgroundUrl}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com/fondo.jpg"
            />
             {formState.backgroundUrl && (
                <div className="p-4 bg-muted rounded-md flex justify-center">
                    <img src={formState.backgroundUrl} alt="Vista previa del fondo" className="h-24 w-auto object-contain rounded-md" />
                </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Imágenes del Banner Promocional</Label>
            <div className="space-y-2">
                {(formState.promotionalImages || []).map((img) => (
                    <div key={img.id} className="flex items-center gap-2 p-2 border rounded-md">
                        <img src={img.src} alt="preview" className="h-12 w-20 object-cover rounded-md"/>
                        <p className="text-sm truncate flex-grow">{img.src}</p>
                        <Button variant="destructive" size="icon" onClick={() => handleRemoveImage(img.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <Input
                    type="text"
                    placeholder="Añadir nueva URL de imagen..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <Button onClick={handleAddImage}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Añadir
                </Button>
            </div>
          </div>
          
          <Button onClick={handleSaveChanges} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Guardar Todos los Cambios
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
