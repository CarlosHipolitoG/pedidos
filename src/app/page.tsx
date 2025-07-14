'use client';

import { useState } from 'react';
import { productsByCategory, menuItems } from '@/lib/data';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('aguardiente');

  const products = productsByCategory[selectedCategory] || [];
  const categoryInfo = menuItems.find(item => item.slug === selectedCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Columna Izquierda y Central para contenido principal */}
      <div className="lg:col-span-2">
        <div className="bg-white p-4 rounded-lg shadow-md">
          {/* Categoría y Productos */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary">{categoryInfo?.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
          
          {/* Lista de Categorías */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2 text-primary">Categorías</h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.slug}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left ${selectedCategory === item.slug ? 'bg-accent text-accent-foreground' : ''}`}
                    onClick={() => setSelectedCategory(item.slug)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Columna Derecha para el Carrito */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="mr-2" />
              Carrito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              El carrito está vacío
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
