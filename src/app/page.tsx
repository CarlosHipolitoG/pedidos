
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Utensils, History } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/lib/settings';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export default function HomePage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hasPreviousOrders, setHasPreviousOrders] = useState(false);
  const { settings } = useSettings();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isBannerOpen, setIsBannerOpen] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    // Check if there is any customer data in localStorage to infer previous activity
    const storedPhone = localStorage.getItem('customerPhone');
    if (storedPhone) {
      setHasPreviousOrders(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      // For this simulation, we'll use localStorage.
      localStorage.setItem('customerName', name);
      localStorage.setItem('customerPhone', phone);
      localStorage.setItem('customerEmail', email);

      // A new customer might have an old active order ID, clear it.
      localStorage.removeItem('activeOrderId');

      console.log({ name, phone, email });
      router.push('/menu'); // Navigate to the menu
    }
  };

  return (
    <>
      <Dialog open={isBannerOpen} onOpenChange={setIsBannerOpen}>
        <DialogContent className="sm:max-w-[625px] p-0 border-0">
           <DialogTitle className="sr-only">Promoción</DialogTitle>
          <Image
            src="https://placehold.co/600x800.png"
            alt="Promotional Banner"
            width={600}
            height={800}
            className="rounded-lg object-cover"
            data-ai-hint="promotion event"
          />
        </DialogContent>
      </Dialog>
      
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="absolute top-4 right-4 flex gap-4">
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
    </>
  );
}
