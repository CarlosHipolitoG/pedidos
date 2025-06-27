'use client';

import type { FC } from 'react';
import type { EventCategory } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Filter, CalendarDays } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from './ui/calendar';

interface FiltersProps {
  categories: EventCategory[];
  selectedCategory: EventCategory | 'all';
  onCategoryChange: (category: EventCategory | 'all') => void;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const Filters: FC<FiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedDate,
  onDateChange,
}) => {
  return (
    <div className="p-4 md:p-6 bg-card rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="category-select" className="text-lg font-semibold font-headline text-primary flex items-center mb-2">
            <Filter className="mr-2 h-5 w-5" /> Categoría
          </Label>
          <Select value={selectedCategory} onValueChange={(value) => onCategoryChange(value as EventCategory | 'all')}>
            <SelectTrigger id="category-select" className="w-full">
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-lg font-semibold font-headline text-primary flex items-center mb-2">
            <CalendarDays className="mr-2 h-5 w-5" /> Seleccionar fecha de tu Evento
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Elige una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateChange}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default Filters;
