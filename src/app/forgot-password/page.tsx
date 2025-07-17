
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MailQuestion } from 'lucide-react';
import { getUserFromStorage } from '@/lib/users';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [foundPassword, setFoundPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const user = getUserFromStorage(email);

    if (user) {
        if(user.temporaryPassword) {
            toast({
                title: "Contraseña Temporal",
                description: "Contacta a tu administrador para que te asigne una nueva contraseña.",
                variant: "destructive"
            });
        } else {
            setFoundPassword(user.password);
            setIsAlertOpen(true);
        }
    } else {
      setError('No se encontró ningún usuario con ese correo electrónico.');
    }
  };

  return (
    <>
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                <MailQuestion className="h-6 w-6"/>
                Recuperar Contraseña
            </CardTitle>
            <CardDescription className="text-center">
              Ingresa tu correo para recuperar tu contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={!email}>
                Recuperar Contraseña
              </Button>
              <Button variant="ghost" asChild className="w-full">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Inicio
                </Link>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>¡Contraseña Encontrada!</AlertDialogTitle>
              <AlertDialogDescription>
                  <p>Por motivos de esta demo, tu contraseña se muestra a continuación. En un sistema real, se enviaría un enlace de restablecimiento a tu correo.</p>
                  <p className="mt-4 text-center font-mono p-2 bg-muted rounded-md text-foreground">
                      {foundPassword}
                  </p>
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogAction onClick={() => setIsAlertOpen(false)}>Entendido</AlertDialogAction>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
