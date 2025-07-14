
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockProducts, Product } from '@/lib/products';
import { ShoppingCart, Search, Plus, Minus, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { useOrders, OrderItem } from '@/lib/orders';

type CartItem = Product & { quantity: number };

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { addOrder } = useOrders();
  const [customerInfo, setCustomerInfo] = useState<{name: string, phone: string, email: string} | null>(null);

  useEffect(() => {
    // In a real app, this would come from a global state/context after login
    const savedCustomer = {
      name: localStorage.getItem('customerName') || 'Cliente Anónimo',
      phone: localStorage.getItem('customerPhone') || 'N/A',
      email: localStorage.getItem('customerEmail') || '',
    };
    setCustomerInfo(savedCustomer);
  }, []);

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
        description: `${product.nombre} se ha añadido al carrito.`,
    })
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
    if (cart.length === 0 || !customerInfo) return;
  
    const currentCart = [...cart];
    const orderItems: OrderItem[] = currentCart.map(item => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        quantity: item.quantity,
    }));
  
    addOrder({
        customer: customerInfo,
        items: orderItems,
        total: cartTotal,
    });
    
    toast({
        title: "¡Pedido Enviado!",
        description: "Tu pedido ha sido enviado al administrador.",
        variant: "default",
    });
  
    setCart([]);
  }

  return (
    <div className="container mx-auto py-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-center">Nuestro Menú</h1>
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
                     <SheetClose asChild>
                      <Button className="w-full" size="lg" onClick={handleConfirmOrder}>
                        Confirmar Pedido
                      </Button>
                    </SheetClose>
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
      </header>

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
                disabled={product.disponibilidad === 'PRODUCTO_AGOTADO'}
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Agregar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
