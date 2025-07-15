
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Order, useOrders, getOrdersByCustomerPhone } from '@/lib/orders';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, History, Package } from 'lucide-react';
import Link from 'next/link';

export default function MyOrdersPage() {
  const [phone, setPhone] = useState('');
  const [foundOrders, setFoundOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const orders = getOrdersByCustomerPhone(phone);
    setFoundOrders(orders);
    setSearched(true);
  };
  
  const handleSelectOrder = (orderId: number) => {
    // We get the customer from the first order, assuming it's the same customer
    const customer = foundOrders[0]?.customer;
    if (customer) {
        localStorage.setItem('customerName', customer.name);
        localStorage.setItem('customerPhone', customer.phone);
        if(customer.email) localStorage.setItem('customerEmail', customer.email);
    }
    localStorage.setItem('activeOrderId', orderId.toString());
    router.push('/menu');
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
      <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-sm">
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
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Pedidos de: {foundOrders[0].customer.name}</h3>
                    {foundOrders.map(order => (
                        <Card key={order.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
                           <div className="mb-4 sm:mb-0">
                             <p className="font-bold">Pedido #{order.id}</p>
                             <p className="text-sm text-muted-foreground">
                                {format(new Date(order.timestamp), "d 'de' LLLL, h:mm a", { locale: es })}
                             </p>
                             <p className="font-semibold mt-2">${order.total.toLocaleString('es-CO')}</p>
                           </div>
                           <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                            <Badge variant={getStatusBadgeVariant(order.status)} className="mb-2">{order.status}</Badge>
                            <Button onClick={() => handleSelectOrder(order.id)} className="w-full sm:w-auto">
                                <Package className="mr-2 h-4 w-4" />
                                Ver y Añadir Productos
                            </Button>
                           </div>
                        </Card>
                    ))}
                </div>
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

