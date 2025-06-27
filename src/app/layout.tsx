import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Sparkles, ClipboardList } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Always Events',
  description: 'Descubre y muestra eventos increíbles.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <header className="bg-card shadow-md sticky top-0 z-50">
          <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="text-3xl font-headline text-primary hover:text-primary/80 transition-colors">
              Always Events
            </Link>
            <div className="space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/" className="flex items-center">
                  <Home className="mr-2 h-5 w-5" /> Eventos
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/quote" className="flex items-center">
                  <ClipboardList className="mr-2 h-5 w-5" /> Cotizar
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/generate-description" className="flex items-center text-accent hover:text-accent/90">
                  <Sparkles className="mr-2 h-5 w-5" /> Generador IA
                </Link>
              </Button>
            </div>
          </nav>
        </header>
        <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
        <Toaster />
        <footer className="bg-card text-center py-6 mt-auto border-t">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Always Events. Todos los derechos reservados.</p>
        </footer>
      </body>
    </html>
  );
}
