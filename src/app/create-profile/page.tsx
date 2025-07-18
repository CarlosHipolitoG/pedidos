
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, UserPlus, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addUser, getUserFromStorage } from '@/lib/users';
import { useAppStore } from '@/lib/store';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type CommentCategory = "queja" | "solicitud" | "felicitacion" | "objeto_perdido";

export default function CreateProfilePage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [address, setAddress] = useState('');
  const [commentCategory, setCommentCategory] = useState<CommentCategory | undefined>();
  const [comment, setComment] = useState('');
  
  const { toast } = useToast();
  const router = useRouter();
  const { isInitialized } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !isInitialized) return;

    const existingUser = getUserFromStorage(email);
    if (existingUser) {
        toast({
            title: "Error de Registro",
            description: "Ya existe un usuario con este correo electrónico.",
            variant: "destructive",
        });
        return;
    }

    addUser({
        name,
        phone,
        email,
        role: 'client',
        cedula,
        birthDate: birthDate ? birthDate.toISOString() : undefined,
        address,
        commentCategory,
        comment,
    });

    toast({
        title: "¡Perfil Creado!",
        description: `Bienvenido, ${name}. Ahora serás dirigido al menú.`,
    });

    // Log the user in and redirect
    localStorage.setItem('customerName', name);
    localStorage.setItem('customerPhone', phone);
    localStorage.setItem('customerEmail', email);
    localStorage.removeItem('activeOrderId');
    router.push('/menu');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <Button variant="ghost" asChild className="absolute top-4 left-4">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Inicio
            </Link>
        </Button>
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <UserPlus className="h-6 w-6" />
            Crear tu Perfil
          </CardTitle>
          <CardDescription className="text-center">
            Completa tus datos para registrarte y disfrutar de una experiencia completa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input id="name" type="text" placeholder="Ej: Juan Pérez" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="phone">Número de Celular</Label>
                  <Input id="phone" type="tel" placeholder="Ej: 3001234567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="cedula">Cédula</Label>
                    <Input id="cedula" type="text" placeholder="Tu número de cédula" value={cedula} onChange={(e) => setCedula(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button id="birthDate" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !birthDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {birthDate ? format(birthDate, "d 'de' MMMM, yyyy", { locale: es }) : <span>Selecciona una fecha</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Dirección (Opcional)</Label>
                <Input id="address" type="text" placeholder="Ej: Calle 123 #45-67" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className="space-y-2 border-t pt-4">
                 <Label>Comentarios (Opcional)</Label>
                 <Select onValueChange={(value: CommentCategory) => setCommentCategory(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="queja">Queja</SelectItem>
                        <SelectItem value="solicitud">Solicitud</SelectItem>
                        <SelectItem value="felicitacion">Felicitación</SelectItem>
                        <SelectItem value="objeto_perdido">Objeto Perdido</SelectItem>
                    </SelectContent>
                </Select>
                <Textarea placeholder="Escribe tu comentario aquí..." value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>

            <Button type="submit" className="w-full" disabled={!name || !phone || !email || !isInitialized}>
              Crear Perfil y Ver Menú
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
