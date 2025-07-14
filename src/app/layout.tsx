import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import {
  Package,
  ShoppingCart,
  GlassWater,
  Beer,
  Wine,
  Sparkles,
  Cookie,
  Beef,
  Droplets,
  Container,
  Stethoscope,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Image from 'next/image';
import Link from 'next/link';
import { menuItems } from "@/lib/data";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Holidays Friends",
  description: "Tu tienda de confianza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-200">
          <aside className="w-64 bg-white p-6 shadow-md flex flex-col">
            <h2 className="mb-4 text-2xl font-bold text-center text-primary">Menú</h2>
            <nav className="flex-1">
              <ul>
                {menuItems.map((item) => (
                  <li key={item.name} className="mb-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left"
                      asChild
                    >
                      <Link href={`/products/${item.slug}`}>
                        {item.icon}
                        <span className="ml-2">{item.name}</span>
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className="flex-1 flex flex-col items-center p-6 relative">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage:
                  'url(https://placehold.co/1200x800/e2e8f0/e2e8f0)',
              }}
              data-ai-hint="background texture"
            ></div>

            <div className="relative z-10 flex flex-col items-center w-full h-full">
              <header className="text-center">
                <div className="flex justify-center mb-4">
                  <Image
                    src="https://placehold.co/150x150/ffffff/000000.png?text=Holidays+Friends"
                    alt="Holidays Friends Logo"
                    width={150}
                    height={150}
                    data-ai-hint="bear logo"
                    className="rounded-full border-4 border-primary shadow-lg"
                  />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                  Bienvenidos a Holidays Friends
                </h1>
                <nav className="mt-4">
                  <Link href="/" passHref>
                    <Button variant="link" className="text-lg">
                      INICIO
                    </Button>
                  </Link>
                </nav>
              </header>

              <div className="w-full flex justify-end my-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <ShoppingCart className="mr-2" />
                      Carrito
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Carrito</h4>
                        <p className="text-sm text-muted-foreground">
                          El carrito está vacío
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-1 w-full overflow-y-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
