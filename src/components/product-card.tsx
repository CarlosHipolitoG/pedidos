'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/data';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="flex flex-col text-center">
      <CardHeader className="p-2">
        <div className="relative w-full h-32">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="contain"
            className="rounded-t-lg"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-2">
        <p className="text-xs text-muted-foreground">{product.name}</p>
        <p className="text-primary font-bold text-sm mt-1">
          ${product.price.toLocaleString('es-CO')}
        </p>
      </CardContent>
      <CardFooter className="p-2">
        <Button size="sm" className="w-full text-xs">
          <ShoppingCart className="mr-1 h-3 w-3" /> Agregar
        </Button>
      </CardFooter>
    </Card>
  );
}
