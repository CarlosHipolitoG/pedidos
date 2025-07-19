
import type { Product } from './products';
import type { User } from './users';
import type { Settings } from './settings';


export const initialProductsData: Omit<Product, 'id'>[] = [
  {
    nombre: 'Cerveza Nacional',
    precio: 5000,
    existencias: 100,
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    categoria: 'BEBIDAS ALCOHÓLICAS',
    imagen: 'https://placehold.co/600x400.png',
  },
  {
    nombre: 'Cerveza Importada',
    precio: 8000,
    existencias: 100,
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    categoria: 'BEBIDAS ALCOHÓLICAS',
    imagen: 'https://placehold.co/600x400.png',
  },
  {
    nombre: 'Margarita Clásica',
    precio: 15000,
    existencias: 100,
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    categoria: 'COCTELES',
    imagen: 'https://placehold.co/600x400.png',
  },
  {
    nombre: 'Mojito Cubano',
    precio: 16000,
    existencias: 100,
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    categoria: 'COCTELES',
    imagen: 'https://placehold.co/600x400.png',
  },
  {
    nombre: 'Gin & Tonic',
    precio: 18000,
    existencias: 100,
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    categoria: 'COCTELES',
    imagen: 'https://placehold.co/600x400.png',
  },
  {
    nombre: 'Papas a la Francesa',
    precio: 7000,
    existencias: 100,
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    categoria: 'PICADAS',
    imagen: 'https://placehold.co/600x400.png',
  },
  {
    nombre: 'Alitas BBQ (x6)',
    precio: 12000,
    existencias: 100,
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    categoria: 'PICADAS',
    imagen: 'https://placehold.co/600x400.png',
  },
  {
    nombre: 'Nachos con Guacamole',
    precio: 10000,
    existencias: 100,
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    categoria: 'PICADAS',
    imagen: 'https://placehold.co/600x400.png',
  },
  {
    nombre: 'Jugo Natural',
    precio: 6000,
    existencias: 100,
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    categoria: 'BEBIDAS SIN ALCOHOL',
    imagen: 'https://placehold.co/600x400.png',
  },
  {
    nombre: 'Gaseosa',
    precio: 4000,
    existencias: 100,
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    categoria: 'BEBIDAS SIN ALCOHOL',
    imagen: 'https://placehold.co/600x400.png',
  },
  {
    nombre: 'Agua con Gas',
    precio: 3500,
    existencias: 100,
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    categoria: 'BEBIDAS SIN ALCOHOL',
    imagen: 'https://placehold.co/600x400.png',
  },
  {
    nombre: 'Botella de Aguardiente',
    precio: 70000,
    existencias: 50,
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    categoria: 'BOTELLAS',
    imagen: 'https://placehold.co/600x400.png',
  },
  {
    nombre: 'Botella de Ron',
    precio: 85000,
    existencias: 50,
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    categoria: 'BOTELLAS',
    imagen: 'https://placehold.co/600x400.png',
  },
  {
    nombre: 'Botella de Tequila',
    precio: 120000,
    existencias: 50,
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    categoria: 'BOTELLAS',
    imagen: 'https://placehold.co/600x400.png',
  },
  {
    nombre: 'Shot de Tequila',
    precio: 10000,
    existencias: 200,
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    categoria: 'SHOTS',
    imagen: 'https://placehold.co/600x400.png',
  },
  {
    nombre: 'Shot de Jägermeister',
    precio: 12000,
    existencias: 200,
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    categoria: 'SHOTS',
    imagen: 'https://placehold.co/600x400.png',
  }
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
