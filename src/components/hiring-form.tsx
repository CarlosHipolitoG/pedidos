'use client';

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  fullName: z.string().min(3, { message: "El nombre completo debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
  phone: z.string().min(7, { message: "El teléfono debe tener al menos 7 dígitos." }),
  idNumber: z.string().min(5, { message: "El número de cédula debe tener al menos 5 dígitos." }),
});

type FormValues = z.infer<typeof formSchema>;

export function HiringForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      idNumber: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsLoading(true);
    // Simulate API call for form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Hiring Application:", values);

    toast({
      title: "¡Información Recibida!",
      description: "Tus datos personales han sido guardados. Ahora puedes subir tus documentos.",
    });

    setIsLoading(false);
    setIsSubmitted(true);
  };
  
  // A placeholder for file upload fields
  const FileUploadField = ({ label, id }: { label: string, id: string }) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input type="file" id={id} name={id} disabled={!isSubmitted} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );


  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <fieldset disabled={isSubmitted}>
            <legend className="text-xl font-headline text-primary mb-4">Información Personal</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl><Input placeholder="Tu nombre completo" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="idNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Cédula</FormLabel>
                  <FormControl><Input placeholder="Tu número de identificación" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl><Input type="email" placeholder="tu@correo.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl><Input type="tel" placeholder="Tu número de teléfono" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </fieldset>
          
          {!isSubmitted && (
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg rounded-md">
              {isLoading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Guardando...</>) : "Guardar y Continuar"}
            </Button>
          )}
        </form>
      </Form>

      {isSubmitted && (
        <div className="mt-8 pt-6 border-t">
            <h2 className="text-xl font-headline text-primary mb-4">Carga de Documentos</h2>
            <p className="text-muted-foreground mb-6">Por favor, sube los siguientes documentos en formato PDF.</p>
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FileUploadField label="Copia de Cédula" id="idCopy" />
                    <FileUploadField label="Foto" id="photo" />
                    <FileUploadField label="Hoja de Vida" id="cv" />
                    <FileUploadField label="Certificado de Antecedentes" id="backgroundCheck" />
                    <FileUploadField label="Referencias Laborales" id="workRefs" />
                    <FileUploadField label="Referencias Personales" id="personalRefs" />
                    <FileUploadField label="Certificado EPS" id="epsCert" />
                    <FileUploadField label="Certificado Pensiones" id="pensionCert" />
                    <FileUploadField label="Certificación Bancaria" id="bankCert" />
                    <FileUploadField label="RUT" id="rut" />
                </div>
                 <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-lg rounded-md mt-6">
                    {isLoading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Subiendo Documentos...</>) : "Subir Todos los Documentos"}
                </Button>
            </form>
        </div>
      )}
    </div>
  );
}
