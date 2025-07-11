import { HiringForm } from '@/components/hiring-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

export default function HiringPage() {
  return (
    <div className="w-full py-8">
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <div className="inline-block p-3 bg-primary/10 rounded-full mx-auto mb-4">
            <Briefcase className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl text-primary">Portal de Contratación</CardTitle>
          <CardDescription className="text-md">
            Únete a nuestro equipo. Completa el formulario para iniciar tu proceso de selección.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HiringForm />
        </CardContent>
      </Card>
    </div>
  );
}
