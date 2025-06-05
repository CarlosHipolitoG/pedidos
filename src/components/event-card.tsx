import type { FC } from 'react';
import type { Event } from '@/types';
import ImageCarousel from './image-carousel';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

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
        <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4 text-primary" />
            <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-primary" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-primary" />
            <span>Popularity: {event.popularity}/100</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {/* Placeholder for actions, e.g., "Learn More" button */}
        {/* <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/10">Learn More</Button> */}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
