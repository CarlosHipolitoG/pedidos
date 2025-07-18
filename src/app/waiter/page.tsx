
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function WaiterRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Set a default waiter user in localStorage so other parts of the app don't break
    localStorage.setItem('userName', 'Juan Mesero');
    localStorage.setItem('userEmail', 'mesero@example.com');
    
    // Redirect to the dashboard
    router.replace('/waiter/dashboard');
  }, [router]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Accediendo al Panel de Mesero</CardTitle>
          <CardDescription className="text-center">
            Serás redirigido en un momento...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
}
