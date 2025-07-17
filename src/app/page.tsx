
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Utensils, History, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSettings, PromotionalImage } from '@/lib/settings';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';


export default function HomePage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hasPreviousOrders, setHasPreviousOrders] = useState(false);
  const { settings } = useSettings();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [emblaApi, setEmblaApi] = useState<CarouselApi | undefined>(undefined);
  const [promotionalImages, setPromotionalImages] = useState<PromotionalImage[]>([]);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  useEffect(() => {
    setIsMounted(true);
    const storedPhone = localStorage.getItem('customerPhone');
    if (storedPhone) {
      setHasPreviousOrders(true);
    }
    if (settings?.promotionalImages) {
        setPromotionalImages(settings.promotionalImages);
    }
  }, [settings]);

  useEffect(() => {
    if (isBannerVisible && emblaApi) {
        emblaApi.reInit();
        autoplayPlugin.current.play();
    }
  }, [isBannerVisible, emblaApi, promotionalImages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      localStorage.setItem('customerName', name);
      localStorage.setItem('customerPhone', phone);
      localStorage.setItem('customerEmail', email);
      localStorage.removeItem('activeOrderId');
      router.push('/menu');
    }
  };
  
  const handleCloseBanner = () => {
    setIsBannerVisible(false);
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
        {isBannerVisible && promotionalImages.length > 0 && (
             <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                 <div className="relative w-full max-w-4xl">
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
                                     <Card className="overflow-hidden bg-transparent border-none">
                                        <CardContent className="relative p-0 aspect-square flex items-center justify-center max-h-[80vh]">
                                            <Image
                                                src={img.src}
                                                alt={img.alt}
                                                fill={true}
                                                className="object-contain"
                                                data-ai-hint={img.hint}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                priority={true}
                                            />
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                 </div>
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 hover:text-white rounded-full h-8 w-8 z-30"
                    onClick={handleCloseBanner}
                >
                    <X className="h-5 w-5" />
                </Button>
             </div>
        )}

        <div className={cn("absolute top-4 right-4 flex gap-4 z-20")}>
            <Link href="/waiter" passHref>
                <Button variant="ghost" size="icon" aria-label="Waiter Login">
                    <Utensils className="h-6 w-6 text-foreground" />
                </Button>
            </Link>
            <Link href="/admin" passHref>
                <Button variant="ghost" size="icon" aria-label="Admin Login">
                    <Shield className="h-6 w-6 text-foreground" />
                </Button>
            </Link>
        </div>

        <div className="z-10 relative mt-4">
            <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex flex-col items-center">
                        {!isMounted ? (
                            <Skeleton className="h-20 w-20 rounded-full mb-4" />
                        ) : (
                            settings.logoUrl && (
                                <Image 
                                    src={settings.logoUrl} 
                                    alt="Logo" 
                                    width={80} 
                                    height={80} 
                                    className="rounded-full mb-4"
                                    data-ai-hint="logo"
                                />
                            )
                        )}
                        <CardTitle className="text-2xl text-center">
                            {!isMounted ? (
                               <Skeleton className="h-8 w-48" />
                            ) : (
                                `¡Bienvenido a ${settings.barName}!`
                            )}
                        </CardTitle>
                        <CardDescription className="text-center">
                            Ingresa tus datos para comenzar o revisa tus pedidos anteriores.
                        </CardDescription>
                    </div>
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
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico (Opcional)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Para recibir tu factura"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 pt-4">
                                <Button type="submit" className="w-full" disabled={!name || !phone}>
                                    Crear Nuevo Pedido
                                </Button>
                                {isMounted && hasPreviousOrders && (
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        asChild
                                    >
                                        <Link href="/my-orders">
                                            <History className="mr-2 h-4 w-4" />
                                            Ver mis Pedidos Anteriores
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
