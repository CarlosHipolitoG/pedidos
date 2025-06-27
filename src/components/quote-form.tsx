'use client';

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Loader2, Sparkles, CalendarIcon, Wallet, CreditCard, Banknote, Smartphone, Receipt } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { eventCategories } from '@/lib/event-data';

const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
  phone: z.string().optional(),
  eventType: z.enum(eventCategories, { errorMap: () => ({ message: "Por favor, selecciona un tipo de evento." }) }),
  eventDate: z.date({ required_error: "Por favor, selecciona una fecha para el evento." }),
  guests: z.coerce.number().positive({ message: "El número de invitados debe ser un número positivo." }),
  details: z.string().min(10, { message: "Por favor, proporciona al menos 10 caracteres para los detalles." }).max(1000, { message: "Los detalles no pueden exceder los 1000 caracteres." }),
});

type FormValues = z.infer<typeof formSchema>;

export function QuoteForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      details: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Quote Request:", values);

    toast({
      title: "¡Cotización Enviada!",
      description: "Hemos recibido tu solicitud. Nos pondremos en contacto contigo pronto.",
    });

    form.reset();
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <div className="inline-block p-3 bg-primary/10 rounded-full mx-auto mb-4">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl text-primary">Solicitud de Cotización</CardTitle>
        <CardDescription className="text-md">
          Completa el formulario para recibir una cotización personalizada para tu evento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl><Input placeholder="Tu nombre" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl><Input placeholder="tu@correo.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono (Opcional)</FormLabel>
                <FormControl><Input placeholder="Tu número de teléfono" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="eventType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Evento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un tipo" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {eventCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="guests" render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Invitados</FormLabel>
                  <FormControl><Input type="number" placeholder="Ej: 50" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="eventDate" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha del Evento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? (format(field.value, "PPP", { locale: es })) : (<span>Selecciona una fecha</span>)}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus locale={es} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="details" render={({ field }) => (
              <FormItem>
                <FormLabel>Detalles Adicionales</FormLabel>
                <FormControl><Textarea placeholder="Cuéntanos más sobre lo que necesitas para tu evento soñado..." className="min-h-[120px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-lg rounded-md transition-all duration-300 transform hover:scale-105">
              {isLoading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enviando Cotización...</>) : "Enviar Solicitud de Cotización"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4 pt-8 border-t">
        <h3 className="text-xl font-headline text-primary flex items-center"><Wallet className="mr-3 h-6 w-6" /> Métodos de Pago</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-muted-foreground w-full">
            <div className="flex items-center gap-3"><CreditCard className="h-5 w-5 text-primary" /> Tarjeta Debito/Credito</div>
            <div className="flex items-center gap-3"><Banknote className="h-5 w-5 text-primary" /> Efectivo</div>
            <div className="flex items-center gap-3"><Smartphone className="h-5 w-5 text-primary" /> Trasferencia Nequi/Davivienda</div>
            <div className="flex items-center gap-3"><Receipt className="h-5 w-5 text-primary" /> Abonos A plazos</div>
        </div>
      </CardFooter>
    </Card>
  );
}
