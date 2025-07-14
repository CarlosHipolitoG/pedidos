import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

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
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6 relative">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                'url(https://www.toptal.com/designers/subtlepatterns/uploads/double-bubble-outline.png)',
            }}
            data-ai-hint="background texture"
          ></div>
          
          <div className="relative z-10 w-full max-w-6xl mx-auto">
            <header className="text-center mb-6">
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
            
            <main className="w-full">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
