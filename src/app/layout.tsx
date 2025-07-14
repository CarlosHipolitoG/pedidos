import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ShoppingCart } from "lucide-react";
import Link from 'next/link';
import { menuItems } from '@/lib/data';

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
        <SidebarProvider>
          <div className="min-h-screen bg-gray-100 relative">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage:
                  'url(https://www.toptal.com/designers/subtlepatterns/uploads/double-bubble-outline.png)',
              }}
              data-ai-hint="background texture"
            ></div>
              <header className="p-4 border-b flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-20 md:hidden">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <h1 className="text-xl font-semibold text-primary">Holidays Friends</h1>
                  </div>
              </header>
            <div className="grid grid-cols-1 md:grid-cols-4 max-w-7xl mx-auto">
                <aside className="md:col-span-1 p-4">
                     <div className="p-4 bg-white rounded-lg shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                           <h1 className="text-xl font-semibold text-primary">Holidays Friends</h1>
                        </div>
                        <nav className="mb-4">
                            <Link href="/" passHref>
                               <Button variant="link">INICIO</Button>
                            </Link>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline">
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  Carrito
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <p>El carrito está vacío</p>
                              </PopoverContent>
                            </Popover>
                        </nav>
                        <h2 className="text-lg font-semibold mb-4 text-primary">Categorías</h2>
                        <ul>
                            {menuItems.map((item) => (
                                <li key={item.slug}>
                                    <Link href={`/products/${item.slug}`} passHref legacyBehavior>
                                      <a className="w-full">
                                        <Button
                                            variant="ghost"
                                            className={`w-full justify-start text-left mb-1`}
                                        >
                                            {item.icon}
                                            <span className="ml-2">{item.name}</span>
                                        </Button>
                                      </a>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
                <main className="md:col-span-3 p-4">
                  {children}
                </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
