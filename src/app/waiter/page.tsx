'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WaiterPage() {
  const [name, setName] = useState('');
  const [cedula, setCedula] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && cedula) {
      // For now, we'll just log the data.
      // In the future, this would authenticate the waiter and navigate to their panel.
      console.log({ name, cedula });
      // router.push('/waiter/orders'); // Example navigation
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex gap-4">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" aria-label="Client Login">
            <User className="h-6 w-6" />
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
          <CardTitle className="text-2xl text-center">Acceso de Meseros</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ej: Ana López"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                type="text"
                placeholder="Ej: 1234567890"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={!name || !cedula}>
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
