
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, User, Utensils } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { validateUser } from '@/lib/users';

export default function WaiterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = validateUser(email, password, 'waiter');

    if (result.success) {
      localStorage.setItem('userName', result.user!.name);
      localStorage.setItem('userEmail', result.user!.email);

      if (result.isTemporaryPassword) {
        toast({
          title: 'Contraseña Temporal',
          description: 'Por favor, actualiza tu contraseña para continuar.',
        });
        router.push('/change-password');
      } else {
        router.push('/waiter/dashboard');
      }
    } else {
      setError(result.message);
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
          <CardTitle className="text-2xl text-center">Acceso de Meseros</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="mesero@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={!email || !password}>
              Iniciar Sesión
            </Button>
             <Button variant="link" className="w-full" asChild>
                <Link href="/forgot-password">¿Olvidaste tu contraseña?</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
