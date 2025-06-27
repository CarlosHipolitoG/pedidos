import type { FC } from 'react';
import type { Event } from '@/types';
import ImageCarousel from './image-carousel';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EventCardProps {
  event: Event;
}

const EventCard: FC<EventCardProps> = ({ event }) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <ImageCarousel images={event.images} altText={event.title} />
      <CardHeader className="pb-3">
        <CardTitle className="font-headline text-2xl text-primary">{event.title}</CardTitle>
        <Badge variant="secondary" className="mt-1 self-start bg-accent/20 text-accent-foreground border-accent/30">{event.category}</Badge>
      </CardHeader>
      <CardContent className="flex-grow pb-3">
        <CardDescription className="line-clamp-3 text-sm">{event.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Cotiza Ahora
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
