
'use client';

import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, X } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDemoNoticeVisible, setIsDemoNoticeVisible] = useState(true);

  return (
    <div>
      {isDemoNoticeVisible && (
        <Alert className="fixed top-0 left-0 right-0 z-50 m-2 sm:m-4 max-w-2xl mx-auto bg-card/90 backdrop-blur-sm">
          <Info className="h-4 w-4" />
          <AlertTitle>Aviso Importante</AlertTitle>
          <AlertDescription>
            Este aplicativo fue realizado a manera de demo y cuenta con un tiempo
            limite. Contacte a su Administrador para activar su cuenta.
          </AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => setIsDemoNoticeVisible(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </Alert>
      )}
      <div className={isDemoNoticeVisible ? 'pt-24' : ''}>
        {children}
      </div>
    </div>
  );
}
