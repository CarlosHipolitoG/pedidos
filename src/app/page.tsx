'use client';

import React, { useState, useEffect, useMemo } from 'react';
import EventCard from '@/components/event-card';
import Filters from '@/components/filters';
import type { Event, EventCategory } from '@/types';
import { mockEvents, eventCategories } from '@/lib/event-data';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function HomePage() {
  const [allEvents] = useState<Event[]>(mockEvents);
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [sortOption, setSortOption] = useState<string>('date-desc');
  const [searchTerm, setSearchTerm] = useState<string>('');

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
    
    switch (sortOption) {
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'pop-asc':
        filtered.sort((a, b) => a.popularity - b.popularity);
        break;
      case 'pop-desc':
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'title-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setDisplayedEvents(filtered);
  }, [allEvents, selectedCategory, sortOption, searchTerm]);
  
  const uniqueCategories = useMemo(() => {
    const categories = new Set(allEvents.map(event => event.category));
    return Array.from(categories) as EventCategory[];
  }, [allEvents]);


  return (
    <div className="w-full">
      <header className="mb-8 text-center py-8 bg-gradient-to-r from-primary/10 via-background to-accent/10 rounded-lg shadow">
        <h1 className="text-5xl md:text-6xl font-headline text-primary drop-shadow-sm">
          Event Showcase
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
          Discover your next unforgettable experience. Browse our curated list of exciting events.
        </p>
      </header>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search events by title, description, or location..."
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
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      {displayedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-2xl font-semibold text-muted-foreground">No events match your criteria.</p>
          <p className="mt-2 text-md text-muted-foreground">Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  );
}
