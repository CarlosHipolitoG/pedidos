
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addUser, getUserFromStorage } from '@/lib/users';
import { useAppStore } from '@/lib/store';

export default function CreateProfilePage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const { isInitialized } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !isInitialized) return;

    const existingUser = getUserFromStorage(email);
    if (existingUser) {
        toast({
            title: "Error de Registro",
            description: "Ya existe un usuario con este correo electrónico.",
            variant: "destructive",
        });
        return;
    }

    addUser({
        name,
        phone,
        email,
        role: 'client'
    });

    toast({
        title: "¡Perfil Creado!",
        description: `Bienvenido, ${name}. Ahora serás dirigido al menú.`,
    });

    // Log the user in and redirect
    localStorage.setItem('customerName', name);
    localStorage.setItem('customerPhone', phone);
    localStorage.setItem('customerEmail', email);
    localStorage.removeItem('activeOrderId');
    router.push('/menu');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <Button variant="ghost" asChild className="absolute top-4 left-4">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Inicio
            </Link>
        </Button>
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <UserPlus className="h-6 w-6" />
            Crear tu Perfil
          </CardTitle>
          <CardDescription className="text-center">
            Completa tus datos para registrarte y disfrutar de una experiencia completa.
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
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <Button type="submit" className="w-full" disabled={!name || !phone || !email || !isInitialized}>
              Crear Perfil y Ver Menú
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
