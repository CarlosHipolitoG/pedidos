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
      imageUrl: 'https://www.wradio.com.co/resizer/v2/https%3A%2F%2Fcloudfront-us-east-1.images.arcpublishing.com%2Fprisaradioco%2FZ555L6YSCNFRZLBXOP6HVT3T3Y.png?auth=1a76c0e3e7845f95d52253381e4b3c0c324e937d5786a5960098f654b9d03126&width=1200&height=900&quality=70',
    },
    {
      id: 2,
      name: 'Aguardiente Nectar',
      price: 42000,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq_x-5sO5v1Z2dYg4k3k_bF_K_L_g_bHnQ&s',
    },
  ],
  cervezas: [
    {
      id: 3,
      name: 'Club Colombia Dorada',
      price: 4500,
      imageUrl: 'https://i0.wp.com/bacidangelo-shop.com/wp-content/uploads/2022/10/CLUB-COLOMBIA.png?fit=500%2C500&ssl=1',
    },
    {
      id: 4,
      name: 'Aguila Light',
      price: 3800,
      imageUrl: 'https://oflash.la/wp-content/uploads/2022/07/cerveza-aguila-light-lata-330-ml.jpg',
    },
     {
      id: 5,
      name: 'Corona',
      price: 6000,
      imageUrl: 'https://gourmetfamily.co/wp-content/uploads/2021/05/Cerveza-Corona-Extra-Botella-355-ml.jpg',
    },
  ],
  farmacia: [
     {
      id: 6,
      name: 'Dolex',
      price: 2500,
      imageUrl: 'https://proartistas.com/wp-content/uploads/2023/12/dolex-bebe.jpg',
    },
     {
      id: 7,
      name: 'Alka-Seltzer',
      price: 3000,
      imageUrl: 'https://i.ytimg.com/vi/aZ37aC1l3kE/maxresdefault.jpg',
    },
  ],
  dulces: [
    {
      id: 8,
      name: 'Chocolatina Jet',
      price: 1000,
      imageUrl: 'https://www.liceosanjose.edu.co/wp-content/uploads/2020/08/Chocolatina-jet-pequena.jpg',
    },
     {
      id: 9,
      name: 'Barrilete',
      price: 1200,
      imageUrl: 'https://eventostrinity.com/wp-content/uploads/2021/04/Barrilete-x-48-und.jpg',
    },
  ],
  snacks: [
    {
      id: 10,
      name: 'Papas Margarita Pollo',
      price: 3000,
      imageUrl: 'https://eventosbellasuiza.co/wp-content/uploads/2020/07/papas-pollo.jpg',
    },
     {
      id: 11,
      name: 'Doritos',
      price: 3500,
      imageUrl: 'https://diariodechiapas.com/wp-content/uploads/2022/01/DORITOS.jpeg',
    },
  ],
  gaseosas: [
     {
      id: 12,
      name: 'Coca-cola',
      price: 3000,
      imageUrl: 'https://amordidas.com.co/wp-content/uploads/2021/08/coca-cola-sabor-original-600-ml.jpg',
    },
    {
      id: 13,
      name: 'Sprite',
      price: 2800,
      imageUrl: 'https://pipelandia.com/wp-content/uploads/2020/07/sprite-400-ml-pet-x12.jpg',
    },
  ],
  cocteles: [],
  energizantes: [],
  agua: [],
  ron: [],
};
