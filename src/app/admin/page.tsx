
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Shield, Utensils, User, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { validateUser } from '@/lib/users';
import { useAppStore } from '@/lib/store';


export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { isInitialized } = useAppStore();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isInitialized) return;

    const validation = validateUser(email, password, 'admin');

    if (validation.success) {
      toast({
        title: 'Inicio de Sesión Exitoso',
        description: `Bienvenido de nuevo, ${validation.user.name}.`,
      });
      localStorage.setItem('userName', validation.user.name);
      localStorage.setItem('userEmail', validation.user.email);
      
      if (validation.isTemporaryPassword) {
        router.push('/change-password');
      } else {
        router.push('/admin/dashboard');
      }

    } else {
      toast({
        title: 'Error de Autenticación',
        description: validation.message,
        variant: 'destructive',
      });
    }
  };

  return (
     <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
       <div className="absolute top-4 right-4 flex gap-2">
          <Link href="/" passHref>
            <Button variant="ghost" size="icon" aria-label="Client Login">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/waiter" passHref>
            <Button variant="ghost" size="icon" aria-label="Waiter Login">
              <Utensils className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/admin" passHref>
            <Button variant="ghost" size="icon" aria-label="Admin Login">
              <Shield className="h-5 w-5" />
            </Button>
          </Link>
      </div>

      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Shield className="h-6 w-6"/>
            Acceso de Administrador
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para gestionar el sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full">
               <LogIn className="mr-2 h-4 w-4" />
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
            <Link href="/forgot-password" passHref>
                <p className="w-full hover:underline cursor-pointer">¿Olvidaste tu contraseña?</p>
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
