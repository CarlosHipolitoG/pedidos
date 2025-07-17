
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Order, useOrders, getOrdersByWaiterName, addProductToOrder, OrderItem } from '@/lib/orders';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, DollarSign, PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useProducts, Product } from '@/lib/products';
import Image from 'next/image';
import { useDebounce } from 'use-debounce';

export default function WaiterMyOrdersPage() {
  const [waiterName, setWaiterName] = useState<string | null>(null);
  const [foundOrders, setFoundOrders] = useState<Order[]>([]);
  const { orders } = useOrders();
  const { products } = useProducts();
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(productSearchTerm, 300);
  const [highlightedProducts, setHighlightedProducts] = useState<Record<string, number[]>>({});
  const [formattedItemDates, setFormattedItemDates] = useState<Record<string, string>>({});


  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (!name) {
      router.push('/waiter');
    } else {
      setWaiterName(name);
    }
  }, [router]);

  useEffect(() => {
    if (waiterName) {
      const waiterOrders = getOrdersByWaiterName(waiterName);
      setFoundOrders(waiterOrders);

      const newFormattedItemDates: Record<string, string> = {};
      waiterOrders.forEach(order => {
        order.items.forEach(item => {
            newFormattedItemDates[`item-${order.id}-${item.id}-${item.addedAt}`] = format(new Date(item.addedAt), "h:mm a", { locale: es });
        });
      });
      setFormattedItemDates(newFormattedItemDates);
    }
  }, [waiterName, orders]);

  const openAddProductModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setProductSearchTerm('');
  };

  const handleAddProduct = (product: Product) => {
    if (!selectedOrder || !waiterName) return;

    const newProduct: Omit<OrderItem, 'addedAt'> = {
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      quantity: 1,
    };
    addProductToOrder(selectedOrder.id, newProduct, waiterName);

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
    }, 2000);
  };
  
  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'Pendiente':
        return 'destructive';
      case 'En Preparación':
        return 'secondary';
      case 'Completado':
        return 'warning';
      case 'Pagado':
        return 'success';
      default:
        return 'outline';
    }
  };

  const totalSales = foundOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Button variant="ghost" asChild>
          <Link href="/waiter/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel
          </Link>
        </Button>
      </div>
      <Card className="w-full max-w-4xl mx-auto bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Mis Pedidos Registrados</CardTitle>
          {waiterName && (
            <CardDescription className="text-center">
              Aquí están todos los pedidos que has gestionado como <span className="font-semibold">{waiterName}</span>.
            </CardDescription>
          )}
          {totalSales > 0 && (
            <div className="text-center mt-4">
              <p className="text-lg font-semibold flex items-center justify-center gap-2">
                <DollarSign className="h-6 w-6 text-green-500" />
                Total Vendido:
                <span className="text-primary">${totalSales.toLocaleString('es-CO')}</span>
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {foundOrders.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {foundOrders.map((order, index) => (
                <AccordionItem key={order.id} value={`item-${index}`} className="border-border rounded-lg mb-2 bg-card">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex justify-between items-center w-full">
                      <div className="text-left">
                        <span className="font-bold text-lg">Pedido #{order.id}</span>
                        <span className="font-bold text-lg block">Cliente: {order.customer.name}</span>
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
                      <p className="text-sm text-muted-foreground">
                          <strong>Celular:</strong> {order.customer.phone}
                      </p>
                       {order.attendedBy && (
                            <p className="font-semibold mb-1 text-sm">
                                Atendido por: <span className="font-normal">{order.attendedBy}</span>
                            </p>
                        )}
                    </div>
                    
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead className="text-center">Cant.</TableHead>
                                <TableHead>Agregado a las</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item) => (
                                <TableRow key={`${item.id}-${item.addedAt}`} className={cn(highlightedProducts[order.id]?.includes(item.id) && 'animate-highlight')}>
                                    <TableCell>{item.nombre}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell>{formattedItemDates[`item-${order.id}-${item.id}-${item.addedAt}`] || '...'}</TableCell>
                                    <TableCell className="text-right">${(item.precio * item.quantity).toLocaleString('es-CO')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    
                    <div className="mt-4 flex justify-end">
                      <Button onClick={() => openAddProductModal(order)} disabled={order.status === 'Pagado'}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Producto
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Aún no has registrado ningún pedido.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>Añadir Producto al Pedido #{selectedOrder?.id}</DialogTitle>
                <DialogDescription>
                    Busca y selecciona un producto para añadir al pedido de {selectedOrder?.customer.name}.
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
