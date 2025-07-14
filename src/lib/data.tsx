import {
  GlassWater,
  Beer,
  Stethoscope,
  Cookie,
  Beef,
  Package,
  Wine,
  Sparkles,
  Droplets,
  Container,
} from 'lucide-react';
import type { ReactElement } from 'react';

export interface MenuItem {
  name: string;
  slug: string;
  icon: ReactElement;
}

export const menuItems: MenuItem[] = [
  { name: 'AGUARDIENTE', slug: 'aguardiente', icon: <GlassWater /> },
  { name: 'CERVEZAS', slug: 'cervezas', icon: <Beer /> },
  { name: 'FARMACIA', slug: 'farmacia', icon: <Stethoscope /> },
  { name: 'DULCES', slug: 'dulces', icon: <Cookie /> },
  { name: 'SNACKS', slug: 'snacks', icon: <Beef /> },
  { name: 'GASEOSAS', slug: 'gaseosas', icon: <Package /> },
  { name: 'COCTELES', slug: 'cocteles', icon: <Wine /> },
  { name: 'BEBIDAS ENERGIZANTES', slug: 'energizantes', icon: <Sparkles /> },
  { name: 'AGUA', slug: 'agua', icon: <Droplets /> },
  { name: 'RON', slug: 'ron', icon: <Container /> },
];

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export const productsByCategory: Record<string, Product[]> = {
  aguardiente: [
    {
      id: 1,
      name: 'Aguardiente Antioqueño',
      price: 45000,
      imageUrl: 'https://placehold.co/400x400/e2e8f0/000000?text=Aguardiente',
    },
    {
      id: 2,
      name: 'Aguardiente Nectar',
      price: 42000,
      imageUrl: 'https://placehold.co/400x400/e2e8f0/000000?text=Aguardiente',
    },
  ],
  cervezas: [
    {
      id: 3,
      name: 'Club Colombia Dorada',
      price: 4500,
      imageUrl: 'https://placehold.co/400x400/e2e8f0/000000?text=Cerveza',
    },
    {
      id: 4,
      name: 'Aguila Light',
      price: 3800,
      imageUrl: 'https://placehold.co/400x400/e2e8f0/000000?text=Cerveza',
    },
     {
      id: 5,
      name: 'Corona',
      price: 6000,
      imageUrl: 'https://placehold.co/400x400/e2e8f0/000000?text=Cerveza',
    },
  ],
  // Add other categories with their products here
  farmacia: [],
  dulces: [],
  snacks: [],
  gaseosas: [],
  cocteles: [],
  energizantes: [],
  agua: [],
  ron: [],
};
