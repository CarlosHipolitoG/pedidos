
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { updateUserPassword, getUserFromStorage, User } from '@/lib/users';

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<User['role'] | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      router.push('/');
      return;
    }
    const user = getUserFromStorage(email);
    if (user) {
        setUserEmail(user.email);
        setUserRole(user.role);
    } else {
         router.push('/');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    
    const success = updateUserPassword(userEmail, newPassword);

    if (success) {
      toast({
        title: 'Contraseña Actualizada',
        description: 'Tu contraseña ha sido cambiada exitosamente. Por favor, inicia sesión de nuevo.',
      });
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      
      if(userRole === 'admin') {
          router.push('/admin');
      } else {
          router.push('/waiter');
      }

    } else {
      setError('No se pudo actualizar la contraseña. Usuario no encontrado.');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <KeyRound className="h-6 w-6" />
            Cambiar Contraseña
          </CardTitle>
          <CardDescription className="text-center">
            Por seguridad, debes establecer una nueva contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={!newPassword || !confirmPassword}>
                <LogIn className="mr-2 h-4 w-4" />
                Guardar y Continuar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
