
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Utensils, History, X, User, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSettings, PromotionalImage } from '@/lib/settings';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hasPreviousOrders, setHasPreviousOrders] = useState(false);
  const { settings, isInitialized: isSettingsInitialized } = useSettings();
  const router = useRouter();
  const [emblaApi, setEmblaApi] = useState<CarouselApi | undefined>(undefined);
  const [promotionalImages, setPromotionalImages] = useState<PromotionalImage[]>([]);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  useEffect(() => {
    const storedPhone = localStorage.getItem('customerPhone');
    if (storedPhone) {
      setHasPreviousOrders(true);
    }
  }, []);

  useEffect(() => {
    if (isSettingsInitialized && settings?.promotionalImages) {
        setPromotionalImages(settings.promotionalImages);
    }
  }, [isSettingsInitialized, settings]);

  useEffect(() => {
    if (emblaApi) {
        emblaApi.reInit();
        autoplayPlugin.current.play();
    }
  }, [emblaApi, promotionalImages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      localStorage.setItem('customerName', name);
      localStorage.setItem('customerPhone', phone);
      localStorage.removeItem('customerEmail');
      localStorage.removeItem('activeOrderId');
      router.push('/menu');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
        <div className={cn("absolute top-4 right-4 flex gap-2 z-20")}>
             <Link href="/" passHref>
                <Button variant="ghost" size="icon" aria-label="Client Login" className="text-white bg-black/50 hover:bg-black/70 hover:text-white">
                    <User className="h-5 w-5" />
                </Button>
            </Link>
            <Link href="/waiter" passHref>
                <Button variant="ghost" size="icon" aria-label="Waiter Login" className="text-white bg-black/50 hover:bg-black/70 hover:text-white">
                    <Utensils className="h-5 w-5" />
                </Button>
            </Link>
            <Link href="/admin" passHref>
                <Button variant="ghost" size="icon" aria-label="Admin Login" className="text-white bg-black/50 hover:bg-black/70 hover:text-white">
                    <Shield className="h-5 w-5" />
                </Button>
            </Link>
        </div>

        <div className="z-10 relative flex flex-col md:flex-row items-center justify-center gap-8 w-full">
            {promotionalImages.length > 0 && (
                 <Card className="hidden md:block w-full max-w-md bg-card/80 backdrop-blur-sm">
                     <CardContent className="p-0">
                         <Carousel
                            setApi={setEmblaApi}
                            plugins={[autoplayPlugin.current]}
                            className="w-full"
                            onMouseEnter={() => autoplayPlugin.current.stop()}
                            onMouseLeave={() => autoplayPlugin.current.play()}
                        >
                            <CarouselContent>
                                {promotionalImages.map((img) => (
                                    <CarouselItem key={img.id}>
                                        <div className="relative aspect-[3/4] w-full">
                                            <Image
                                                src={img.src}
                                                alt={img.alt}
                                                fill={true}
                                                className="object-cover rounded-lg"
                                                data-ai-hint={img.hint}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                priority={true}
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                     </CardContent>
                 </Card>
            )}

            <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    {!isSettingsInitialized || !settings ? (
                        <div className="flex flex-col items-center">
                            <Skeleton className="h-20 w-20 rounded-full mb-4" />
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-64 mt-2" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            {settings.logoUrl && (
                                <Image 
                                    src={settings.logoUrl} 
                                    alt="Logo" 
                                    width={80} 
                                    height={80} 
                                    className="rounded-full mb-4"
                                    data-ai-hint="logo"
                                />
                            )}
                            <CardTitle className="text-2xl text-center">
                                {`¡Bienvenido a ${settings.barName}!`}
                            </CardTitle>
                            <CardDescription className="text-center">
                                Ingresa tus datos para comenzar o revisa tus pedidos anteriores.
                            </CardDescription>
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="name">Nombre Completo</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Ej: Juan Pérez"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Número de Celular</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="Ej: 3001234567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2 pt-4">
                                <Button type="submit" className="w-full" disabled={!name || !phone}>
                                    Ver el Menú
                                </Button>
                                 <Button variant="outline" className="w-full" asChild>
                                    <Link href="/create-profile">
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Crear mi Perfil
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
