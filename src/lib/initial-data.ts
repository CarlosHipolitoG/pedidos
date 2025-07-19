
import type { Product } from './products';
import type { User } from './users';
import type { Settings } from './settings';


export const initialProductsData: Product[] = [
    // Cervezas
    { id: 1, nombre: 'Cerveza Poker', precio: 4500, imagen: 'https://www.bavaria.co/sites/g/files/seuoyk1666/files/2023-11/POKER_BOTELLA.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 100, categoria: 'Cervezas' },
    { id: 2, nombre: 'Cerveza Club Colombia Dorada', precio: 6000, imagen: 'https://www.bavaria.co/sites/g/files/seuoyk1666/files/2023-10/Club%20Colombia%20Dorada.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 80, categoria: 'Cervezas' },
    { id: 3, nombre: 'Cerveza Aguila Light', precio: 4500, imagen: 'https://www.bavaria.co/sites/g/files/seuoyk1666/files/2023-10/Aguila%20Light_0.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 120, categoria: 'Cervezas' },
    { id: 4, nombre: 'Cerveza Corona', precio: 12000, imagen: 'https://www.bavaria.co/sites/g/files/seuoyk1666/files/2023-10/Corona.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 50, categoria: 'Cervezas' },

    // Licores
    { id: 5, nombre: 'Aguardiente Antioqueño Azul 750ml', precio: 120000, imagen: 'https://www.dislicores.com/wp-content/uploads/2023/12/LICORES-DISLICORES-153-AGUARDIENTE-ANTIOQUENO-SIN-AZUCAR-750-ML.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 20, categoria: 'Licores' },
    { id: 6, nombre: 'Ron Medellín Añejo 750ml', precio: 120000, imagen: 'https://www.dislicores.com/wp-content/uploads/2023/04/LICORES-DISLICORES-582-RON-MEDELLIN-ANEJO-750ML.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 15, categoria: 'Licores' },
    { id: 7, nombre: 'Tequila José Cuervo Especial 750ml', precio: 160000, imagen: 'https://www.dislicores.com/wp-content/uploads/2023/04/LICORES-DISLICORES-708-TEQUILA-JOSE-CUERVO-ESPECIAL-750ML.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 10, categoria: 'Licores' },

    // Gaseosas y Aguas
    { id: 8, nombre: 'Coca-Cola Personal', precio: 4500, imagen: 'https://supertiendascomunal.com/supercomunal/wp-content/uploads/2021/04/GASEOSA-COCA-COLA-250ML-BOTELLA-NO-RETORNABLE-1.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 200, categoria: 'Gaseosas y Aguas' },
    { id: 9, nombre: 'Agua con Gas', precio: 4500, imagen: 'https://images.squarespace-cdn.com/content/v1/55697ab8e4b084f6ac0581ef/1543993440671-4K5ZMHREJWHVDD8CHJMP/shutterstock_105912563-1.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 150, categoria: 'Gaseosas y Aguas' },
    { id: 10, nombre: 'Agua sin Gas', precio: 4500, imagen: 'https://carulla.vtexassets.com/arquivos/ids/2290135/Agua-Sin-Gas-CRISTAL-600-ml-302195_a.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 150, categoria: 'Gaseosas y Aguas' },

    // Snacks
    { id: 11, nombre: 'Papas Margarita Pollo', precio: 3000, imagen: 'https://jumbocolombiafood.vteximg.com.br/arquivos/ids/3628795-750-750/7702025078518-1.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 50, categoria: 'Snacks' },
    { id: 12, nombre: 'Detodito BBQ', precio: 4000, imagen: 'https://supermarket-staging.s3.us-east-2.amazonaws.com/product/MECATO-DETODITO-MIX-BBQ-FAMILIAR-165g-Pepsico-alimentos-snacks-1.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 40, categoria: 'Snacks' },
    { id: 13, nombre: 'Maní La Especial', precio: 3000, imagen: 'https://vaquitaexpress.co/wp-content/uploads/2020/05/mani-sal-la-especial-184-gr.jpg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'Snacks' },

    // Cocteles
    { id: 14, nombre: 'Margarita Clásico', precio: 15000, imagen: 'https://images.absolutdrinks.com/drink-images/Raw/Absolut/ae35c9a2-51a8-48b4-a5c9-27805d7621c4.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 30, categoria: 'Cocteles' },
    { id: 15, nombre: 'Mojito Cubano', precio: 18000, imagen: 'https://imag.bonviveur.com/mojito-cubano.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 25, categoria: 'Cocteles' },
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
