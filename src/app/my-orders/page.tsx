
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Order, useOrders, getOrdersByCustomerPhone, updateProductQuantityInOrder, removeProductFromOrder, getOrdersByCustomerEmail } from '@/lib/orders';
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
import { getUserFromStorage } from '@/lib/users';

export default function MyOrdersPage() {
  const [email, setEmail] = useState('');
  const [foundOrders, setFoundOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const { orders, isInitialized } = useOrders();
  const router = useRouter();
  const [now, setNow] = useState(Date.now());
  const { toast } = useToast();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) return;

    const user = getUserFromStorage(email);
    if (!user) {
        toast({
            title: "Usuario no encontrado",
            description: "No se encontró un perfil con ese correo electrónico.",
            variant: "destructive"
        });
        setFoundOrders([]);
        setSearched(true);
        return;
    }
    
    // Login the user for this session
    localStorage.setItem('customerName', user.name);
    localStorage.setItem('customerPhone', user.phone || '');
    localStorage.setItem('customerEmail', user.email);

    const customerOrders = getOrdersByCustomerEmail(email).filter(
      (order) => order.status !== 'Pagado'
    );
    setFoundOrders(customerOrders);
    setSearched(true);
    localStorage.setItem('customerEmail', email);
  };
  
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30 * 1000);
    
    const storedEmail = localStorage.getItem('customerEmail');
    if (storedEmail) {
        setEmail(storedEmail);
        if (isInitialized) {
             const customerOrders = getOrdersByCustomerEmail(storedEmail).filter(
                (order) => order.status !== 'Pagado'
            );
            setFoundOrders(customerOrders);
            setSearched(true);
        }
    }

    return () => clearInterval(interval);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  useEffect(() => {
    if (searched && email && isInitialized) {
        handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, email, searched, isInitialized]);

  
  const handleGoToMenu = (orderId: number) => {
    const order = foundOrders.find(o => o.id === orderId);
    if (order?.customer) {
        localStorage.setItem('customerName', order.customer.name);
        localStorage.setItem('customerPhone', order.customer.phone);
        if(order.customer.email) localStorage.setItem('customerEmail', order.customer.email);
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
    <div className="container mx-auto py-8 relative">
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
            Ingresa tu correo electrónico para ver tu historial de pedidos activos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center gap-4 mb-8">
            <div className="flex-grow space-y-2">
              <Label htmlFor="email" className="sr-only">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="Tu correo electrónico..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={!email}>
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
                                          disabled={isLocked || order.status === 'Completado' || order.status === 'Pagado'}
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
                  <p>No se encontraron pedidos activos para este correo.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    