
'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { useSettings, Settings } from "@/lib/settings";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

// We can't use the regular metadata export because we need to fetch settings dynamically.
// This is a client component, so we'll set the title and background in a useEffect hook.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { settings } = useSettings();
  const [isMounted, setIsMounted] = useState(false);
  const [isDemoNoticeVisible, setIsDemoNoticeVisible] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && settings) {
      document.title = settings.barName || 'Holidays Friends';
      
      const body = document.body;
      if (settings.backgroundUrl) {
          body.style.setProperty('--dynamic-background-image', `url('${settings.backgroundUrl}')`);
      } else {
          // Fallback to default if no URL is set
          body.style.setProperty('--dynamic-background-image', `url('https://storage.googleapis.com/project-spark-b6b15e45/dc407172-5953-4565-a83a-48a58ca7694f.png')`);
      }
    }
  }, [settings, isMounted]);

  return (
    <html lang="en">
      <body className={inter.className}>
        {isDemoNoticeVisible && (
           <Alert className="fixed top-0 left-0 right-0 z-50 m-2 sm:m-4 max-w-2xl mx-auto bg-card/90 backdrop-blur-sm">
             <Info className="h-4 w-4" />
             <AlertTitle>Aviso Importante</AlertTitle>
             <AlertDescription>
                Este aplicativo fue realizado a manera de demo y cuenta con un tiempo limite. Contacte a su Administrador para activar su cuenta.
             </AlertDescription>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => setIsDemoNoticeVisible(false)}
              >
                <X className="h-4 w-4"/>
                <span className="sr-only">Cerrar</span>
              </Button>
           </Alert>
        )}
        <div className={isDemoNoticeVisible ? 'pt-24' : ''}>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
