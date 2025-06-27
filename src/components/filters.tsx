'use client';

import type { FC } from 'react';
import type { EventCategory } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Filter, ArrowDownAZ, ArrowUpAZ, CalendarDays, SparklesIcon } from 'lucide-react';

interface FiltersProps {
  categories: EventCategory[];
  selectedCategory: EventCategory | 'all';
  onCategoryChange: (category: EventCategory | 'all') => void;
  sortOption: string;
  onSortChange: (option: string) => void;
}

const sortOptions = [
  { value: 'date-desc', label: 'Fecha (Más recientes primero)', icon: <CalendarDays className="mr-2 h-4 w-4" /> },
  { value: 'date-asc', label: 'Fecha (Más antiguos primero)', icon: <CalendarDays className="mr-2 h-4 w-4" /> },
  { value: 'pop-desc', label: 'Popularidad (Mayor a menor)', icon: <SparklesIcon className="mr-2 h-4 w-4" /> },
  { value: 'pop-asc', label: 'Popularidad (Menor a mayor)', icon: <SparklesIcon className="mr-2 h-4 w-4" /> },
  { value: 'title-asc', label: 'Título (A-Z)', icon: <ArrowDownAZ className="mr-2 h-4 w-4" /> },
  { value: 'title-desc', label: 'Título (Z-A)', icon: <ArrowUpAZ className="mr-2 h-4 w-4" /> },
];

const Filters: FC<FiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
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
            <ArrowDownAZ className="mr-2 h-5 w-5" /> Ordenar por
          </Label>
          <Select value={sortOption} onValueChange={onSortChange}>
            <SelectTrigger id="sort-select" className="w-full">
              <SelectValue placeholder="Seleccionar opción de orden" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    {option.icon} {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
