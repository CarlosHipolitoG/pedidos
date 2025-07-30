
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings, updateSettings, Settings } from '@/lib/settings';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, PlusCircle, Trash2, Shield, Utensils, User, Percent } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function AdminSettingsPage() {
  const { settings, isInitialized } = useSettings();
  const [formState, setFormState] = useState<Omit<Settings, 'promotionalImages'>>({ barName: '', logoUrl: '', backgroundUrl: '', taxRate: 0 });
  const [promoImages, setPromoImages] = useState<Settings['promotionalImages']>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isInitialized && settings) {
      setFormState({
          barName: settings.barName || '',
          logoUrl: settings.logoUrl || '',
          backgroundUrl: settings.backgroundUrl || '',
          taxRate: settings.taxRate ?? 19,
      });
      setPromoImages(settings.promotionalImages || []);
    }
  }, [settings, isInitialized]);

  const handleInputChange = (field: keyof typeof formState, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSaveChanges = async () => {
    const finalSettings: Settings = {
      ...formState,
      promotionalImages: promoImages
    };
    await updateSettings(finalSettings);
    toast({
      title: "Configuración Guardada",
      description: "Los cambios se han guardado exitosamente en la base de datos.",
    });
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() === '') return;
    const newImage = {
        id: -Date.now(),
        src: newImageUrl.trim(),
        alt: 'Promoción',
        hint: 'promotion event'
    };
    setPromoImages(prev => [...prev, newImage]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (id: number) => {
    setPromoImages(prev => prev.filter(img => img.id !== id));
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none'; // Oculta la imagen si hay un error
    // También podrías mostrar una imagen de fallback
  };


  if (!isInitialized || !settings) {
    return (
        <div className="container mx-auto py-8">
             <div className="absolute top-4 right-4 flex gap-2">
                <Link href="/" passHref><Button variant="ghost" size="icon" aria-label="Client Login"><User className="h-5 w-5" /></Button></Link>
                <Link href="/waiter" passHref><Button variant="ghost" size="icon" aria-label="Waiter Login"><Utensils className="h-5 w-5" /></Button></Link>
                <Link href="/admin" passHref><Button variant="ghost" size="icon" aria-label="Admin Login"><Shield className="h-5 w-5" /></Button></Link>
            </div>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8 relative">
      <div className="absolute top-4 right-4 flex gap-2">
          <Link href="/" passHref><Button variant="ghost" size="icon" aria-label="Client Login"><User className="h-5 w-5" /></Button></Link>
          <Link href="/waiter" passHref><Button variant="ghost" size="icon" aria-label="Waiter Login"><Utensils className="h-5 w-5" /></Button></Link>
          <Link href="/admin" passHref><Button variant="ghost" size="icon" aria-label="Admin Login"><Shield className="h-5 w-5" /></Button></Link>
      </div>

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
              onChange={(e) => handleInputChange('barName', e.target.value)}
              placeholder="Ej: HOLIDAYS FRIENDS"
            />
          </div>
           <div className="space-y-2">
              <Label htmlFor="taxRate">Tasa de Impuestos (IVA)</Label>
              <div className="relative">
                  <Input
                    id="taxRate"
                    type="number"
                    value={formState.taxRate}
                    onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                    placeholder="Ej: 19"
                    className="pl-8"
                  />
                  <Percent className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
               <p className="text-xs text-muted-foreground">Define el porcentaje de impuestos a aplicar sobre el subtotal de cada pedido.</p>
            </div>
            
            <div className="space-y-2">
            <Label htmlFor="logoUrl">URL del Logo</Label>
            <Input
              id="logoUrl"
              value={formState.logoUrl || ''}
              onChange={(e) => handleInputChange('logoUrl', e.target.value)}
              placeholder="https://ejemplo.com/logo.png"
            />
             {formState.logoUrl && (
                <div className="p-4 bg-muted rounded-md flex justify-center">
                    <img src={formState.logoUrl} alt="Vista previa del logo" className="h-24 w-auto object-contain rounded-md" onError={handleImageError} />
                </div>
            )}
          </div>
           
          <div className="space-y-2">
            <Label htmlFor="backgroundUrl">URL de la Imagen de Fondo</Label>
            <Input
              id="backgroundUrl"
              value={formState.backgroundUrl || ''}
              onChange={(e) => handleInputChange('backgroundUrl', e.target.value)}
              placeholder="https://ejemplo.com/fondo.jpg"
            />
             {formState.backgroundUrl && (
                <div className="p-4 bg-muted rounded-md flex justify-center">
                    <img src={formState.backgroundUrl} alt="Vista previa del fondo" className="h-24 w-auto object-contain rounded-md" onError={handleImageError} />
                </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Imágenes del Banner Promocional</Label>
            <div className="space-y-2">
                {promoImages.map((img) => (
                    <div key={img.id} className="flex items-center gap-2 p-2 border rounded-md">
                       {img.src && <img src={img.src} alt={img.alt || ''} className="h-12 w-12 object-cover rounded-md flex-shrink-0" onError={handleImageError}/>}
                        <div className="flex-grow min-w-0">
                          <p className="text-sm break-all">{img.src}</p>
                        </div>
                        <Button variant="destructive" size="icon" onClick={() => handleRemoveImage(img.id)} className="flex-shrink-0">
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
