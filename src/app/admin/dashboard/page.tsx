'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useOrders, Order, OrderStatus, updateOrderStatus, addProductToOrder, OrderItem } from '@/lib/orders';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { mockProducts, Product } from '@/lib/products';
import Image from 'next/image';
import { useDebounce } from 'use-debounce';


export default function AdminDashboardPage() {
  const { orders } = useOrders();
  const [highlightedProducts, setHighlightedProducts] = useState<Record<string, number[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(productSearchTerm, 300);

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };
  
  const openAddProductModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setProductSearchTerm('');
  };

  const handleAddProduct = (product: Product) => {
    if (!selectedOrder) return;

    const newProduct: OrderItem = {
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      quantity: 1,
    };
    addProductToOrder(selectedOrder.id, newProduct);

    setHighlightedProducts(prev => ({
      ...prev,
      [selectedOrder.id]: [...(prev[selectedOrder.id] || []), newProduct.id]
    }));
    
    setIsModalOpen(false);

    setTimeout(() => {
        setHighlightedProducts(prev => ({
            ...prev,
            [selectedOrder.id]: (prev[selectedOrder.id] || []).filter(id => id !== newProduct.id)
        }));
    }, 2000); // Highlight for 2 seconds
  };

  const filteredProducts = mockProducts.filter((product) =>
    product.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'Pendiente':
        return 'destructive';
      case 'En Preparación':
        return 'secondary';
      case 'Completado':
        return 'default';
      default:
        return 'outline';
    }
  };


  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Panel de Administrador</h1>
        <p className="text-muted-foreground">Aquí puedes ver y gestionar los pedidos entrantes.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recibidos ({orders.length})</CardTitle>
          <CardDescription>Los pedidos más recientes aparecen primero.</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <Accordion type="single" collapsible className="w-full" defaultValue={orders.length > 0 ? "item-0" : undefined}>
              {orders.map((order, index) => (
                <AccordionItem 
                  key={order.id} 
                  value={`item-${index}`} 
                  className="border-border rounded-lg mb-2 bg-card"
                >
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex justify-between items-center w-full">
                      <div className="text-left">
                        <span className="font-bold text-lg">Pedido #{order.id}</span>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.timestamp), "d 'de' LLLL, h:mm a", { locale: es })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                         <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                         <span className="font-semibold text-lg">
                           ${order.total.toLocaleString('es-CO')}
                         </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                     <div className="mb-4">
                        <p className="font-semibold mb-1">
                            Atendido por: <span className="font-normal">{order.orderedBy.type} ({order.orderedBy.name})</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <strong>Cliente:</strong> {order.customer.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <strong>Celular:</strong> {order.customer.phone}
                        </p>
                     </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead className="text-center">Cant.</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item) => (
                                <TableRow key={item.id} className={cn(highlightedProducts[order.id]?.includes(item.id) && 'animate-highlight')}>
                                    <TableCell>{item.nombre}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">${(item.precio * item.quantity).toLocaleString('es-CO')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                             <span className="text-sm font-medium">Cambiar Estado:</span>
                             <Select
                                value={order.status}
                                onValueChange={(value: OrderStatus) => handleStatusChange(order.id, value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Cambiar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                                    <SelectItem value="En Preparación">En Preparación</SelectItem>
                                    <SelectItem value="Completado">Completado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                         <Button variant="outline" size="sm" onClick={() => openAddProductModal(order)}>
                            <PlusCircle className="mr-2 h-4 w-4"/>
                            Adicionar Producto
                        </Button>
                    </div>

                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Aún no se han recibido pedidos.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>Añadir Producto al Pedido #{selectedOrder?.id}</DialogTitle>
                <DialogDescription>
                    Busca y selecciona un producto para añadir al pedido.
                </DialogDescription>
            </DialogHeader>
             <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-10"
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-grow overflow-y-auto -mx-6 px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.map(product => (
                        <Card key={product.id}>
                            <CardContent className="p-4 flex flex-col gap-2">
                                <Image 
                                    src={product.imagen || 'https://placehold.co/100x100.png'}
                                    alt={product.nombre}
                                    width={100}
                                    height={100}
                                    className="rounded-md object-cover w-full h-24"
                                    data-ai-hint="beverage drink"
                                />
                                <h3 className="font-semibold h-10">{product.nombre}</h3>
                                <p className="text-sm text-muted-foreground">${product.precio.toLocaleString('es-CO')}</p>
                                <Button 
                                    size="sm" 
                                    onClick={() => handleAddProduct(product)}
                                    disabled={product.disponibilidad === 'PRODUCTO_AGOTADO'}
                                >
                                    {product.disponibilidad === 'PRODUCTO_AGOTADO' ? 'Agotado' : 'Agregar'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
