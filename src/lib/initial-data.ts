
import type { Product } from './products';
import type { User } from './users';
import type { Settings } from './settings';


export const initialProductsData: Omit<Product, 'id'>[] = [
  {
    nombre: 'Mojito Cubano',
    precio: 18000,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    existencias: 80,
    categoria: 'Cócteles',
  },
  {
    nombre: 'Margarita Clásica',
    precio: 20000,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    existencias: 70,
    categoria: 'Cócteles',
  },
  {
    nombre: 'Gin & Tonic',
    precio: 22000,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    existencias: 90,
    categoria: 'Cócteles',
  },
  {
    nombre: 'Cerveza Nacional',
    precio: 6000,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    existencias: 200,
    categoria: 'Cervezas',
  },
  {
    nombre: 'Cerveza Importada',
    precio: 12000,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    existencias: 150,
    categoria: 'Cervezas',
  },
  {
    nombre: 'Cerveza Artesanal',
    precio: 15000,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_AGOTADO',
    existencias: 0,
    categoria: 'Cervezas',
  },
  {
    nombre: 'Jugo de Naranja',
    precio: 7000,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    existencias: 50,
    categoria: 'Bebidas Sin Alcohol',
  },
  {
    nombre: 'Limonada de Coco',
    precio: 9000,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    existencias: 60,
    categoria: 'Bebidas Sin Alcohol',
  },
];

export const initialUsersData: User[] = [
  {
    id: 1,
    name: 'Admin Principal',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    temporaryPassword: false
  },
  {
    id: 2,
    name: 'Juan Mesero',
    email: 'mesero@example.com',
    cedula: '10203040',
    password: '10203040', // Cedula is the password
    role: 'waiter',
    temporaryPassword: false
  },
];

export const initialSettings: Settings = {
  barName: 'HOLIDAYS FRIENDS',
  logoUrl: 'https://storage.googleapis.com/project-spark-b6b15e45/c015b678-9e5c-4467-8566-3c0a4c079237.png',
  backgroundUrl: 'https://storage.googleapis.com/project-spark-b6b15e45/dc407172-5953-4565-a83a-48a58ca7694f.png',
  promotionalImages: [
      { id: 1, src: "https://storage.googleapis.com/project-spark-b6b15e45/c015b678-9e5c-4467-8566-3c0a4c079237.png", alt: "Promoción 1", hint: "promotion event" },
      { id: 2, src: "https://storage.googleapis.com/project-spark-b6b15e45/f8365f57-631d-4475-a083-207d5781a7b4.png", alt: "Promoción 2", hint: "special offer" },
      { id: 3, src: "https://storage.googleapis.com/project-spark-b6b15e45/dc407172-5953-4565-a83a-48a58ca7694f.png", alt: "Promoción 3", hint: "discount party" },
      { id: 4, src: "https://storage.googleapis.com/project-spark-b6b15e45/05459f37-64cd-4e89-9a7c-1795c6439167.png", alt: "Promoción 4", hint: "happy hour" },
  ]
};
