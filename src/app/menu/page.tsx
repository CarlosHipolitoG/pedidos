'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockProducts } from '@/lib/products';
import { ShoppingCart, Search } from 'lucide-react';

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const filteredProducts = mockProducts.filter((product) =>
    product.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-center">Nuestro Menú</h1>
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar productos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button size="lg" className="relative">
          <ShoppingCart className="mr-2 h-6 w-6" />
          Ver Carrito
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            0
          </span>
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="flex flex-col overflow-hidden group">
            <CardHeader className="p-0 relative">
              <Image
                src={product.imagen || 'https://placehold.co/600x400.png'}
                alt={product.nombre}
                width={600}
                height={400}
                className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="beverage drink"
              />
               {product.disponibilidad === 'PRODUCTO_AGOTADO' && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AGOTADO</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-grow p-4 flex flex-col">
              <CardTitle className="text-lg mb-2 flex-grow">{product.nombre}</CardTitle>
              <p className="text-xl font-semibold text-primary">
                ${product.precio.toLocaleString('es-CO')}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full"
                disabled={product.disponibilidad === 'PRODUCTO_AGOTADO'}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Agregar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
