
'use client';

import {useAppStore, store} from './store';

export type Product = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  disponibilidad: 'PRODUCTO_DISPONIBLE' | 'PRODUCTO_AGOTADO';
  existencias: number;
  categoria: string;
};

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

// --- Hook to get products from the central store ---
export function useProducts() {
    const { state, isInitialized } = useAppStore();
    return { products: state.products, isInitialized };
}

// --- Data Manipulation Functions ---

export const addProduct = (productData: Omit<Product, 'id'>): void => {
    store.updateState(currentState => {
        const currentProducts = currentState.products || [];
        const nextProductId = (currentProducts.reduce((maxId, p) => Math.max(p.id, maxId), 0) || 0) + 1;
        const newProduct: Product = {
            ...productData,
            id: nextProductId,
        };
        const products = [...currentProducts, newProduct].sort((a,b) => a.id - b.id);
        return { ...currentState, products };
    });
};

export const updateProduct = (productId: number, updatedData: Partial<Omit<Product, 'id'>>): void => {
    store.updateState(currentState => {
        const products = currentState.products.map(p =>
            p.id === productId ? { ...p, ...updatedData } : p
        ).sort((a,b) => a.id - b.id);
        return { ...currentState, products };
    });
};

export const deleteProduct = (productId: number): void => {
    store.updateState(currentState => {
        const products = currentState.products.filter(p => p.id !== productId);
        return { ...currentState, products };
    });
};

    
