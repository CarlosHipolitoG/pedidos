
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Utensils, User, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/lib/settings';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { settings, isInitialized } = useSettings();
  const router = useRouter();
  const [emblaApi, setEmblaApi] = useState<CarouselApi | undefined>(undefined);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  useEffect(() => {
    localStorage.removeItem('activeOrderId'); // Clear any previous order
  }, []);

  useEffect(() => {
    if (emblaApi && settings?.promotionalImages) {
        emblaApi.reInit();
        if (settings.promotionalImages.length > 0) {
            autoplayPlugin.current.play();
        }
    }
  }, [emblaApi, settings?.promotionalImages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    localStorage.setItem('customerName', name);
    localStorage.setItem('customerPhone', phone);
    router.push('/menu');
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

        <div className="z-10 relative flex flex-col items-center justify-center gap-6 w-full max-w-md">
            {isInitialized && settings && settings.promotionalImages.length > 0 && (
                 <Card className="w-full bg-card/80 backdrop-blur-sm shadow-xl">
                     <CardContent className="p-0">
                         <Carousel
                            setApi={setEmblaApi}
                            plugins={[autoplayPlugin.current]}
                            className="w-full"
                            onMouseEnter={() => autoplayPlugin.current.stop()}
                            onMouseLeave={() => autoplayPlugin.current.play()}
                        >
                            <CarouselContent>
                                {settings.promotionalImages.map((img) => (
                                    <CarouselItem key={img.id}>
                                        <div className="relative aspect-video w-full">
                                            <Image
                                                src={img.src || ''}
                                                alt={img.alt || 'Promotional Image'}
                                                fill={true}
                                                className="object-cover rounded-lg"
                                                data-ai-hint={img.hint || ''}
                                                sizes="(max-width: 768px) 100vw, 33vw"
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

            <Card className="w-full bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex flex-col items-center gap-4">
                        {isInitialized && settings?.logoUrl && (
                           <img src={settings.logoUrl} alt="Logo" className="h-24 w-auto" crossOrigin="anonymous" />
                        )}
                        <CardTitle className="text-2xl text-center">
                            {isInitialized && settings ? `¡Bienvenido a ${settings.barName || 'HOLIDAYS FRIENDS'}!` : <Skeleton className="h-8 w-48" />}
                        </CardTitle>
                        <CardDescription className="text-center">
                             {isInitialized ? 'Para una mejor experiencia, regístrate o ingresa.' : <Skeleton className="h-4 w-64 mt-2" />}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Tu nombre"
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
                                    placeholder="Tu número de celular"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2 pt-4">
                                <Button type="submit" className="w-full" disabled={!name || !phone || !isInitialized}>
                                    Ver el Menú
                                </Button>
                                 <Button variant="outline" className="w-full" asChild>
                                    <Link href="/create-profile">
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Crear mi Perfil
                                    </Link>
                                </Button>
                                <Button variant="secondary" className="w-full" asChild>
                                    <Link href="/my-orders">
                                        Revisar mis Pedidos
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
