
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Order, useOrders, getOrdersByWaiterName } from '@/lib/orders';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function WaiterMyOrdersPage() {
  const [waiterName, setWaiterName] = useState<string | null>(null);
  const [foundOrders, setFoundOrders] = useState<Order[]>([]);
  const { orders } = useOrders(); // Use the hook to get updates
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem('waiterName');
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
    }
  }, [waiterName, orders]); // Rerun when waiterName or the global orders list changes

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
            <Link href="/waiter/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Panel
            </Link>
        </Button>
      <Card className="w-full max-w-4xl mx-auto bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Mis Pedidos Registrados</CardTitle>
          {waiterName && (
            <CardDescription className="text-center">
              Aquí están todos los pedidos que has gestionado como <span className="font-semibold">{waiterName}</span>.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {foundOrders.length > 0 ? (
            <div className="space-y-4">
                {foundOrders.map(order => (
                    <Card key={order.id} className="p-4">
                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                           <div className="mb-4 sm:mb-0">
                             <p className="font-bold text-lg">Pedido #{order.id}</p>
                             <p className="text-sm text-muted-foreground">
                                {format(new Date(order.timestamp), "d 'de' LLLL, h:mm a", { locale: es })}
                             </p>
                              <p className="flex items-center gap-2 mt-2">
                                <UserCircle className="h-5 w-5 text-muted-foreground"/>
                                <span>Cliente: <span className="font-medium">{order.customer.name}</span></span>
                              </p>
                           </div>
                           <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                            <Badge variant={getStatusBadgeVariant(order.status)} className="mb-2 text-sm px-3 py-1">{order.status}</Badge>
                             <p className="font-semibold text-xl">${order.total.toLocaleString('es-CO')}</p>
                           </div>
                       </div>
                       <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold mb-2">Productos:</h4>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {order.items.map(item => (
                                    <li key={item.id}>
                                        {item.quantity}x {item.nombre} - (${(item.precio * item.quantity).toLocaleString('es-CO')})
                                    </li>
                                ))}
                            </ul>
                       </div>
                    </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Aún no has registrado ningún pedido.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
