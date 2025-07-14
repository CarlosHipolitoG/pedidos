
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Utensils } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ClientPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      // For now, we'll just log the data.
      // In the future, this would save the client info and navigate to the menu.
      console.log({ name, phone, email });
      // router.push('/client/menu'); // Example navigation
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex gap-4">
        <Link href="/waiter" passHref>
          <Button variant="ghost" size="icon" aria-label="Waiter Login">
            <Utensils className="h-6 w-6" />
          </Button>
        </Link>
        <Link href="/admin" passHref>
          <Button variant="ghost" size="icon" aria-label="Admin Login">
            <Shield className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">¡Bienvenido a HOLIDAYS FRIENDS!</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus datos para comenzar
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
              Ingresar al Menú
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
