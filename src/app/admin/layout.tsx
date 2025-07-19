
'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, X, User, Utensils, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDemoNoticeVisible, setIsDemoNoticeVisible] = useState(false);

  useEffect(() => {
    // Only show the notice on the client-side after mounting
    // to prevent hydration errors.
    setIsDemoNoticeVisible(true);
  }, []);


  return (
    <div className="relative">
       <div className="absolute top-4 right-4 flex gap-2 z-30">
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

      {isDemoNoticeVisible && (
        <Alert className="fixed bottom-4 right-4 z-50 w-full max-w-sm bg-card/90 backdrop-blur-sm p-3 text-muted-foreground">
          <Info className="h-4 w-4" />
          <AlertTitle className="text-sm font-semibold text-foreground">Aviso Importante</AlertTitle>
          <AlertDescription className="text-xs">
            Este aplicativo fue realizado a manera de demo y cuenta con un tiempo
            limite. Contacte a su Administrador para activar su cuenta.
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-auto w-auto p-1"
            onClick={() => setIsDemoNoticeVisible(false)}
          >
            <X className="h-4 w-4 font-bold" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </Alert>
      )}
      <div>
        {children}
      </div>
    </div>
  );
}
