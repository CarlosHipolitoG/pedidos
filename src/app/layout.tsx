import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ShoppingCart } from "lucide-react";
import Link from 'next/link';

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
            <Sidebar>
            </Sidebar>
            <div className="relative z-10">
              <SidebarInset>
                <header className="p-4 border-b flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-20">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <h1 className="text-xl font-semibold text-primary">Holidays Friends</h1>
                  </div>
                  <nav>
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
                </header>
                <main className="p-4 sm:p-6">
                  {children}
                </main>
              </SidebarInset>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
