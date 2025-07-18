
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUsers, User, addUser, updateUser, deleteUser, UserRole } from '@/lib/users';
import { ArrowLeft, PlusCircle, Edit, Trash2, KeyRound, Copy } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

type EditableUser = Partial<Omit<User, 'id' | 'temporaryPassword'>> & { id?: number };

export default function AdminUsersPage() {
  const { users } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<EditableUser | null>(null);
  const { toast } = useToast();

  const openModal = (user: User | null = null) => {
    if (user) {
      setEditingUser({ ...user });
    } else {
      setEditingUser({
        name: '',
        email: '',
        role: 'waiter',
        phone: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copiada",
      description: "El enlace de acceso ha sido copiado al portapapeles.",
    });
  };

  const handleSaveUser = () => {
    if (!editingUser || !editingUser.name || !editingUser.email || !editingUser.role) {
        toast({ title: "Error", description: "Todos los campos son requeridos.", variant: "destructive" });
        return;
    }

    if (editingUser.id) {
      // Editing existing user
      const { id, ...updateData } = editingUser;
      updateUser(id, updateData as Omit<User, 'id' | 'password' | 'temporaryPassword'>);
       toast({ title: "Usuario Actualizado", description: `Los datos de ${editingUser.name} han sido actualizados.` });
    } else {
      // Adding new user
      const result = addUser(editingUser as Omit<User, 'id' | 'password' | 'temporaryPassword'>);
      if (result.tempPassword && result.newUser) {
        const baseUrl = window.location.origin;
        const loginPath = result.newUser.role === 'admin' ? '/admin' : '/waiter';
        const loginUrl = `${baseUrl}${loginPath}`;
        
        toast({ 
            title: "Usuario Registrado Exitosamente", 
            description: (
              <div>
                  <p>Usuario: {result.newUser.name}</p>
                  <p>Contraseña Temporal: <span className="font-bold">{result.tempPassword}</span></p>
                  <div className="mt-2">
                    <p className="text-xs">Enlace de acceso:</p>
                    <div className="flex items-center gap-2">
                      <a href={loginUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline break-all">{loginUrl}</a>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyUrl(loginUrl)}>
                        <Copy className="h-4 w-4"/>
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs mt-2">Por favor, comparte esta información de forma segura.</p>
              </div>
            ),
            duration: 20000 
        });
      } else {
         toast({ title: "Cliente Registrado", description: `${editingUser.name} ha sido añadido como cliente.` });
      }
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: number) => {
    deleteUser(userId);
    toast({ title: "Usuario Eliminado", description: "El usuario ha sido eliminado del sistema." });
  };

  const handleInputChange = (field: keyof EditableUser, value: string) => {
    if (!editingUser) return;
    setEditingUser(prev => ({ ...prev, [field]: value }));
  };
  
  const getRoleBadgeVariant = (role: User['role']) => {
      switch(role) {
          case 'admin': return 'default';
          case 'waiter': return 'secondary';
          case 'client': return 'outline';
          default: return 'outline';
      }
  }

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

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle>Registro y Gestión de Usuarios</CardTitle>
                <CardDescription>
                    Registra, edita y gestiona los perfiles de administradores, meseros y clientes.
                </CardDescription>
            </div>
            <Button onClick={() => openModal()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Registrar Nuevo Usuario
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Celular</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Contraseña</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                   <TableCell>{user.phone || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.temporaryPassword ? (
                        <span className="flex items-center text-amber-600">
                             <KeyRound className="h-4 w-4 mr-2" /> Temporal
                        </span>
                    ) : user.role !== 'client' ? (
                       <span className="text-green-600">Definitiva</span>
                    ) : (
                       <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => openModal(user)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="destructive" size="icon" disabled={user.email === 'admin@example.com'}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro de que deseas eliminar este usuario?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{editingUser?.id ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}</DialogTitle>
                <DialogDescription>
                    {editingUser?.id ? 'Modifica los detalles del usuario.' : 'Completa la información para registrar un nuevo usuario.'}
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input id="name" value={editingUser?.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" value={editingUser?.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Número de Celular</Label>
                    <Input id="phone" type="tel" value={editingUser?.phone || ''} onChange={(e) => handleInputChange('phone', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                     <Select value={editingUser?.role} onValueChange={(value) => handleInputChange('role', value as UserRole)}>
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="waiter">Mesero</SelectItem>
                            <SelectItem value="client">Cliente</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {!editingUser?.id && editingUser?.role !== 'client' && (
                     <p className="text-sm text-muted-foreground">Se generará una contraseña temporal para este usuario.</p>
                )}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveUser}>Guardar</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
