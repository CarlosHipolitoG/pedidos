import type { Event, EventCategory } from '@/types';

export const eventCategories: EventCategory[] = ["Cumpleaños", "Boda", "Corporativo", "Festival", "Taller", "Aniversario", "Beneficencia"];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Boda en el Bosque Encantado',
    description: 'Una ceremonia y recepción de boda mágicas con el tema de un frondoso bosque encantado. Vive el romance bajo las estrellas.',
    images: [
      { url: 'https://www.m-moments.com/myweddingblog/wp-content/uploads/2019/01/CatalinaJoan-by-FonteyneCo_508.jpg', hint: 'forest wedding' },
      { url: 'https://marryspain.com/blog/wp-content/uploads/2021/08/boda-bosque-encantado-jardin-las-adelfas.jpg', hint: 'wedding decoration' },
      { url: 'https://www.hola.com/horizon/original_aspect_ratio/9327a46045c5-netflix-bridgerton-a.jpg?im=Resize=(960),type=downsize', hint: 'bride groom' },
    ],
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    category: 'Boda',
    popularity: 95,
    location: 'Willow Creek Forest, CA',
  },
  {
    id: '2',
    title: 'Fiesta de Cumpleaños de Superhéroes',
    description: '¡Una fiesta de cumpleaños llena de acción para pequeños superhéroes! Juegos, disfraces y diversión heroica te esperan.',
    images: [
      { url: 'https://www.limohummerjb.es/wp-content/uploads/2024/03/fiestasinfantiles4.jpg', hint: 'kids party' },
      { url: 'https://i.pinimg.com/736x/ce/e5/cc/cee5cc084f97ba3dceb7d34a5127dc73.jpg', hint: 'spiderman theme' },
      { url: 'https://i.pinimg.com/564x/9a/6a/dc/9a6adcbed7d90b636082a467fc4dc7ca.jpg', hint: 'superhero decorations' },
    ],
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    category: 'Cumpleaños',
    popularity: 88,
    location: 'Adventure Zone, NY',
  },
  {
    id: '3',
    title: 'Cumbre Corporativa Innovatech',
    description: 'Un evento corporativo de primer nivel para líderes e innovadores tecnológicos. Networking, ponencias y ideas revolucionarias.',
    images: [
      { url: 'https://placehold.co/800x600.png', hint: 'corporate conference' },
      { url: 'https://placehold.co/800x600.png', hint: 'business networking' },
      { url: 'https://placehold.co/800x600.png', hint: 'keynote speaker' },
    ],
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    category: 'Corporativo',
    popularity: 75,
    location: 'Grand Convention Center, TX',
  },
  {
    id: '4',
    title: 'Festival de Música Summer Beats',
    description: '¡El festival de música más candente del verano! Con los mejores artistas, food trucks y un ambiente inolvidable.',
    images: [
      { url: 'https://placehold.co/800x600.png', hint: 'music festival' },
      { url: 'https://placehold.co/800x600.png', hint: 'live concert' },
      { url: 'https://placehold.co/800x600.png', hint: 'festival crowd' },
    ],
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (for sorting test)
    category: 'Festival',
    popularity: 98,
    location: 'Sunnyvale Park, FL',
  },
  {
    id: '5',
    title: 'Taller de Cerámica Artesanal',
    description: 'Descubre tu artista interior en nuestro taller práctico de cerámica. Crea piezas únicas para llevar a casa.',
    images: [
      { url: 'https://placehold.co/800x600.png', hint: 'pottery workshop' },
      { url: 'https://placehold.co/800x600.png', hint: 'craft class' },
    ],
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    category: 'Taller',
    popularity: 60,
    location: 'Creative Studio, OR',
  },
  {
    id: '6',
    title: 'Celebración de Aniversario de Oro',
    description: 'Una conmovedora celebración por un 50 aniversario de bodas. Acompáñanos en una velada de recuerdos y alegría.',
    images: [
      { url: 'https://placehold.co/800x600.png', hint: 'anniversary party' },
      { url: 'https://placehold.co/800x600.png', hint: 'elegant dinner' },
    ],
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
    category: 'Aniversario',
    popularity: 80,
    location: 'The Grand Ballroom, IL',
  },
   {
    id: '7',
    title: 'Gala Benéfica Comunitaria',
    description: 'Una elegante gala para apoyar a organizaciones benéficas locales. Una noche de alta cocina, subastas y contribuciones.',
    images: [
      { url: 'https://placehold.co/800x600.png', hint: 'charity gala' },
      { url: 'https://placehold.co/800x600.png', hint: 'formal event' },
      { url: 'https://placehold.co/800x600.png', hint: 'auction event' },
    ],
    date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    category: 'Beneficencia',
    popularity: 70,
    location: 'City Art Museum, WA',
  }
];
