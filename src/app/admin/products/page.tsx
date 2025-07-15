
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockProducts } from '@/lib/products';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


export default function AdminProductsPage() {
  const products = mockProducts;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Button variant="ghost" asChild>
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel Principal
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Productos</CardTitle>
          <CardDescription>
            Visualiza y gestiona todos los productos del menú.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-center">Existencias</TableHead>
                <TableHead className="text-center">Disponibilidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image
                      src={product.imagen}
                      alt={product.nombre}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                      data-ai-hint="beverage drink"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.nombre}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.categoria}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ${product.precio.toLocaleString('es-CO')}
                  </TableCell>
                  <TableCell className="text-center">{product.existencias}</TableCell>
                  <TableCell className="text-center">
                    {product.disponibilidad === 'PRODUCTO_DISPONIBLE' ? (
                        <div className="flex items-center justify-center text-green-600">
                             <CheckCircle className="h-5 w-5" />
                        </div>
                    ) : (
                       <div className="flex items-center justify-center text-red-600">
                             <XCircle className="h-5 w-5" />
                        </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
