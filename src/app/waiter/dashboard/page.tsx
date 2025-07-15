
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockProducts, Product } from '@/lib/products';
import { ShoppingCart, Search, Plus, Minus, Trash2, UserPlus, LogOut, PackagePlus, History, Edit } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { addOrder, NewOrderPayload, addProductToOrder, getOrderById } from '@/lib/orders';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type CartItem = Product & { quantity: number };

export default function WaiterDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [waiterName, setWaiterName] = useState<string | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(true);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const sheetCloseRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem('waiterName');
    if (!name) {
      router.push('/waiter');
    } else {
      setWaiterName(name);
    }
    
    const orderIdToEdit = localStorage.getItem('waiterEditingOrderId');
    if (orderIdToEdit) {
      const order = getOrderById(Number(orderIdToEdit));
      if (order) {
        setEditingOrderId(order.id);
        setCustomerName(order.customer.name);
        setCustomerPhone(order.customer.phone);
        // We don't load the cart, as the waiter will only add new items
        setIsCustomerModalOpen(false); 
      } else {
        localStorage.removeItem('waiterEditingOrderId');
      }
    } else {
        setIsCustomerModalOpen(true);
    }

  }, [router]);

  const filteredProducts = mockProducts.filter((product) =>
    product.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
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
        description: `${product.nombre} se ha añadido al pedido.`,
    });
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
    if (cart.length === 0 || !customerName || !waiterName) {
        toast({
            title: "Error en el pedido",
            description: "El carrito está vacío o no se ha identificado al cliente o mesero.",
            variant: "destructive",
        });
        return;
    }
    
    if (editingOrderId) {
        cart.forEach(item => {
            addProductToOrder(editingOrderId, { ...item, quantity: item.quantity }, waiterName);
        });
        toast({
            title: "¡Pedido Actualizado!",
            description: `Se agregaron productos al pedido de ${customerName}.`,
            variant: "default",
        });
        handleFinishEditing();

    } else {
        const orderItems: NewOrderPayload['items'] = cart.map(item => ({
            id: item.id,
            nombre: item.nombre,
            precio: item.precio,
            quantity: item.quantity,
        }));
      
        addOrder({
            customer: { name: customerName, phone: customerPhone },
            items: orderItems,
            total: cartTotal,
            orderedBy: { type: 'Mesero', name: waiterName }
        });
        
        toast({
            title: "¡Pedido Enviado!",
            description: `El pedido para ${customerName} ha sido enviado.`,
            variant: "default",
        });
    }
  
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setIsCustomerModalOpen(true);
    sheetCloseRef.current?.click();
  }
  
  const handleStartOrderForCustomer = () => {
      if (customerName && customerPhone) {
          setIsCustomerModalOpen(false);
          toast({
              title: `Pedido iniciado para ${customerName}`,
              description: 'Ya puedes empezar a agregar productos.'
          });
      }
  }

  const handleLogout = () => {
      localStorage.removeItem('waiterName');
      localStorage.removeItem('waiterEditingOrderId');
      router.push('/waiter');
  }

  const handleFinishEditing = () => {
      localStorage.removeItem('waiterEditingOrderId');
      setEditingOrderId(null);
      setCustomerName('');
      setCustomerPhone('');
      setCart([]);
      router.push('/waiter/my-orders');
  };

  const handleChangeCustomer = () => {
      localStorage.removeItem('waiterEditingOrderId');
      setEditingOrderId(null);
      setCustomerName('');
      setCustomerPhone('');
      setCart([]);
      setIsCustomerModalOpen(true);
  }

  if (!waiterName) {
      return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto py-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold">Panel del Mesero</h1>
            <p className="text-muted-foreground">Bienvenido, <span className="font-semibold">{waiterName}</span></p>
            {editingOrderId ? (
                <p className="text-primary font-medium">Editando Pedido #{editingOrderId} para: {customerName}</p>
            ) : (
                customerName && <p className="text-primary font-medium">Atendiendo a: {customerName}</p>
            )}
        </div>
        <div className="flex items-center gap-4">
            {editingOrderId ? (
                <Button variant="outline" onClick={handleFinishEditing}>
                    <Edit className="mr-2"/>
                    Finalizar Edición
                </Button>
            ) : (
                <Button variant="outline" onClick={handleChangeCustomer}>
                    <UserPlus className="mr-2"/>
                    Cambiar Cliente
                </Button>
            )}
            <Button variant="outline" asChild>
                <Link href="/waiter/my-orders">
                    <History className="mr-2 h-4 w-4" />
                    Ver mis Pedidos
                </Link>
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2"/>
                Cerrar Sesión
            </Button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
         <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar productos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Sheet>
        <SheetTrigger asChild>
            <Button size="lg" className="relative w-full md:w-auto" disabled={isCustomerModalOpen}>
            <ShoppingCart className="mr-2 h-6 w-6" />
            Ver Pedido Actual
            {totalItemsInCart > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                {totalItemsInCart}
                </span>
            )}
            </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
            <SheetHeader>
            <SheetTitle>Pedido para: {customerName || 'N/A'}</SheetTitle>
            <CardDescription>Total Items: ({totalItemsInCart})</CardDescription>
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
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span>{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        </div>
                        <div className="text-right">
                        <p className="font-semibold">
                            ${(item.precio * item.quantity).toLocaleString('es-CO')}
                        </p>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleRemoveFromCart(item.id)} >
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
                    <span>Total a agregar:</span>
                    <span>${cartTotal.toLocaleString('es-CO')}</span>
                    </div>
                    <Button className="w-full" size="lg" onClick={handleConfirmOrder}>
                        <PackagePlus className="mr-2" />
                        {editingOrderId ? 'Agregar Productos al Pedido' : 'Confirmar y Enviar Pedido'}
                    </Button>
                    <SheetClose ref={sheetCloseRef} className="hidden" />
                </div>
                </SheetFooter>
            </>
            ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold">El pedido está vacío</p>
                <p className="text-sm text-muted-foreground">Agrega productos para este cliente.</p>
            </div>
            )}
        </SheetContent>
        </Sheet>
      </div>

      {isCustomerModalOpen && !editingOrderId && <div className="absolute inset-0 bg-background/80 z-10"/>}

      <Dialog open={isCustomerModalOpen && !editingOrderId} onOpenChange={setIsCustomerModalOpen}>
          <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
               <DialogHeader>
                    <DialogTitle>Identificar Cliente</DialogTitle>
                    <DialogDescription>
                        Ingresa los datos del cliente para iniciar un nuevo pedido.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="customer-name">Nombre del Cliente</Label>
                        <Input 
                            id="customer-name" 
                            value={customerName} 
                            onChange={(e) => setCustomerName(e.target.value)} 
                            placeholder="Ej: Juan Pérez"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="customer-phone">Celular del Cliente</Label>
                        <Input 
                            id="customer-phone" 
                            value={customerPhone} 
                            onChange={(e) => setCustomerPhone(e.target.value)} 
                            placeholder="Ej: 3001234567"
                        />
                    </div>
                </div>
                 <DialogFooter>
                    <Button 
                        type="submit" 
                        onClick={handleStartOrderForCustomer} 
                        disabled={!customerName || !customerPhone}
                        className="w-full"
                    >
                        Iniciar Pedido para este Cliente
                    </Button>
                </DialogFooter>
          </DialogContent>
      </Dialog>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
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
                disabled={product.disponibilidad === 'PRODUCTO_AGOTADO' || isCustomerModalOpen}
                onClick={() => handleAddToCart(product)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar al Pedido
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
