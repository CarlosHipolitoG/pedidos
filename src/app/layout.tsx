
'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { useSettings } from "@/lib/settings";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Loader2 } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

// No podemos usar la exportación de metadatos regular porque necesitamos obtener la configuración dinámicamente.
// Este es un componente de cliente, por lo que estableceremos el título y el fondo en un hook useEffect.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isInitialized } = useAppStore();
  const { settings, isInitialized: isSettingsInitialized } = useSettings();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isSettingsInitialized && settings) {
      document.title = settings.barName || 'Holidays Friends';
      
      const body = document.body;
      if (settings.backgroundUrl) {
          body.style.setProperty('--dynamic-background-image', `url('${settings.backgroundUrl}')`);
      } else {
          // Fallback al predeterminado si no se establece ninguna URL
          body.style.setProperty('--dynamic-background-image', `url('https://storage.googleapis.com/project-spark-b6b15e45/dc407172-5953-4565-a83a-48a58ca7694f.png')`);
      }
    }
  }, [settings, isSettingsInitialized]);

  return (
    <html lang="en">
      <body className={inter.className}>
        {!isInitialized && isMounted ? (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Cargando datos...</p>
            </div>
          </div>
        ) : (
          children
        )}
        <Toaster />
      </body>
    </html>
  );
}
