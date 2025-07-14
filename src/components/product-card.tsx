'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/data';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="relative w-full h-48">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
        <p className="text-primary font-bold text-xl mt-2">
          ${product.price.toLocaleString('es-CO')}
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <ShoppingCart className="mr-2 h-4 w-4" /> Agregar al Carrito
        </Button>
      </CardFooter>
    </Card>
  );
}
