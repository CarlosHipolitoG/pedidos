'use client';

import React, { useState, useEffect, useMemo } from 'react';
import EventCard from '@/components/event-card';
import Filters from '@/components/filters';
import type { Event, EventCategory } from '@/types';
import { mockEvents } from '@/lib/event-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function HomePage() {
  const [allEvents] = useState<Event[]>(mockEvents);
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    let filtered = [...allEvents];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Default sort by most recent date
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setDisplayedEvents(filtered);
  }, [allEvents, selectedCategory, searchTerm]);
  
  const uniqueCategories = useMemo(() => {
    const categories = new Set(allEvents.map(event => event.category));
    return Array.from(categories) as EventCategory[];
  }, [allEvents]);

  const handleBookingRequest = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Información incompleta",
        description: "Por favor, selecciona una fecha y una hora.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "¡Solicitud Recibida!",
      description: `Nos pondremos en contacto contigo para organizar tu evento el ${format(selectedDate, "PPP", { locale: es })} a las ${selectedTime}.`,
    });
  };


  return (
    <div className="w-full">
      <header className="mb-8 text-center py-8 bg-gradient-to-r from-primary/10 via-background to-accent/10 rounded-lg shadow">
        <h1 className="text-5xl md:text-6xl font-headline text-primary drop-shadow-sm">
          Always Events
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
        Bienvenidos es aqui donde la elegancia y la sofisticación se encuentran para transformar sus sueños en realidades inolvidables. Ubicados en el corazón de la ciudad, ofrecemos un espacio excepcional diseñado para albergar desde íntimas reuniones hasta grandiosas celebraciones. Permítanos ser el telón de fondo perfecto para sus momentos más preciados.
        </p>
      </header>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar eventos por título, descripción o ubicación..."
            className="w-full pl-10 pr-4 py-3 text-base rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Filters
        categories={uniqueCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {selectedDate && (
        <div className="my-8 p-6 bg-card rounded-lg shadow-md text-center border border-primary/20">
          <h3 className="text-2xl font-headline text-primary mb-2">
            Disponibilidad para el día {format(selectedDate, "PPP", { locale: es })}
          </h3>
          <p className="text-muted-foreground mb-4">
            Por favor, selecciona una hora para organizar tu evento.
          </p>
          <div className="flex justify-center items-center gap-4 max-w-md mx-auto">
            <Input
              type="time"
              className="w-full"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
            <Button onClick={handleBookingRequest}>Solicitar</Button>
          </div>
        </div>
      )}

      {displayedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-2xl font-semibold text-muted-foreground">No se encontraron eventos que coincidan con sus criterios.</p>
          <p className="mt-2 text-md text-muted-foreground">Intente ajustar sus filtros o término de búsqueda.</p>
        </div>
      )}
    </div>
  );
}
