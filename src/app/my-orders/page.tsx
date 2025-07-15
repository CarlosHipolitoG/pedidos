
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Order, useOrders, getOrdersByCustomerPhone, updateProductQuantityInOrder, removeProductFromOrder } from '@/lib/orders';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, History, Package, Plus, Minus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

export default function MyOrdersPage() {
  const [phone, setPhone] = useState('');
  const [foundOrders, setFoundOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const { orders } = useOrders();
  const router = useRouter();
  const [now, setNow] = useState(Date.now());
  const { toast } = useToast();

  useEffect(() => {
    // This interval will re-render the component every 30 seconds
    // to update the disabled state of the remove buttons.
    const interval = setInterval(() => setNow(Date.now()), 30 * 1000);
    
    // Auto-search if phone is in localStorage
    const storedPhone = localStorage.getItem('customerPhone');
    if (storedPhone) {
        setPhone(storedPhone);
        const customerOrders = getOrdersByCustomerPhone(storedPhone);
        setFoundOrders(customerOrders);
        setSearched(true);
    }

    return () => clearInterval(interval);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // This effect will re-run the search whenever the global order list changes
    // ensuring the view is always up-to-date.
    if (searched && phone) {
        handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!phone) return;
    const customerOrders = getOrdersByCustomerPhone(phone);
    setFoundOrders(customerOrders);
    setSearched(true);
    // save phone for future sessions
    localStorage.setItem('customerPhone', phone);
  };
  
  const handleGoToMenu = (orderId: number) => {
    const customer = foundOrders[0]?.customer;
    if (customer) {
        localStorage.setItem('customerName', customer.name);
        localStorage.setItem('customerPhone', customer.phone);
        if(customer.email) localStorage.setItem('customerEmail', customer.email);
    }
    localStorage.setItem('activeOrderId', orderId.toString());
    router.push('/menu');
  };

  const handleUpdateQuantity = (orderId: number, itemId: number, newQuantity: number) => {
      if (newQuantity <= 0) {
          handleRemoveItem(orderId, itemId);
      } else {
          updateProductQuantityInOrder(orderId, itemId, newQuantity);
      }
  };

  const handleRemoveItem = (orderId: number, itemId: number) => {
      const success = removeProductFromOrder(orderId, itemId);
      if (!success) {
          toast({
              title: "No se puede eliminar",
              description: "Este producto no se puede eliminar porque fue agregado hace más de 5 minutos.",
              variant: "destructive",
          });
      }
  };

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

  return (
    <div className="container mx-auto py-8">
       <Button variant="ghost" asChild className="absolute top-4 left-4">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Inicio
            </Link>
        </Button>
      <Card className="w-full max-w-4xl mx-auto bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Mis Pedidos</CardTitle>
          <CardDescription className="text-center">
            Ingresa tu número de celular para ver tu historial de pedidos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center gap-4 mb-8">
            <div className="flex-grow space-y-2">
              <Label htmlFor="phone" className="sr-only">Número de Celular</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Tu número de celular..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={!phone}>
                <History className="mr-2 h-4 w-4"/>
                Buscar Pedidos
            </Button>
          </form>

          {searched && (
            <div>
              {foundOrders.length > 0 ? (
                <>
                  <h3 className="text-lg font-semibold mb-4">Pedidos de: {foundOrders[0].customer.name}</h3>
                  <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                    {foundOrders.map((order, index) => (
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
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead className="text-center">Cantidad</TableHead>
                                <TableHead>Agregado a las</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                                <TableHead className="text-right">Acción</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.items.map((item) => {
                                const isLocked = (now - item.addedAt) > 5 * 60 * 1000;
                                return (
                                  <TableRow key={`${item.id}-${item.addedAt}`} className={cn(isLocked && "text-muted-foreground")}>
                                    <TableCell>{item.nombre}</TableCell>
                                    <TableCell>
                                      <div className="flex items-center justify-center gap-2">
                                        <Button
                                          variant="outline" size="icon" className="h-7 w-7"
                                          onClick={() => handleUpdateQuantity(order.id, item.id, item.quantity - 1)}
                                          disabled={isLocked}
                                        >
                                          <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-4 text-center">{item.quantity}</span>
                                        <Button
                                          variant="outline" size="icon" className="h-7 w-7"
                                          onClick={() => handleUpdateQuantity(order.id, item.id, item.quantity + 1)}
                                          disabled={order.status === 'Completado' || order.status === 'Pagado'}
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                    <TableCell>{format(new Date(item.addedAt), "h:mm a", { locale: es })}</TableCell>
                                    <TableCell className="text-right">${(item.precio * item.quantity).toLocaleString('es-CO')}</TableCell>
                                    <TableCell className="text-right">
                                      <Button
                                        variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => handleRemoveItem(order.id, item.id)}
                                        disabled={isLocked}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                )}
                              )}
                            </TableBody>
                          </Table>
                          <Separator className="my-4"/>
                           <div className="mt-4 flex justify-end">
                                <Button onClick={() => handleGoToMenu(order.id)} disabled={order.status === 'Pagado'}>
                                    <Package className="mr-2 h-4 w-4" />
                                    Añadir más productos
                                </Button>
                           </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No se encontraron pedidos asociados a ese número de celular.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
