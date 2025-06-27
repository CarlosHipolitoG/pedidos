import type { Event, EventCategory } from '@/types';

export const eventCategories: EventCategory[] = ["Cumpleaños", "Boda", "Corporativo", "Festival", "QuinceAños", "Aniversario", "Graduación", "Anchetas y Regalos", "Tortas Personalizadas"];

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
    title: 'eventos corporativos',
    description: 'Un evento corporativo de primer nivel para líderes e innovadores tecnológicos. Networking, ponencias y ideas revolucionarias.',
    images: [
      { url: 'https://www.wradio.com.co/resizer/v2/K556I4FRVBGFTIVSJKKKPJRSKQ.jpg?auth=7529b86c3f6f95bd0f292794ca57905ad758c59554c410048f8ec6d00726a876&width=800&height=600&quality=70&smart=true', hint: 'corporate event' },
      { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6um0kf8bpmTmpKS_bhgRIh2NR-dsu2CNHVA&s', hint: 'business meeting' },
      { url: 'https://proartistas.com/assets/images/eventos/mariachis3.jpg', hint: 'corporate party' },
    ],
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    category: 'Corporativo',
    popularity: 75,
    location: 'Grand Convention Center, TX',
  },
  {
    id: '4',
    title: 'Prom 2025',
    description: 'La noche más esperada del año. Celebra tu graduación con estilo en una fiesta inolvidable con tus compañeros.',
    images: [
      { url: 'https://www.liceosanjose.edu.co/wp-content/uploads/2023/11/fiesta-prom-2023.jpg', hint: 'prom party' },
      { url: 'https://i.ytimg.com/vi/6Lukyj13QQk/sddefault.jpg', hint: 'prom night' },
      { url: 'https://eventostrinity.com/wp-content/uploads/2021/04/tupromtrinity-eventostrinity-11-768x512.jpg', hint: 'prom dance' },
    ],
    date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Graduación',
    popularity: 98,
    location: 'Grand Ballroom, CA',
  },
  {
    id: '5',
    title: 'Fiesta de Quince Años de Ensueño',
    description: 'Celebra una transición mágica a la feminidad con una fiesta de quince años inolvidable, llena de elegancia, alegría y momentos para atesorar.',
    images: [
      { url: 'https://diariodechiapas.com/wp-content/uploads/2025/02/Llamado-1-8.jpg', hint: 'quinceanera dress' },
      { url: 'https://oflash.la/wp-content/uploads/2022/06/Quince-anos-de-Desiree-Caballero-9.jpg', hint: 'quinceanera party' },
      { url: 'https://i.pinimg.com/originals/d5/39/f4/d539f4ba4094e0a2983d42d334881606.jpg', hint: 'quinceanera celebration' },
    ],
    date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'QuinceAños',
    popularity: 92,
    location: 'Salón de Fiestas "La Joya"',
  },
  {
    id: '6',
    title: 'Celebración de Aniversario de Oro',
    description: 'Una conmovedora celebración por un 50 aniversario de bodas. Acompáñanos en una velada de recuerdos y alegría.',
    images: [
      { url: 'https://eventosbellasuiza.co/wp-content/uploads/2024/09/pexels-kampus-8790779-min-1024x684.jpg', hint: 'anniversary party' },
      { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJAwvhB5icU2QpF566ZQm2pfskvgMBkzTsEFNFuQnlqrRbQJ38TNQX2YBPCL6_8m01Cq0&usqp=CAU', hint: 'elegant dinner' },
      { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYQoiKZ_tWOxuL48yxN3L_NURYJsDoA2Fr-CNELg9ut0K-Rz9TMR440A5lryJb32KWwJU&usqp=CAU', hint: 'golden anniversary' },
    ],
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
    category: 'Aniversario',
    popularity: 80,
    location: 'The Grand Ballroom, IL',
  },
  {
    id: '7',
    title: 'Anchetas y Regalos',
    description: 'Sorprende a tus seres queridos con nuestras anchetas y regalos personalizados. Perfectos para cualquier ocasión, llenos de productos de alta calidad y presentados con un toque de elegancia.',
    images: [
      { url: 'https://placehold.co/600x400.png', hint: 'gift basket' },
      { url: 'https://placehold.co/600x400.png', hint: 'personalized gift' },
      { url: 'https://placehold.co/600x400.png', hint: 'chocolate box' },
    ],
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Anchetas y Regalos',
    popularity: 85,
    location: 'Servicio a Domicilio',
  },
  {
    id: '8',
    title: 'Tortas Personalizadas',
    description: 'Celebra tus momentos especiales con nuestras tortas personalizadas. Diseños únicos y sabores deliciosos que harán de tu evento algo inolvidable.',
    images: [
      { url: 'https://placehold.co/600x400.png', hint: 'custom cake' },
      { url: 'https://placehold.co/600x400.png', hint: 'wedding cake' },
      { url: 'https://placehold.co/600x400.png', hint: 'birthday cake' },
    ],
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Tortas Personalizadas',
    popularity: 90,
    location: 'Servicio a Domicilio',
  }
];
