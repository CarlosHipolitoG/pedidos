export type Product = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  disponibilidad: 'PRODUCTO_DISPONIBLE' | 'PRODUCTO_AGOTADO';
  existencias: number;
  categoria: string;
};

export const mockProducts: Product[] = [
  {
    id: 1,
    nombre: 'AGUA',
    precio: 4500,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    existencias: 48,
    categoria: 'AGUA',
  },
  {
    id: 2,
    nombre: 'AGUA GAS',
    precio: 4500,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    existencias: 49,
    categoria: 'AGUA',
  },
  {
    id: 3,
    nombre: 'AGUARDIENTE ANTIOQUEÑO AZUL 375',
    precio: 60000,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    existencias: 4,
    categoria: 'AGUA', // This seems incorrect in the screenshot, should be AGUARDIENTE
  },
  {
    id: 4,
    nombre: 'AGUARDIENTE ANTIOQUEÑO AZUL 750',
    precio: 120000,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    existencias: 8,
    categoria: 'AGUA', // This seems incorrect in the screenshot, should be AGUARDIENTE
  },
  {
    id: 5,
    nombre: 'AGUARDIENTE ANTIOQUEÑO ROJO 375',
    precio: 60000,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    existencias: 3,
    categoria: 'AGUA', // This seems incorrect in the screenshot, should be AGUARDIENTE
  },
  {
    id: 6,
    nombre: 'AGUARDIENTE ANTIOQUEÑO ROJO 750',
    precio: 120000,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    existencias: 5,
    categoria: 'AGUA', // This seems incorrect in the screenshot, should be AGUARDIENTE
  },
  {
    id: 7,
    nombre: 'AGUARDIENTE ANTIOQUEÑO VERDE 375',
    precio: 60000,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    existencias: 8,
    categoria: 'AGUA', // This seems incorrect in the screenshot, should be AGUARDIENTE
  },
  {
    id: 11,
    nombre: 'AGUARDIENTE NECTAR DORADO 375 M',
    precio: 60000,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_AGOTADO',
    existencias: 0,
    categoria: 'AGUA', // This seems incorrect in the screenshot, should be AGUARDIENTE
  },
  {
    id: 12,
    nombre: 'AGUARDIENTE NÉCTAR DORADO 750 M',
    precio: 100000,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_DISPONIBLE',
    existencias: 2,
    categoria: 'AGUA', // This seems incorrect in the screenshot, should be AGUARDIENTE
  },
    {
    id: 14,
    nombre: 'AGUARDIENTE NÉCTAR ROJO 750 ML',
    precio: 100000,
    imagen: 'https://placehold.co/600x400.png',
    disponibilidad: 'PRODUCTO_AGOTADO',
    existencias: 0,
    categoria: 'AGUA', // This seems incorrect in the screenshot, should be AGUARDIENTE
  },
];
