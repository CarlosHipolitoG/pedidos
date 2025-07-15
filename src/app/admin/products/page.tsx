
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts, Product, addProduct, updateProduct, deleteProduct } from '@/lib/products';
import { ArrowLeft, CheckCircle, XCircle, PlusCircle, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminProductsPage() {
  const { products } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | Partial<Product> | null>(null);

  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct({ ...product });
    } else {
      setEditingProduct({
        nombre: '',
        precio: 0,
        existencias: 0,
        disponibilidad: 'PRODUCTO_DISPONIBLE',
        categoria: '',
        imagen: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;

    let productToSave = { ...editingProduct };

    // If availability is set to available but stock is 0, set stock to 1
    if (productToSave.disponibilidad === 'PRODUCTO_DISPONIBLE' && productToSave.existencias === 0) {
        productToSave.existencias = 1;
    }

    if ('id' in productToSave && productToSave.id) {
      // Editing existing product
      updateProduct(productToSave.id, productToSave as Product);
    } else {
      // Adding new product
      addProduct(productToSave as Omit<Product, 'id'>);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: number) => {
    deleteProduct(productId);
  };

  const handleInputChange = (field: keyof Product, value: string | number) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [field]: value });
    }
  };

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
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle>Gestión de Productos</CardTitle>
                <CardDescription>
                    Visualiza, edita y agrega nuevos productos al menú.
                </CardDescription>
            </div>
            <Button onClick={() => openModal()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Agregar Nuevo Producto
            </Button>
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
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image
                      src={product.imagen || 'https://placehold.co/40x40.png'}
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
                  <TableCell className="text-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => openModal(product)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro de que deseas eliminar este producto?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el producto de tu menú.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{editingProduct && 'id' in editingProduct && editingProduct.id ? 'Editar Producto' : 'Agregar Nuevo Producto'}</DialogTitle>
                <DialogDescription>
                    {editingProduct && 'id' in editingProduct && editingProduct.id ? 'Modifica los detalles del producto.' : 'Completa la información para agregar un nuevo producto al menú.'}
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input id="nombre" value={editingProduct?.nombre || ''} onChange={(e) => handleInputChange('nombre', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="precio">Precio</Label>
                    <Input id="precio" type="number" value={editingProduct?.precio || 0} onChange={(e) => handleInputChange('precio', parseFloat(e.target.value))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="existencias">Existencias</Label>
                    <Input id="existencias" type="number" value={editingProduct?.existencias || 0} onChange={(e) => handleInputChange('existencias', parseInt(e.target.value, 10))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="disponibilidad">Disponibilidad</Label>
                     <Select value={editingProduct?.disponibilidad} onValueChange={(value) => handleInputChange('disponibilidad', value)}>
                        <SelectTrigger id="disponibilidad">
                            <SelectValue placeholder="Seleccionar disponibilidad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PRODUCTO_DISPONIBLE">Disponible</SelectItem>
                            <SelectItem value="PRODUCTO_AGOTADO">Agotado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría</Label>
                    <Input id="categoria" value={editingProduct?.categoria || ''} onChange={(e) => handleInputChange('categoria', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="imagen">URL de la Imagen</Label>
                    <Input id="imagen" value={editingProduct?.imagen || ''} onChange={(e) => handleInputChange('imagen', e.target.value)} />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveProduct}>Guardar Cambios</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
