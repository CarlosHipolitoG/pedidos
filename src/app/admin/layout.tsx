
'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, X } from 'lucide-react';

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
    <div>
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
            size="icon"
            className="absolute top-1 right-1 h-6 w-6"
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
