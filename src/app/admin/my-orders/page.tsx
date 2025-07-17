
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Order, useOrders, getOrdersByAttendedBy } from '@/lib/orders';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, UserCircle, Edit, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminMyOrdersPage() {
  const [adminName, setAdminName] = useState<string>('Admin'); // Assuming admin is always 'Admin'
  const [foundOrders, setFoundOrders] = useState<Order[]>([]);
  const { orders } = useOrders(); 
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (adminName) {
      const adminOrders = getOrdersByAttendedBy(adminName);
      setFoundOrders(adminOrders);
    }
  }, [adminName, orders]); 

  const handleEditOrder = (order: Order) => {
    // Admin doesn't have an "editing mode" like waiters, they edit from the main dash
    // We can just scroll to the order in the main dashboard.
    // For now, let's just navigate to the dashboard. A more complex implementation could pass the ID.
    router.push('/admin/dashboard');
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

  const totalSales = foundOrders.reduce((sum, order) => sum + order.total, 0);

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
      <Card className="w-full max-w-4xl mx-auto bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Mis Pedidos Atendidos</CardTitle>
          <CardDescription className="text-center">
            Aquí están todos los pedidos en los que has intervenido como <span className="font-semibold">{adminName}</span>.
          </CardDescription>
           {isMounted && totalSales > 0 && (
            <div className="text-center mt-4">
                <p className="text-lg font-semibold flex items-center justify-center gap-2">
                    <DollarSign className="h-6 w-6 text-green-500"/>
                    Total en Pedidos Atendidos: 
                    <span className="text-primary">${totalSales.toLocaleString('es-CO')}</span>
                </p>
            </div>
           )}
        </CardHeader>
        <CardContent>
          {foundOrders.length > 0 ? (
            <div className="space-y-4">
                {foundOrders.map(order => {
                    const isPaid = order.status === 'Pagado';
                    return (
                        <Card key={order.id} className={cn("p-4", isPaid && "text-muted-foreground bg-muted/50")}>
                           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                               <div className="mb-4 sm:mb-0">
                                 <p className="font-bold text-lg">Pedido #{order.id}</p>
                                 <p className="text-sm">
                                    {format(new Date(order.timestamp), "d 'de' LLLL, h:mm a", { locale: es })}
                                 </p>
                                  <p className="flex items-center gap-2 mt-2">
                                    <UserCircle className="h-5 w-5"/>
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
                                        <li key={`${item.id}-${item.addedAt}`}>
                                            {item.quantity}x {item.nombre} - (${(item.precio * item.quantity).toLocaleString('es-CO')})
                                        </li>
                                    ))}
                                </ul>
                           </div>
                           <div className="mt-4 flex justify-end">
                                <Button onClick={() => handleEditOrder(order)} disabled={isPaid}>
                                    <Edit className="mr-2 h-4 w-4"/>
                                    Editar en Panel Principal
                                </Button>
                           </div>
                        </Card>
                    )
                })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Aún no has atendido ningún pedido.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
