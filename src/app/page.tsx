import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Utensils, Shield } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary sm:text-[5rem]">
          HOLIDAYS <span className="text-secondary-foreground/80">FRIENDS</span>
        </h1>
        <p className="text-xl text-muted-foreground mt-4">
          Selecciona tu rol para comenzar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <Link href="/client" passHref>
          <Card className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer h-full flex flex-col justify-center bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Cliente</CardTitle>
              <CardDescription>Ver el menú y realizar un pedido.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link href="/waiter" passHref>
          <Card className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer h-full flex flex-col justify-center bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Utensils className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Mesero</CardTitle>
              <CardDescription>Gestionar pedidos y ver mesas.</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin" passHref>
          <Card className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer h-full flex flex-col justify-center bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
               <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Administrador</CardTitle>
              <CardDescription>Ver todos los pedidos y gestionar cuentas.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </main>
  );
}
