import type { Event, EventCategory } from '@/types';

export const eventCategories: EventCategory[] = ["Birthday", "Wedding", "Corporate", "Festival", "Workshop", "Anniversary", "Charity"];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Enchanted Forest Wedding',
    description: 'A magical wedding ceremony and reception set in a lush, enchanted forest theme. Experience romance under the stars.',
    images: [
      { url: 'https://placehold.co/800x600.png', hint: 'forest wedding' },
      { url: 'https://placehold.co/800x600.png', hint: 'wedding decoration' },
      { url: 'https://placehold.co/800x600.png', hint: 'bride groom' },
    ],
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    category: 'Wedding',
    popularity: 95,
    location: 'Willow Creek Forest, CA',
  },
  {
    id: '2',
    title: 'Superhero Kids Birthday Bash',
    description: 'An action-packed birthday party for little superheroes! Games, costumes, and heroic fun await.',
    images: [
      { url: 'https://placehold.co/800x600.png', hint: 'kids birthday' },
      { url: 'https://placehold.co/800x600.png', hint: 'superhero party' },
    ],
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    category: 'Birthday',
    popularity: 88,
    location: 'Adventure Zone, NY',
  },
  {
    id: '3',
    title: 'Innovatech Corporate Summit',
    description: 'A premier corporate event for tech leaders and innovators. Networking, keynotes, and breakthrough ideas.',
    images: [
      { url: 'https://placehold.co/800x600.png', hint: 'corporate conference' },
      { url: 'https://placehold.co/800x600.png', hint: 'business networking' },
      { url: 'https://placehold.co/800x600.png', hint: 'keynote speaker' },
    ],
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    category: 'Corporate',
    popularity: 75,
    location: 'Grand Convention Center, TX',
  },
  {
    id: '4',
    title: 'Summer Beats Music Festival',
    description: 'The hottest music festival of the summer! Featuring top artists, food trucks, and an unforgettable vibe.',
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
    title: 'Artisan Pottery Workshop',
    description: 'Discover your inner artist at our hands-on pottery workshop. Create unique pieces to take home.',
    images: [
      { url: 'https://placehold.co/800x600.png', hint: 'pottery workshop' },
      { url: 'https://placehold.co/800x600.png', hint: 'craft class' },
    ],
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    category: 'Workshop',
    popularity: 60,
    location: 'Creative Studio, OR',
  },
  {
    id: '6',
    title: 'Golden Anniversary Celebration',
    description: 'A heartwarming celebration for a 50th wedding anniversary. Join us for an evening of memories and joy.',
    images: [
      { url: 'https://placehold.co/800x600.png', hint: 'anniversary party' },
      { url: 'https://placehold.co/800x600.png', hint: 'elegant dinner' },
    ],
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
    category: 'Anniversary',
    popularity: 80,
    location: 'The Grand Ballroom, IL',
  },
   {
    id: '7',
    title: 'Community Charity Gala',
    description: 'An elegant gala to support local charities. An evening of fine dining, auctions, and giving back.',
    images: [
      { url: 'https://placehold.co/800x600.png', hint: 'charity gala' },
      { url: 'https://placehold.co/800x600.png', hint: 'formal event' },
      { url: 'https://placehold.co/800x600.png', hint: 'auction event' },
    ],
    date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    category: 'Charity',
    popularity: 70,
    location: 'City Art Museum, WA',
  }
];
