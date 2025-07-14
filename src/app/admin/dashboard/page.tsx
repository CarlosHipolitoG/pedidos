'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useOrders, Order } from '@/lib/orders';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminDashboardPage() {
  const { orders } = useOrders();
  const [newOrderIds, setNewOrderIds] = useState<Set<number>>(new Set());

  // Effect to identify new orders and trigger a visual hint
  useEffect(() => {
    
    // Simple check to see if there are new orders since last render
    if (orders.length > 0) {
        const newIds = new Set<number>();
        orders.forEach(order => {
             // For this simulation, we'll consider orders "new" for 10 seconds
            if ((Date.now() - order.timestamp) < 10000) {
                newIds.add(order.id);
            }
        });

        if (newIds.size > 0) {
            setNewOrderIds(prev => new Set([...Array.from(prev), ...Array.from(newIds)]));
            // Remove the 'new' status after a few seconds
            setTimeout(() => {
                setNewOrderIds(prev => {
                    const updated = new Set(prev);
                    newIds.forEach(id => updated.delete(id));
                    return updated;
                });
            }, 5000);
        }
    }
  }, [orders]);

  const sortedOrders = [...orders].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Panel de Administrador</h1>
        <p className="text-muted-foreground">Aquí puedes ver los pedidos entrantes.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recibidos ({sortedOrders.length})</CardTitle>
          <CardDescription>Los pedidos más recientes aparecen primero.</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedOrders.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {sortedOrders.map((order) => (
                <AccordionItem 
                  key={order.id} 
                  value={`item-${order.id}`} 
                  className={`border-border rounded-lg mb-2 transition-all duration-500 ${newOrderIds.has(order.id) ? 'bg-primary/10 border-primary shadow-lg' : 'bg-card'}`}
                >
                  <AccordionTrigger className="px-4">
                    <div className="flex justify-between items-center w-full">
                      <div className="text-left">
                        <span className="font-bold">Pedido #{order.id}</span>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.timestamp), "d 'de' LLLL, h:mm a", { locale: es })}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                         <span className="font-semibold text-lg">
                           ${order.total.toLocaleString('es-CO')}
                         </span>
                         {newOrderIds.has(order.id) && <Badge>Nuevo</Badge>}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                     <p className="text-sm text-muted-foreground mb-2"><strong>Cliente:</strong> {order.customer.name} - <strong>Cel:</strong> {order.customer.phone}</p>
                     <ul className="space-y-2">
                       {order.items.map((item) => (
                         <li key={item.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                           <span>{item.nombre} <span className="text-muted-foreground">x</span> {item.quantity}</span>
                           <span>${(item.precio * item.quantity).toLocaleString('es-CO')}</span>
                         </li>
                       ))}
                     </ul>
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
    </div>
  );
}
