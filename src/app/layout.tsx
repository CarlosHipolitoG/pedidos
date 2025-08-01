
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isInitialized: isAppInitialized } = useAppStore();
  const { settings, isInitialized: isSettingsInitialized } = useSettings();
  const [isMounted, setIsMounted] = useState(false);
  const isInitialized = isAppInitialized && isSettingsInitialized;

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isInitialized && settings) {
      document.title = settings.barName || 'HOLIDAYS FRIENDS';
      
      const body = document.body;
      if (settings.backgroundUrl) {
          body.style.setProperty('--dynamic-background-image', `url('${settings.backgroundUrl}')`);
      } else {
          // Fallback al predeterminado si no se establece ninguna URL
          body.style.setProperty('--dynamic-background-image', `url('https://storage.googleapis.com/project-spark-b6b15e45/dc407172-5953-4565-a83a-48a58ca7694f.png')`);
      }
    }
  }, [settings, isInitialized]);

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
