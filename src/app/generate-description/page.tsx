import { EventDescriptionGenerator } from '@/components/event-description-generator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GenerateDescriptionPage() {
  return (
    <div className="w-full py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" asChild className="text-primary border-primary hover:bg-primary/10">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </div>
        <EventDescriptionGenerator />
      </div>
    </div>
  );
}
