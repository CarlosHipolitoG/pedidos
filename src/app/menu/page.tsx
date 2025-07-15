
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useProducts, Product } from '@/lib/products';
import { ShoppingCart, Search, Plus, Minus, Trash2, PackageCheck, CookingPot, History, CreditCard } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { addOrder, OrderItem, CustomerInfo, useOrders, addProductToOrder, getOrderById, Order, NewOrderPayload, removeProductFromOrder, updateProductQuantityInOrder } from '@/lib/orders';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type CartItem = Product & { quantity: number };

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  const sheetCloseRef = useRef<HTMLButtonElement>(null);
  const { orders } = useOrders();
  const { products } = useProducts();
  const router = useRouter();
  const [now, setNow] = useState(Date.now());

  const activeOrder = activeOrderId ? getOrderById(activeOrderId) : null;

  useEffect(() => {
    const savedCustomer: CustomerInfo = {
      name: localStorage.getItem('customerName') || '',
      phone: localStorage.getItem('customerPhone') || '',
      email: localStorage.getItem('customerEmail') || '',
    };
    if (savedCustomer.name && savedCustomer.phone) {
        setCustomerInfo(savedCustomer);
    } else {
        router.push('/');
    }

    const savedOrderId = localStorage.getItem('activeOrderId');
    if (savedOrderId) {
        const orderExists = getOrderById(parseInt(savedOrderId));
        if(orderExists) {
             setActiveOrderId(parseInt(savedOrderId));
        } else {
             localStorage.removeItem('activeOrderId');
        }
    }

    const interval = setInterval(() => setNow(Date.now()), 30 * 1000);
    return () => clearInterval(interval);

  }, [orders, router]);

  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );
  
  const productsByCategory = filteredProducts.reduce((acc, product) => {
    const category = product.categoria;
    if (!acc[category]) {
        acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const categories = Object.keys(productsByCategory).sort();

  const handleAddToCart = (product: Product) => {
    if (activeOrder) {
        addProductToOrder(activeOrder.id, { ...product, quantity: 1 });
        toast({
            title: "Producto agregado",
            description: `${product.nombre} se ha añadido a tu pedido.`,
        });
    } else {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        toast({
            title: "Producto agregado",
            description: `${product.nombre} se ha añadido al carrito.`,
        });
    }
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };
  
  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.precio * item.quantity, 0);

  const handleConfirmOrder = () => {
    if (cart.length === 0 || !customerInfo) {
        toast({
            title: "Error en el pedido",
            description: "El carrito está vacío o no se ha identificado al cliente.",
            variant: "destructive",
        });
        return;
    }
  
    const orderItems: NewOrderPayload['items'] = cart.map(item => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        quantity: item.quantity,
    }));
  
    const newOrderId = addOrder({
        customer: customerInfo,
        items: orderItems,
        total: cartTotal,
        orderedBy: { type: 'Cliente', name: customerInfo.name }
    });

    if(newOrderId) {
        setActiveOrderId(newOrderId);
        localStorage.setItem('activeOrderId', newOrderId.toString());
    }
    
    toast({
        title: "¡Pedido Enviado!",
        description: "Tu pedido ha sido enviado al administrador. ¡Gracias por tu compra!",
        variant: "default",
    });
  
    setCart([]);
    sheetCloseRef.current?.click();
  }

  const handleFinishOrder = () => {
    localStorage.removeItem('activeOrderId');
    setActiveOrderId(null);
    toast({
        title: "¡Que disfrutes!",
        description: "Tu pedido ha sido marcado como finalizado. Puedes crear uno nuevo o ver tu historial.",
    });
  };
  
  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'Pendiente':
        return { icon: History, text: "Tu pedido está pendiente de preparación.", color: "text-amber-500" };
      case 'En Preparación':
        return { icon: CookingPot, text: "¡Tu pedido se está preparando en la cocina!", color: "text-blue-500" };
      case 'Completado':
        return { icon: PackageCheck, text: "Tu pedido está listo. ¡Buen provecho!", color: "text-green-500" };
       case 'Pagado':
        return { icon: CreditCard, text: "Tu pedido ha sido pagado. ¡Gracias!", color: "text-green-500" };
      default:
        return { icon: History, text: "", color: "" };
    }
  };

  const handleUpdateActiveOrderQuantity = (itemId: number, newQuantity: number) => {
      if (!activeOrder) return;
      if (newQuantity <= 0) {
          handleRemoveFromActiveOrder(itemId);
      } else {
          updateProductQuantityInOrder(activeOrder.id, itemId, newQuantity);
      }
  };

  const handleRemoveFromActiveOrder = (itemId: number) => {
      if (!activeOrder) return;
      const success = removeProductFromOrder(activeOrder.id, itemId);
      if (!success) {
          toast({
              title: "No se puede eliminar",
              description: "Este producto no se puede eliminar porque fue agregado hace más de 5 minutos.",
              variant: "destructive",
          });
      }
  };

  return (
    <div className="container mx-auto py-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold">Nuestro Menú</h1>
            {customerInfo && <p className="text-muted-foreground">Hola, <span className="font-semibold">{customerInfo.name}</span></p>}
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" asChild>
            <Link href="/my-orders">
                <History className="mr-2 h-4 w-4" />
                Mis Pedidos
            </Link>
          </Button>
        </div>
        {!activeOrder && (
            <Sheet>
            <SheetTrigger asChild>
                <Button size="lg" className="relative">
                <ShoppingCart className="mr-2 h-6 w-6" />
                Ver Carrito
                {totalItemsInCart > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                    {totalItemsInCart}
                    </span>
                )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                <SheetTitle>Carrito de Compras ({totalItemsInCart})</SheetTitle>
                </SheetHeader>
                <Separator />
                {cart.length > 0 ? (
                <>
                    <div className="flex-grow overflow-y-auto pr-4 -mr-4">
                    <div className="space-y-4">
                        {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                            <Image
                            src={item.imagen || 'https://placehold.co/100x100.png'}
                            alt={item.nombre}
                            width={80}
                            height={80}
                            className="rounded-md object-cover"
                            data-ai-hint="beverage drink"
                            />
                            <div className="flex-grow">
                            <p className="font-semibold">{item.nombre}</p>
                            <p className="text-sm text-muted-foreground">
                                ${item.precio.toLocaleString('es-CO')}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                >
                                <Minus className="h-4 w-4" />
                                </Button>
                                <span>{item.quantity}</span>
                                <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                >
                                <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            </div>
                            <div className="text-right">
                            <p className="font-semibold">
                                ${(item.precio * item.quantity).toLocaleString('es-CO')}
                            </p>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleRemoveFromCart(item.id)}
                                >
                                <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                    <Separator />
                    <SheetFooter className="mt-4">
                    <div className="w-full space-y-2">
                        <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${cartTotal.toLocaleString('es-CO')}</span>
                        </div>
                        <Button className="w-full" size="lg" onClick={handleConfirmOrder}>
                            Confirmar Pedido
                        </Button>
                        <SheetClose ref={sheetCloseRef} className="hidden" />
                    </div>
                    </SheetFooter>
                </>
                ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-lg font-semibold">Tu carrito está vacío</p>
                    <p className="text-sm text-muted-foreground">Agrega productos del menú para comenzar.</p>
                </div>
                )}
            </SheetContent>
            </Sheet>
        )}
      </header>

      {activeOrder && (
        <Card className="mb-8 bg-card/90 backdrop-blur-sm border-primary/20">
            <CardHeader>
                <CardTitle>Tu Pedido Activo (#{activeOrder.id})</CardTitle>
                <div className="flex items-center gap-4 pt-2">
                    <Badge variant={activeOrder.status === 'Completado' || activeOrder.status === 'Pagado' ? 'success' : 'secondary'}>
                        {activeOrder.status}
                    </Badge>
                     {(() => {
                        const { icon: Icon, text, color } = getStatusInfo(activeOrder.status);
                        return (
                            <p className={`flex items-center gap-2 ${color}`}>
                                <Icon className="h-5 w-5" />
                                {text}
                            </p>
                        );
                    })()}
                </div>
            </CardHeader>
            <CardContent>
                 <div className="space-y-4">
                    {activeOrder.items.map(item => {
                       const isLocked = (now - item.addedAt) > 5 * 60 * 1000;
                       return (
                        <div key={`${item.id}-${item.addedAt}`} className="flex items-center gap-4">
                           <div className="flex-grow">
                             <p className={cn("font-medium", isLocked && "text-muted-foreground")}>
                                {item.nombre}
                             </p>
                             <p className="text-xs text-muted-foreground">
                               Agregado a las {format(new Date(item.addedAt), "h:mm a", { locale: es })}
                             </p>
                           </div>
                           <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleUpdateActiveOrderQuantity(item.id, item.quantity - 1)}
                                disabled={isLocked}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-4 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleUpdateActiveOrderQuantity(item.id, item.quantity + 1)}
                                disabled={isLocked || activeOrder.status === 'Completado' || activeOrder.status === 'Pagado'}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                           </div>
                           <span className={cn("w-20 text-right font-mono text-sm", isLocked && "text-muted-foreground")}>
                            ${(item.precio * item.quantity).toLocaleString('es-CO')}
                           </span>
                           <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleRemoveFromActiveOrder(item.id)}
                                disabled={isLocked}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                       )
                    })}
                 </div>
                 <Separator className="my-4"/>
                 <div className="flex justify-between font-bold text-lg">
                    <span>Total del Pedido:</span>
                    <span>${activeOrder.total.toLocaleString('es-CO')}</span>
                 </div>
            </CardContent>
            {(activeOrder.status === 'Completado' || activeOrder.status === 'Pagado') && (
                 <CardFooter>
                    <Button onClick={handleFinishOrder} className="w-full">
                       Finalizar y Crear Nuevo Pedido
                    </Button>
                </CardFooter>
            )}
        </Card>
      )}

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsByCategory[category].map((product) => (
                <Card key={product.id} className="flex flex-col overflow-hidden group">
                  <CardHeader className="p-0 relative">
                    <Image
                      src={product.imagen || 'https://placehold.co/600x400.png'}
                      alt={product.nombre}
                      width={600}
                      height={400}
                      className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint="beverage drink"
                    />
                    {product.disponibilidad === 'PRODUCTO_AGOTADO' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">AGOTADO</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow p-4 flex flex-col">
                    <CardTitle className="text-lg mb-2 flex-grow">{product.nombre}</CardTitle>
                    <p className="text-xl font-semibold text-primary">
                      ${product.precio.toLocaleString('es-CO')}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full"
                      disabled={product.disponibilidad === 'PRODUCTO_AGOTADO' || (activeOrder && (activeOrder.status === 'Completado' || activeOrder.status === 'Pagado'))}
                      onClick={() => handleAddToCart(product)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {activeOrder ? 'Añadir al Pedido' : 'Agregar al Carrito'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

    