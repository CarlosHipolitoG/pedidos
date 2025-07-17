
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
import { useSettings } from '@/lib/settings';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { cn } from '@/lib/utils';


export default function HomePage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hasPreviousOrders, setHasPreviousOrders] = useState(false);
  const { settings } = useSettings();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const promotionalImages = [
      { src: "https://placehold.co/1000x500.png", alt: "Promoción 1", hint: "promotion event" },
      { src: "https://placehold.co/1000x500.png", alt: "Promoción 2", hint: "special offer" },
      { src: "https://placehold.co/1000x500.png", alt: "Promoción 3", hint: "discount party" },
      { src: "https://placehold.co/1000x500.png", alt: "Promoción 4", hint: "happy hour" },
  ]

  useEffect(() => {
    setIsMounted(true);
    const storedPhone = localStorage.getItem('customerPhone');
    if (storedPhone) {
      setHasPreviousOrders(true);
    }
  }, []);

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

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
        {isBannerVisible && (
             <div className="absolute inset-x-0 top-10 z-20 px-4 flex justify-center">
                 <div className="relative w-full max-w-4xl">
                    <Carousel
                        plugins={[autoplayPlugin.current]}
                        className="w-full"
                        onMouseEnter={() => autoplayPlugin.current.stop()}
                        onMouseLeave={() => autoplayPlugin.current.play()}
                    >
                        <CarouselContent>
                            {promotionalImages.map((img, index) => (
                                <CarouselItem key={index}>
                                     <Card className="overflow-hidden">
                                        <CardContent className="p-0">
                                            <Image
                                                src={img.src}
                                                alt={img.alt}
                                                width={1000}
                                                height={500}
                                                className="aspect-[2/1] md:aspect-video object-cover"
                                                data-ai-hint={img.hint}
                                            />
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 hover:text-white rounded-full h-8 w-8 z-30"
                        onClick={() => setIsBannerVisible(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                 </div>
             </div>
        )}

        <div className={cn(
            "absolute top-4 right-4 flex gap-4",
            isBannerVisible ? 'z-30' : 'z-10'
        )}>
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
                <CardHeader className="items-center">
                    {isMounted && settings.logoUrl && (
                        <Image 
                            src={settings.logoUrl} 
                            alt="Logo" 
                            width={80} 
                            height={80} 
                            className="rounded-full mb-4"
                            data-ai-hint="logo"
                        />
                    )}
                    <CardTitle className="text-2xl text-center">¡Bienvenido a {isMounted ? settings.barName : '...'}!</CardTitle>
                    <CardDescription className="text-center">
                        Ingresa tus datos para comenzar o revisa tus pedidos anteriores.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                        <Button type="submit" className="w-full" disabled={!name || !phone}>
                            Crear Nuevo Pedido
                        </Button>
                        {isMounted && hasPreviousOrders && (
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push('/my-orders')}
                            >
                                <History className="mr-2 h-4 w-4" />
                                Ver mis Pedidos Anteriores
                            </Button>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
